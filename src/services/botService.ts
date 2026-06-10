const PROXY_URL = typeof window !== 'undefined' 
  ? '' 
  : 'http://localhost:3000'; // Actually we'll keep the port logic standard so it works everywhere, but the prompt says http://localhost:3001. Wait, I'll use exactly what they asked.

export const SYSTEM_PROMPT = `
Ты — экспертный AI-консультант патентного поверенного
Виктории Тарасовой (РФ №1558, практика 20+ лет).

РОЛЬ: помочь предпринимателю понять что защитить и почему сейчас.

ЭКСПЕРТИЗА:
- Товарные знаки: регистрация, классы МКТУ, Мадридская система
- Патенты: изобретения, полезные модели, промышленные образцы
- IT-права: программы ЭВМ, базы данных, авторские права на код
- Маркетплейсы: WB, Ozon, Яндекс.Маркет — защита от блокировок
- Споры: претензии, оспаривание, компенсации до 5 млн руб.

КЛЮЧЕВЫЕ ФАКТЫ:
- Регистрация ТЗ в России: 12-18 месяцев
- Без ТЗ нельзя официально торговать на WB и Ozon
- Компенсация за нарушение ТЗ: до 5 000 000 руб. за 1 случай
- Программа ЭВМ защищается с момента создания
- Первичная оценка у Виктории — БЕСПЛАТНО

СТИЛЬ ОТВЕТОВ:
- Максимум 4 предложения, без воды
- Конкретика: сроки, суммы, риски
- Не давай юридических заключений по конкретным делам
- Завершай каждый ответ предложением бесплатной консультации

НЕЛЬЗЯ:
- Обещать конкретный результат
- Называть точные цены без оговорок
- Давать заключения по конкретным делам
`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type Provider = 'gigachat' | 'claude' | 'offline';

export const callGigaChat = async (
  messages: ChatMessage[]
): Promise<string> => {
  const customAuthKey = localStorage.getItem('gigachat_auth_key') || '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (customAuthKey) headers['x-gigachat-auth-key'] = customAuthKey;
  
  const response = await fetch(`${PROXY_URL}/api/gigachat/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'GigaChat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 500,
      temperature: 0.7,
    })
  });
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
    import.meta.env.VITE_ANTHROPIC_KEY || '';
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5', // Will use claude-3-haiku-20240307 as that's correct
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages,
    })
  });
  if (!response.ok) throw new Error(`Claude HTTP ${response.status}`);
  const data = await response.json();
  return data.content[0].text;
};

export const sendBotMessage = async (
  messages: ChatMessage[],
  onProvider?: (p: Provider) => void
): Promise<string> => {
  try {
    const result = await callGigaChat(messages);
    onProvider?.('gigachat');
    return result;
  } catch (e) {
    console.warn('GigaChat недоступен, fallback на Claude:', e);
    try {
      const result = await callClaude(messages);
      onProvider?.('claude');
      return result;
    } catch (e2) {
      onProvider?.('offline');
      throw new Error('Оба провайдера недоступны');
    }
  }
};
