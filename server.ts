import express from 'express';
import https from 'https';
import tls from 'tls';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import Database from 'better-sqlite3';
import * as dotenv from 'dotenv';
import { initialData } from './src/store/initialData';

const __dirname = process.cwd();
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-gigachat-auth-key');
  if (_req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// DATA_DIR must point at a persistent volume mount (Amvera mounts its "Data"
// folder at /data by default — see run.persistenceMount in amvera.yml). If it
// isn't writable/mountable, we fall back to a directory under the app's own
// working tree so local dev keeps working — but that fallback is NOT
// persistent: it lives inside the deploy artifact and is wiped on every
// rebuild/redeploy. Warn loudly so this is visible in deploy logs rather than
// silently losing uploads on the next release.
const DATA_DIR = process.env.DATA_DIR || '/data';
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
let usingPersistentDataDir = true;
try {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch {}
if (!fs.existsSync(UPLOADS_DIR)) {
  usingPersistentDataDir = false;
}
const resolvedDataDir = usingPersistentDataDir
  ? DATA_DIR
  : path.join(process.cwd(), 'data');
fs.mkdirSync(path.join(resolvedDataDir, 'uploads'), { recursive: true });

if (!usingPersistentDataDir) {
  console.warn(
    `[PERSISTENCE WARNING] "${DATA_DIR}" is not writable/mounted — falling back to ` +
    `"${resolvedDataDir}", which lives inside the app's own working directory and will ` +
    `be WIPED on the next rebuild/redeploy. All uploaded files and the SQLite DB are at ` +
    `risk of data loss until a persistent volume is mounted at ${DATA_DIR} ` +
    `(or DATA_DIR is pointed at one).`
  );
}

const DB_PATH = path.join(resolvedDataDir, 'db.sqlite');
const RESOLVED_UPLOADS_DIR = path.join(resolvedDataDir, 'uploads');

// Clean up any stray temp files left behind by an upload that was interrupted
// mid-write (crash, forced restart) before it could be renamed into place —
// see the atomic-write storage engine below. These are never referenced by
// any URL, so they're always safe to delete.
for (const f of fs.readdirSync(RESOLVED_UPLOADS_DIR)) {
  if (f.startsWith('.tmp-')) {
    try { fs.unlinkSync(path.join(RESOLVED_UPLOADS_DIR, f)); } catch {}
  }
}

// Filenames are unique per upload (timestamp + uuid, see multer storage below),
// so a new upload always gets a new URL — safe to cache aggressively forever.
app.use('/uploads', express.static(RESOLVED_UPLOADS_DIR, { maxAge: '1y', immutable: true }));

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

const SECTIONS = [
  'content', 'services', 'prices', 'cases', 'blogPosts',
  'faqItems', 'leads', 'reviews', 'customBlocks', 'leadMagnets',
  'stats', 'botConfig',
] as const;
type Section = typeof SECTIONS[number];

for (const section of SECTIONS) {
  db.exec(`CREATE TABLE IF NOT EXISTS ${section} (id INTEGER PRIMARY KEY CHECK (id = 1), data TEXT NOT NULL)`);
  // Older DBs (created before optimistic-concurrency support) won't have this
  // column yet; SQLite has no "ADD COLUMN IF NOT EXISTS" on the versions we
  // support widely, so just swallow the "duplicate column" error on rerun.
  try { db.exec(`ALTER TABLE ${section} ADD COLUMN rev INTEGER NOT NULL DEFAULT 1`); } catch {}
}

function getSection(section: Section): unknown {
  const row = db.prepare(`SELECT data FROM ${section} WHERE id = 1`).get() as { data: string } | undefined;
  return row ? JSON.parse(row.data) : null;
}
function getSectionRow(section: Section): { data: unknown; rev: number } | null {
  const row = db.prepare(`SELECT data, rev FROM ${section} WHERE id = 1`).get() as { data: string; rev: number } | undefined;
  return row ? { data: JSON.parse(row.data), rev: row.rev } : null;
}
function setSection(section: Section, value: unknown) {
  db.prepare(`INSERT INTO ${section} (id, data, rev) VALUES (1, ?, 1) ON CONFLICT(id) DO UPDATE SET data = excluded.data, rev = rev + 1`).run(JSON.stringify(value));
}

// Compare-and-swap write: only applies when `expectedRev` matches the row's
// current rev (or the row doesn't exist yet), so two admins saving the same
// section at nearly the same time can't silently clobber one another — the
// second writer gets a conflict back instead of an unnoticed lost update.
// `expectedRev === undefined` opts out of the check (used for seeding and by
// any caller that doesn't track revs), preserving unconditional-write callers.
function setSectionIfMatch(
  section: Section,
  value: unknown,
  expectedRev: number | undefined
): { ok: true; rev: number } | { ok: false; current: { data: unknown; rev: number } } {
  const existing = db.prepare(`SELECT rev FROM ${section} WHERE id = 1`).get() as { rev: number } | undefined;
  if (!existing) {
    db.prepare(`INSERT INTO ${section} (id, data, rev) VALUES (1, ?, 1)`).run(JSON.stringify(value));
    return { ok: true, rev: 1 };
  }
  if (expectedRev !== undefined && expectedRev !== existing.rev) {
    return { ok: false, current: getSectionRow(section)! };
  }
  const newRev = existing.rev + 1;
  db.prepare(`UPDATE ${section} SET data = ?, rev = ? WHERE id = 1`).run(JSON.stringify(value), newRev);
  return { ok: true, rev: newRev };
}

for (const section of SECTIONS) {
  if (getSection(section) === null) {
    setSection(section, (initialData as unknown as Record<string, unknown>)[section] ?? null);
  }
}

app.get('/api/data', (_req, res) => {
  const result: Record<string, unknown> = {};
  const revs: Record<string, number> = {};
  for (const section of SECTIONS) {
    const row = getSectionRow(section);
    result[section] = row ? row.data : null;
    revs[section] = row ? row.rev : 0;
  }
  result._revs = revs;
  res.json(result);
});

app.post('/api/data', (req, res) => {
  const body = req.body as Record<string, unknown>;

  const expectedRevs = (body._revs as Record<string, number>) || {};
  const sectionsToWrite = SECTIONS.filter((s) => body[s] !== undefined);
  if (sectionsToWrite.length === 0) return res.json({ ok: true, revs: {} });

  let conflict: { section: Section; current: { data: unknown; rev: number } } | null = null;
  const newRevs: Record<string, number> = {};

  // All sections in one save are applied atomically: if any of them conflicts,
  // none of them are written, so a save never partially lands.
  const applyAll = db.transaction(() => {
    for (const section of sectionsToWrite) {
      const result = setSectionIfMatch(section, body[section], expectedRevs[section]);
      if (result.ok === false) {
        conflict = { section, current: result.current };
        throw new Error('CONFLICT');
      }
      newRevs[section] = result.rev;
    }
  });

  try {
    applyAll();
  } catch (e) {
    if (conflict) {
      const c: { section: Section; current: { data: unknown; rev: number } } = conflict;
      return res.status(409).json({ error: 'conflict', section: c.section, data: c.current.data, rev: c.current.rev });
    }
    throw e;
  }

  res.json({ ok: true, revs: newRevs });
});

// Narrow, public-safe endpoint for the site's AI bot: only the fields it
// needs to answer visitors, never leads or other admin data.
app.get('/api/bot-knowledge', (_req, res) => {
  const botConfig = getSection('botConfig') as { systemPrompt?: string; knowledgeBase?: string } | null;
  res.json({
    systemPrompt: botConfig?.systemPrompt ?? '',
    knowledgeBase: botConfig?.knowledgeBase ?? '',
    faqItems: getSection('faqItems') ?? [],
  });
});

// Custom storage engine that writes to a hidden temp file and only renames it
// into its public, final (unique) filename once the write has fully
// completed. multer's own diskStorage writes straight to the final filename,
// so a client that disconnects mid-upload (or a container restart mid-write)
// could otherwise leave a truncated/corrupt file reachable at a URL that's
// already been saved into the DB. rename() on the same filesystem is atomic,
// so /uploads never serves a partially-written file.
class AtomicDiskStorage implements multer.StorageEngine {
  constructor(private readonly destDir: string) {}

  _handleFile(
    _req: express.Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File>) => void
  ) {
    const ext = path.extname(file.originalname);
    const finalName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
    const tmpPath = path.join(this.destDir, `.tmp-${finalName}`);
    const finalPath = path.join(this.destDir, finalName);

    const outStream = fs.createWriteStream(tmpPath);

    const cleanupAndFail = (err: Error) => {
      outStream.destroy();
      fs.unlink(tmpPath, () => {});
      callback(err);
    };

    file.stream.on('error', cleanupAndFail);
    outStream.on('error', cleanupAndFail);

    outStream.on('finish', () => {
      fs.rename(tmpPath, finalPath, (err) => {
        if (err) return cleanupAndFail(err);
        fs.stat(finalPath, (statErr, stats) => {
          callback(null, {
            destination: this.destDir,
            filename: finalName,
            path: finalPath,
            size: statErr ? undefined : stats.size,
          });
        });
      });
    });

    file.stream.pipe(outStream);
  }

  _removeFile(_req: express.Request, file: Express.Multer.File, callback: (error: Error | null) => void) {
    fs.unlink(file.path, () => callback(null));
  }
}

const storage = new AtomicDiskStorage(RESOLVED_UPLOADS_DIR);
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Допускаются только изображения'));
  },
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не получен' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Separate endpoint (rather than widening /api/upload's fileFilter) so every
// other caller — review scans, certificate/patent images, avatars — keeps
// rejecting anything that isn't image/PDF; only the Hero-block admin form
// talks to this one, and only for its optional video-instead-of-photo field.
const uploadVideo = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'video/mp4') cb(null, true);
    else cb(new Error('Допускается только видео в формате MP4'));
  },
});

app.post('/api/upload-video', uploadVideo.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Файл не получен' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err) return res.status(400).json({ error: err.message || 'Upload error' });
  next();
});

const agent = new https.Agent({ rejectUnauthorized: false });
let cachedToken = { token: '', expiresAt: 0, authKey: '' };

async function getAccessToken(authKey: string): Promise<string> {
  if (cachedToken.token && Date.now() < cachedToken.expiresAt && cachedToken.authKey === authKey) {
    return cachedToken.token;
  }
  const rqUID = crypto.randomUUID();
  // TEMPORARY DEBUG LOGGING - remove after diagnosis. Never logs authKey itself,
  // only shape/length so we can spot a stray "Basic " prefix or whitespace
  // baked into the env var without exposing the secret.
  console.log('[GigaChat DEBUG] getAccessToken: requesting new token', {
    rqUID,
    authKeyLength: authKey.length,
    authKeyHasWhitespace: authKey.trim() !== authKey,
    authKeyStartsWithBasic: authKey.toLowerCase().startsWith('basic'),
    authKeyPrefix: authKey.slice(0, 4),
    authKeySuffix: authKey.slice(-4),
  });
  const result = await httpsPost(
    'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
    { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json', RqUID: rqUID, Authorization: `Basic ${authKey}` },
    'scope=GIGACHAT_API_PERS'
  );
  console.log('[GigaChat DEBUG] getAccessToken: oauth response', {
    status: result.status,
    data: result.data,
  });
  if (result.status < 200 || result.status >= 300) throw new Error(`GigaChat OAuth error: ${result.status}`);
  const { access_token } = result.data as { access_token: string };
  cachedToken = { token: access_token, expiresAt: Date.now() + 25 * 60 * 1000, authKey };
  return access_token;
}

const HTTPS_POST_TIMEOUT_MS = 15000;

function httpsPost(url: string, headers: Record<string, string>, body: string): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    // req.setTimeout() only bounds idle time on an already-connected socket —
    // verified empirically that it does NOT bound a hung TCP connect() (a
    // real unreachable host took 2m14s despite a 15s setTimeout). An
    // AbortController timer, started at request creation, bounds the whole
    // operation regardless of connection phase — same pattern as the
    // client-side fetchWithTimeout() in botService.ts.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HTTPS_POST_TIMEOUT_MS);

    const requestHeaders = { ...headers, 'Content-Length': Buffer.byteLength(body) };
    // TEMPORARY DEBUG LOGGING - remove after diagnosis. Logs header names and
    // the request line only; Authorization value is redacted so the secret
    // never hits the logs.
    console.log('[GigaChat DEBUG] httpsPost: sending request', {
      method: 'POST',
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      headerNames: Object.keys(requestHeaders),
      hasAuthorizationHeader: 'Authorization' in requestHeaders,
    });

    const req = https.request(
      { hostname: u.hostname, port: u.port || 443, path: u.pathname + u.search, method: 'POST', headers: requestHeaders, agent, signal: controller.signal },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          clearTimeout(timer);
          console.log('[GigaChat DEBUG] httpsPost: response received', {
            hostname: u.hostname,
            path: u.pathname + u.search,
            status: res.statusCode ?? 0,
            bodyText: raw,
          });
          try { resolve({ status: res.statusCode ?? 0, data: JSON.parse(raw) }); }
          catch { resolve({ status: res.statusCode ?? 0, data: raw }); }
        });
      }
    );
    req.on('error', (err) => {
      clearTimeout(timer);
      console.log('[GigaChat DEBUG] httpsPost: request error', {
        hostname: u.hostname,
        path: u.pathname + u.search,
        errorName: err.name,
        errorMessage: err.message,
      });
      if (err.name === 'AbortError') {
        reject(new Error(`GigaChat не отвечает (таймаут ${HTTPS_POST_TIMEOUT_MS / 1000}с)`));
      } else {
        reject(err);
      }
    });
    req.write(body);
    req.end();
  });
}

app.post('/api/gigachat/token', async (req, res) => {
  const authKey = (req.headers['x-gigachat-auth-key'] as string) || process.env.GIGACHAT_AUTH_KEY || '';
  if (!authKey) return res.status(500).json({ error: 'GIGACHAT_AUTH_KEY не настроен' });
  try {
    res.json({ access_token: await getAccessToken(authKey) });
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

app.post('/api/gigachat/chat', async (req, res) => {
  const authKey = (req.headers['x-gigachat-auth-key'] as string) || process.env.GIGACHAT_AUTH_KEY || '';
  if (!authKey) return res.status(500).json({ error: 'GIGACHAT_AUTH_KEY не настроен' });
  try {
    const access_token = await getAccessToken(authKey);
    const result = await httpsPost(
      'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
      { 'Content-Type': 'application/json', Authorization: `Bearer ${access_token}` },
      JSON.stringify(req.body)
    );
    if (result.status < 200 || result.status >= 300) return res.status(result.status).json({ error: 'Ошибка GigaChat', detail: result.data });
    res.json(result.data);
  } catch (e: unknown) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

// TEMPORARY - remove after diagnosis. Checks raw TLS reachability of the
// GigaChat OAuth and chat hosts from wherever this server is deployed,
// to tell a silent network black-hole apart from an auth/API error.
function checkTlsReachable(host: string, port: number, timeoutMs = 5000): Promise<{ reachable: boolean; ms: number; error: string | null }> {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = tls.connect({ host, port, servername: host, timeout: timeoutMs, rejectUnauthorized: false }, () => {
      socket.end();
      resolve({ reachable: true, ms: Date.now() - start, error: null });
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ reachable: false, ms: Date.now() - start, error: 'timeout' });
    });
    socket.on('error', (err) => {
      resolve({ reachable: false, ms: Date.now() - start, error: err.message });
    });
  });
}

app.get('/api/gigachat/ping', async (_req, res) => {
  const [oauth, chat] = await Promise.all([
    checkTlsReachable('ngw.devices.sberbank.ru', 9443),
    checkTlsReachable('gigachat.devices.sberbank.ru', 443),
  ]);
  res.json({ oauth, chat });
});

// Vite content-hashes every filename under dist/assets, so a given URL's
// content never changes in place — a new deploy always produces new
// filenames, safe to cache for a full year. index.html is the opposite: it's
// what tells the browser which hashed chunk to fetch, so it must always be
// revalidated. Serving both through a single express.static(distPath) (the
// previous setup) gave them the same default Cache-Control: max-age=0 —
// technically revalidate-able, but weak enough that a stale cached/bfcached
// index.html could keep referencing chunk filenames a newer deploy already
// deleted, hanging until a hard refresh bypassed the cache entirely.
const distPath = path.join(process.cwd(), 'dist');
app.use('/assets', express.static(path.join(distPath, 'assets'), {
  maxAge: '1y',
  immutable: true,
}));
app.use(express.static(distPath, {
  setHeaders: (res, filePath) => {
    if (path.basename(filePath) === 'index.html') {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));
app.get('*', (_req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Прокси запущен на http://0.0.0.0:${PORT}`);
  console.log(`SQLite: ${DB_PATH}`);
  console.log(`Uploads: ${RESOLVED_UPLOADS_DIR}`);
});