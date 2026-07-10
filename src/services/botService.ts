import { searchKnowledgeBase } from '../lib/botSync';

const PROXY_URL = typeof window !== 'undefined'
  ? ''
  : 'http://localhost:3000';

const FALLBACK_SYSTEM_PROMPT = `Ты — экспертный AI-консультант патентного поверенного. Отвечай кратко и профессионально.`;

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

// Injects the relevant slice of the knowledge base into the last user
// turn (not the system prompt) — the FAQ section is already one of the
// blocks inside knowledgeBase, so no separate FAQ handling is needed here.
const buildContextualMessages = (messages: ChatMessage[], knowledgeBase: string): ChatMessage[] => {
  if (!knowledgeBase || messages.length === 0) return messages;
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== 'user') return messages;

  const context = searchKnowledgeBase(lastMessage.content, knowledgeBase);
  if (!context) return messages;

  const augmented: ChatMessage = {
    role: 'user',
    content: `КОНТЕКСТ С САЙТА:\n${context}\n\nВОПРОС КЛИЕНТА:\n${lastMessage.content}`,
  };
  return [...messages.slice(0, -1), augmented];
};

const buildChatContext = async (messages: ChatMessage[]): Promise<{ systemPrompt: string; messages: ChatMessage[] }> => {
  const knowledge = await fetchBotKnowledge();
  const systemPrompt = knowledge?.systemPrompt || FALLBACK_SYSTEM_PROMPT;
  const contextualMessages = buildContextualMessages(messages, knowledge?.knowledgeBase || '');
  return { systemPrompt, messages: contextualMessages };
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

  const { systemPrompt, messages: contextualMessages } = await buildChatContext(messages);

  let response: Response;
  try {
    response = await fetchWithTimeout(`${PROXY_URL}/api/gigachat/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'GigaChat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...contextualMessages
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

  const { systemPrompt, messages: contextualMessages } = await buildChatContext(messages);

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
        system: systemPrompt,
        messages: contextualMessages,
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

// GigaChat sometimes answers these with Sberbank's canned platform reply
// (video/photo/podcast capabilities) instead of running the model at all —
// confirmed via logs showing prompt_tokens=1, completion_tokens=0, meaning
// the system prompt is bypassed entirely. Not fixable via prompt text, so
// we intercept on the client before the request is ever sent.
export const META_QUESTION_PATTERNS = [
  /что ты (умеешь|можешь|такое)/i,
  /кто ты( такой| такая)?/i,
  /расскажи о себе/i,
  /как тебя зовут/i,
  /ты (бот|нейросеть|ии|искусственный интеллект)/i,
];

export const META_QUESTION_RESPONSE =
  'Я консультирую по товарным знакам, патентам, промышленным образцам ' +
  'и защите авторских прав — от регистрации до споров о нарушении ' +
  'прав. Что вас интересует?';

export function matchesMetaQuestion(text: string): boolean {
  return META_QUESTION_PATTERNS.some((p) => p.test(text.trim()));
}

// GigaChat keeps citing stale/inconsistent numbers for pricing questions
// (old services-block figures, mismatched formats) even with the price
// list prioritized in context. Decision: don't let the model generate
// pricing answers at all — intercept deterministically, same as meta
// questions, and point to the dedicated pricing page/calculator instead.
export const PRICE_QUESTION_PATTERNS = [
  /сколько стоит/i,
  /какая цена/i,
  /стоимость/i,
  /тариф/i,
  /почём/i,
  /расценки/i,
  /прайс/i,
];

export const PRICE_QUESTION_RESPONSE =
  'Точные цены по каждой услуге — в разделе «Стоимость»: /pricing. ' +
  'Там же есть калькулятор, который сразу считает ориентировочную ' +
  'сумму под вашу задачу. Если нужна точная цена под конкретную ' +
  'ситуацию — оставьте контакт, и Виктория посчитает индивидуально.';

export function matchesPriceQuestion(text: string): boolean {
  return PRICE_QUESTION_PATTERNS.some((p) => p.test(text.trim()));
}

export const sendBotMessage = async (
  messages: ChatMessage[],
  onProvider?: (p: Provider) => void
): Promise<string> => {
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === 'user' && matchesMetaQuestion(lastMessage.content)) {
    onProvider?.('gigachat');
    return META_QUESTION_RESPONSE;
  }
  if (lastMessage?.role === 'user' && matchesPriceQuestion(lastMessage.content)) {
    onProvider?.('gigachat');
    return PRICE_QUESTION_RESPONSE;
  }

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
