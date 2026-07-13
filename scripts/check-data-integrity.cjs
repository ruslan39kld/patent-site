#!/usr/bin/env node
// Report-only integrity check between the DB's stored /uploads/... references
// and what's actually on disk. Never deletes anything — just prints a report,
// since a false positive here (e.g. a file that's mid-upload) could otherwise
// cause real data loss if this were wired to auto-delete.
//
// Finds:
//  - "broken" refs: a DB field points at /uploads/<file> but the file is gone
//    (e.g. from before the persistent-volume fix, or a wipe on redeploy)
//  - "orphaned" files: a file sits in uploads/ but nothing in the DB
//    references it any more (e.g. left behind after "Заменить" replaced it)
//
// Usage: node scripts/check-data-integrity.cjs

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DATA_DIR = process.env.DATA_DIR || '/data';
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DB_PATH = path.join(DATA_DIR, 'db.sqlite');

const SECTIONS = [
  'content', 'services', 'prices', 'cases', 'blogPosts',
  'faqItems', 'leads', 'reviews', 'customBlocks', 'leadMagnets',
  'stats', 'botConfig',
];

function findUploadRefs(value, pathSoFar, results) {
  if (typeof value === 'string') {
    if (value.startsWith('/uploads/')) {
      results.push({ path: pathSoFar, url: value });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => findUploadRefs(v, `${pathSoFar}[${i}]`, results));
    return;
  }
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      findUploadRefs(value[key], `${pathSoFar}.${key}`, results);
    }
  }
}

function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`No database found at ${DB_PATH}`);
    process.exit(1);
  }
  const db = new Database(DB_PATH, { readonly: true });

  const allRefs = [];
  for (const section of SECTIONS) {
    const row = db.prepare(`SELECT data FROM ${section} WHERE id = 1`).get();
    if (!row) continue;
    const data = JSON.parse(row.data);
    findUploadRefs(data, section, allRefs);
  }
  db.close();

  const referencedFilenames = new Set(allRefs.map((r) => path.basename(r.url)));
  const filesOnDisk = fs.existsSync(UPLOADS_DIR)
    ? fs.readdirSync(UPLOADS_DIR).filter((f) => !f.startsWith('.tmp-'))
    : [];
  const filesOnDiskSet = new Set(filesOnDisk);

  const broken = allRefs.filter((r) => !filesOnDiskSet.has(path.basename(r.url)));
  const orphaned = filesOnDisk.filter((f) => !referencedFilenames.has(f));

  console.log(`DB: ${DB_PATH}`);
  console.log(`Uploads dir: ${UPLOADS_DIR}`);
  console.log(`Total /uploads/ references found in DB: ${allRefs.length}`);
  console.log(`Total files on disk: ${filesOnDisk.length}`);
  console.log('');

  if (broken.length === 0) {
    console.log('No broken references — every DB path resolves to a file on disk.');
  } else {
    console.log(`BROKEN REFERENCES (${broken.length}) — DB points at a file that no longer exists:`);
    for (const r of broken) {
      console.log(`  ${r.path} -> ${r.url}`);
    }
  }
  console.log('');

  if (orphaned.length === 0) {
    console.log('No orphaned files — every file on disk is referenced somewhere in the DB.');
  } else {
    console.log(`ORPHANED FILES (${orphaned.length}) — on disk but not referenced by any record:`);
    for (const f of orphaned) {
      const stat = fs.statSync(path.join(UPLOADS_DIR, f));
      console.log(`  ${f} (${(stat.size / 1024).toFixed(1)} KB, modified ${stat.mtime.toISOString()})`);
    }
  }

  if (broken.length > 0 || orphaned.length > 0) {
    process.exitCode = 1;
  }
}

main();
