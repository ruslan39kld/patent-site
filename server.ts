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

const DATA_DIR = process.env.DATA_DIR || '/data';
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
try {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
} catch {}
const resolvedDataDir = fs.existsSync(UPLOADS_DIR)
  ? DATA_DIR
  : path.join(process.cwd(), 'data');
fs.mkdirSync(path.join(resolvedDataDir, 'uploads'), { recursive: true });

const DB_PATH = path.join(resolvedDataDir, 'db.sqlite');
const RESOLVED_UPLOADS_DIR = path.join(resolvedDataDir, 'uploads');

app.use('/uploads', express.static(RESOLVED_UPLOADS_DIR));

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
}

function getSection(section: Section): unknown {
  const row = db.prepare(`SELECT data FROM ${section} WHERE id = 1`).get() as { data: string } | undefined;
  return row ? JSON.parse(row.data) : null;
}
function setSection(section: Section, value: unknown) {
  db.prepare(`INSERT INTO ${section} (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data`).run(JSON.stringify(value));
}

for (const section of SECTIONS) {
  if (getSection(section) === null) {
    setSection(section, (initialData as unknown as Record<string, unknown>)[section] ?? null);
  }
}

app.get('/api/data', (_req, res) => {
  const result: Record<string, unknown> = {};
  for (const section of SECTIONS) result[section] = getSection(section);
  res.json(result);
});

app.post('/api/data', (req, res) => {
  const body = req.body as Record<string, unknown>;
  for (const section of SECTIONS) {
    if (body[section] !== undefined) setSection(section, body[section]);
  }
  res.json({ ok: true });
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

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, RESOLVED_UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${crypto.randomUUID()}${ext}`);
  },
});
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

const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Прокси запущен на http://0.0.0.0:${PORT}`);
  console.log(`SQLite: ${DB_PATH}`);
  console.log(`Uploads: ${RESOLVED_UPLOADS_DIR}`);
});