const PROXY_URL = typeof window !== 'undefined' 
  ? '' 
  : 'http://localhost:3000';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type Provider = 'gigachat' | 'claude' | 'offline';

const getAppBotConfig = () => {
  try {
    const saved = localStorage.getItem('tarasova_patent_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.botConfig) {
        return parsed.botConfig;
      }
    }
  } catch (e) {
    // Ignore error
  }
  return null;
};

interface BotKnowledge {
  systemPrompt: string;
  knowledgeBase: string;
  faqItems: { q: string; a: string }[];
}

let knowledgeCache: { data: BotKnowledge; ts: number } | null = null;
const KNOWLEDGE_CACHE_TTL = 5 * 60 * 1000;

// Real site visitors have no admin localStorage — the knowledge base must
// come from the server so it reflects what was actually indexed, not
// whatever (if anything) happens to be cached in this particular browser.
const fetchBotKnowledge = async (): Promise<BotKnowledge | null> => {
  if (knowledgeCache && Date.now() - knowledgeCache.ts < KNOWLEDGE_CACHE_TTL) {
    return knowledgeCache.data;
  }
  try {
    const res = await fetch(`${PROXY_URL}/api/bot-knowledge`);
    if (!res.ok) return null;
    const data = await res.json();
    knowledgeCache = { data, ts: Date.now() };
    return data;
  } catch (e) {
    return null;
  }
};

const getSystemPrompt = async (): Promise<string> => {
  let basePrompt = `Ты — экспертный AI-консультант патентного поверенного. Отвечай кратко и профессионально.`;

  const knowledge = await fetchBotKnowledge();
  if (!knowledge) return basePrompt;

  if (knowledge.systemPrompt) {
    basePrompt = knowledge.systemPrompt;
  }

  const ragContent: string[] = [];

  if (knowledge.knowledgeBase) {
    ragContent.push(knowledge.knowledgeBase);
  }

  if (knowledge.faqItems && knowledge.faqItems.length > 0) {
    const faqText = knowledge.faqItems.map((f) => `Вопрос: ${f.q}\nОтвет: ${f.a.replace(/<[^>]+>/g, '')}`).join('\n\n');
    ragContent.push(`--- ЧАСТЫЕ ВОПРОСЫ (FAQ) ---\n${faqText}`);
  }

  if (ragContent.length > 0) {
    return `${basePrompt}\n\nБаза знаний (Используй это для ответов):\n${ragContent.join('\n\n')}`;
  }

  return basePrompt;
};

const CHAT_REQUEST_TIMEOUT_MS = 20000;

// Without an explicit deadline, a stalled connection to either provider
// leaves the caller (and thus the "печатает..." UI) hanging forever.
const fetchWithTimeout = (input: RequestInfo, init: RequestInit = {}, timeoutMs = CHAT_REQUEST_TIMEOUT_MS): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
};

export const callGigaChat = async (
  messages: ChatMessage[]
): Promise<string> => {
  const customAuthKey = localStorage.getItem('gigachat_auth_key') || '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (customAuthKey) headers['x-gigachat-auth-key'] = customAuthKey;

  let response: Response;
  try {
    response = await fetchWithTimeout(`${PROXY_URL}/api/gigachat/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'GigaChat',
        messages: [
          { role: 'system', content: await getSystemPrompt() },
          ...messages
        ],
        max_tokens: 1500,
        temperature: 0.7,
      })
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error('GigaChat не отвечает (таймаут)');
    }
    throw e;
  }
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || `HTTP ${response.status}`);
  }
  const data = await response.json();
  return data.choices[0].message.content;
};

export const callClaude = async (
  messages: ChatMessage[]
): Promise<string> => {
  const key = localStorage.getItem('anthropic_api_key') ||
    (import.meta as any).env?.VITE_ANTHROPIC_KEY || '';
  let response: Response;
  try {
    response = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1500,
        system: await getSystemPrompt(),
        messages,
      })
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new Error('Claude не отвечает (таймаут)');
    }
    throw e;
  }
  if (!response.ok) throw new Error(`Claude HTTP ${response.status}`);
  const data = await response.json();
  return data.content[0].text;
};

export const sendBotMessage = async (
  messages: ChatMessage[],
  onProvider?: (p: Provider) => void
): Promise<string> => {
  const config = getAppBotConfig();
  const preferGigaChat = config?.useGigaChat ?? true;

  try {
    if (preferGigaChat) {
      const result = await callGigaChat(messages);
      onProvider?.('gigachat');
      return result;
    } else {
      const result = await callClaude(messages);
      onProvider?.('claude');
      return result;
    }
  } catch (e) {
    console.warn('Основной провайдер недоступен, fallback:', e);
    try {
      if (preferGigaChat) {
        const result = await callClaude(messages);
        onProvider?.('claude');
        return result;
      } else {
        const result = await callGigaChat(messages);
        onProvider?.('gigachat');
        return result;
      }
    } catch (e2) {
      onProvider?.('offline');
      throw new Error('Оба провайдера недоступны');
    }
  }
};
