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

const getSystemPrompt = () => {
  const config = getAppBotConfig();
  let basePrompt = `Ты — экспертный AI-консультант патентного поверенного. Отвечай кратко и профессионально.`;
  
  try {
    const saved = localStorage.getItem('tarasova_patent_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.botConfig?.systemPrompt) {
        basePrompt = parsed.botConfig.systemPrompt;
      }
      
      let ragContent = [];
      
      if (parsed.botConfig?.knowledgeBase) {
        ragContent.push(parsed.botConfig.knowledgeBase);
      }
      
      if (parsed.faqItems && parsed.faqItems.length > 0) {
        const faqText = parsed.faqItems.map((f: any) => `Вопрос: ${f.q}\nОтвет: ${f.a.replace(/<[^>]+>/g, '')}`).join('\n\n');
        ragContent.push(`--- ЧАСТЫЕ ВОПРОСЫ (FAQ) ---\n${faqText}`);
      }
      
      if (ragContent.length > 0) {
        return `${basePrompt}\n\nБаза знаний (Используй это для ответов):\n${ragContent.join('\n\n')}`;
      }
    }
  } catch (e) {
    //
  }

  return basePrompt;
};

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
        { role: 'system', content: getSystemPrompt() },
        ...messages
      ],
      max_tokens: 1500,
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
    (import.meta as any).env?.VITE_ANTHROPIC_KEY || '';
  const response = await fetch('https://api.anthropic.com/v1/messages', {
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
      system: getSystemPrompt(),
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
