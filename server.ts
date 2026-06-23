import express from 'express';
import https from 'https';
import crypto from 'crypto';
import path from 'path';
import * as dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

const __dirname = process.cwd();
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 
    'Content-Type, x-gigachat-auth-key');
  if (_req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const agent = new https.Agent({ rejectUnauthorized: false });

let cachedToken = { token: '', expiresAt: 0, authKey: '' };

async function getAccessToken(authKey: string): Promise<string> {
  if (
    cachedToken.token && 
    Date.now() < cachedToken.expiresAt && 
    cachedToken.authKey === authKey
  ) {
    return cachedToken.token;
  }

  const result = await httpsPost(
    'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
    {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      RqUID: crypto.randomUUID(),
      Authorization: `Basic ${authKey}`,
    },
    'scope=GIGACHAT_API_PERS'
  );

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`GigaChat OAuth error: ${result.status}`);
  }

  const { access_token } = result.data as { access_token: string };
  cachedToken = { 
    token: access_token, 
    expiresAt: Date.now() + 25 * 60 * 1000, 
    authKey 
  };
  return access_token;
}

function httpsPost(
  url: string, 
  headers: Record<string, string>, 
  body: string
): Promise<{ status: number; data: unknown }> {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        method: 'POST',
        headers: { 
          ...headers, 
          'Content-Length': Buffer.byteLength(body) 
        },
        agent,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve({ 
              status: res.statusCode ?? 0, 
              data: JSON.parse(raw) 
            });
          } catch {
            resolve({ 
              status: res.statusCode ?? 0, 
              data: raw 
            });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

app.post('/api/gigachat/token', async (req, res) => {
  const authKey = 
    (req.headers['x-gigachat-auth-key'] as string) || 
    process.env.GIGACHAT_AUTH_KEY || '';
  if (!authKey) {
    return res.status(500).json({ 
      error: 'GIGACHAT_AUTH_KEY не настроен' 
    });
  }
  try {
    const access_token = await getAccessToken(authKey);
    res.json({ access_token });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message });
  }
});

app.post('/api/gigachat/chat', async (req, res) => {
  const authKey = 
    (req.headers['x-gigachat-auth-key'] as string) || 
    process.env.GIGACHAT_AUTH_KEY || '';
  if (!authKey) {
    return res.status(500).json({ 
      error: 'GIGACHAT_AUTH_KEY не настроен' 
    });
  }
  try {
    const access_token = await getAccessToken(authKey);
    const result = await httpsPost(
      'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      JSON.stringify(req.body)
    );
    if (result.status < 200 || result.status >= 300) {
      return res.status(result.status).json({ 
        error: 'Ошибка GigaChat', 
        detail: result.data 
      });
    }
    res.json(result.data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    res.status(500).json({ error: message });
  }
});

async function startServer() {
  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Прокси запущен на http://0.0.0.0:${PORT}`);
  });
}

startServer();
