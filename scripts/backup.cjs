#!/usr/bin/env node
// Backs up the persistent DATA_DIR (uploads/ + db.sqlite) into a rotated set
// of timestamped tar.gz archives under DATA_DIR/backups.
//
// Amvera already keeps its own backups of the persistent volume, but only
// for the last 2 days (docs.amvera.ru/applications/storage.html). This gives
// a longer, independently-rotated history and — unlike a raw file copy of
// db.sqlite — uses SQLite's own backup API so a concurrent write (WAL mode)
// can never produce a torn/inconsistent snapshot.
//
// This does NOT protect against loss of the persistent volume itself; for
// that, these archives would need to be shipped off-platform (S3-compatible
// storage, etc.), which needs real credentials and is a separate decision.
//
// Usage: node scripts/backup.cjs
// Wire this up as an Amvera Cron Job (docs.amvera.ru/cron/cronjobs.html),
// e.g. daily at 03:00 UTC (06:00 Moscow time): node scripts/backup.cjs

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const Database = require('better-sqlite3');

const DATA_DIR = process.env.DATA_DIR || '/data';
const DB_PATH = path.join(DATA_DIR, 'db.sqlite');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
const KEEP_LAST = Number(process.env.BACKUP_KEEP_LAST) || 7;

async function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`No database found at ${DB_PATH} — nothing to back up.`);
    process.exit(1);
  }
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-'));
  const dbSnapshotPath = path.join(workDir, 'db.sqlite');

  const db = new Database(DB_PATH, { readonly: true });
  try {
    await db.backup(dbSnapshotPath);
  } finally {
    db.close();
  }

  const archivePath = path.join(BACKUPS_DIR, `backup-${stamp}.tar.gz`);
  const tarArgs = ['-czf', archivePath, '-C', workDir, 'db.sqlite'];
  if (fs.existsSync(UPLOADS_DIR)) {
    tarArgs.push('-C', DATA_DIR, 'uploads');
  }
  execFileSync('tar', tarArgs);
  fs.rmSync(workDir, { recursive: true, force: true });
  console.log(`Backup written: ${archivePath} (${fs.statSync(archivePath).size} bytes)`);

  const existing = fs.readdirSync(BACKUPS_DIR)
    .filter((f) => f.startsWith('backup-') && f.endsWith('.tar.gz'))
    .sort();
  const toDelete = existing.slice(0, Math.max(0, existing.length - KEEP_LAST));
  for (const f of toDelete) {
    fs.unlinkSync(path.join(BACKUPS_DIR, f));
    console.log(`Removed old backup: ${f}`);
  }
}

main().catch((err) => {
  console.error('Backup failed:', err);
  process.exit(1);
});
