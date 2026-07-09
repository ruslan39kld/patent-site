import { AppState } from '../types';

/**
 * Hardcoded System Prompt for the AI Bot
 */
export const DEFAULT_SYSTEM_PROMPT = `РОЛЬ:
Ты — AI-консультант Виктории Тарасовой, патентного поверенного с 20-летним опытом работы в сфере интеллектуальной собственности: регистрация товарных знаков, патентование изобретений и промышленных образцов, защита авторских прав, споры о нарушении прав на бренд. Твои ответы должны звучать так, будто их могла бы дать сама Виктория: уверенно, по существу, без общих фраз.

СТИЛЬ:
Пиши как человек, а не справочник: по-деловому, но живо. Отвечай по существу сразу в первом предложении. Используй терминологию правильно (товарный знак, правообладатель, приоритет заявки, экспертиза ФИПС), но не перегружай ею простые вопросы. Короткие абзацы. Списки — только если реально нужны.

КОНТЕКСТ С САЙТА:
Пользовательские сообщения могут содержать блок «КОНТЕКСТ С САЙТА» — используй его как основной источник фактов (цены, сроки, услуги). Если контекста нет или он не покрывает вопрос — отвечай на основе общих профессиональных знаний, но не выдумывай конкретику именно этого бюро. В этом случае предложи оставить контакт для консультации с Викторией.

ГРАНИЦЫ:
Не давай юридических гарантий ("точно одобрят"), используй "как правило", "зависит от ситуации". Не упоминай других поверенных. При сложных вопросах о цене/сроках конкретного случая — предлагай оставить заявку. Если вопрос не по теме патентов/брендов/авторских прав — вежливо верни к теме.

Язык ответа: русский. Не более 700 символов на ответ.`;

/**
 * Parser that collects all text content from the application state 
 * to create a comprehensive knowledge base for the bot.
 */
export function parseSiteContent(state: AppState): string {
  let content = "";
  const stats: Record<string, number> = {};

  const addBlock = (name: string, text: string) => {
    content += text;
    stats[name] = (stats[name] || 0) + text.length;
  };

  // 1. Hero & Main content
  if (state.content) {
    let heroContent = `О СЕРВИСЕ:\n`;
    heroContent += `${state.content.heroTitle || ''}\n`;
    heroContent += `${state.content.heroSubtitle || ''}\n`;
    heroContent += `${state.content.aboutText || ''}\n\n`;
    
    if (state.content.aboutCards) {
      heroContent += `ПРЕИМУЩЕСТВА:\n`;
      state.content.aboutCards.forEach(card => {
        if (card.active !== false) heroContent += `- ${card.title}: ${card.desc}\n`;
      });
      heroContent += `\n`;
    }

    if (state.content.pricingBlock) {
      heroContent += `ЦЕНОВАЯ ПОЛИТИКА:\n`;
      heroContent += `${state.content.pricingBlock.title}\n`;
      heroContent += `${state.content.pricingBlock.text}\n`;
      heroContent += `Особенности: ${state.content.pricingBlock.badges?.join(', ') || ''}\n\n`;
    }
    addBlock("Главная и О нас", heroContent);
  }

  // 2. Services
  if (state.services && state.services.length > 0) {
    let servicesContent = `УСЛУГИ:\n`;
    state.services.forEach(s => {
      servicesContent += `Услуга: ${s.title}\n`;
      servicesContent += `Описание: ${s.shortDesc}\n`;
      servicesContent += `Подробно: ${s.fullDesc}\n`;
      if (s.price) servicesContent += `Стоимость: ${s.price}\n`;
      if (s.duration) servicesContent += `Срок: ${s.duration}\n`;
      if (s.includes) servicesContent += `Что включено: ${s.includes.join(', ')}\n`;
      servicesContent += `\n`;
    });
    addBlock("Услуги", servicesContent);
  }

  // 3. Prices
  if (state.prices && state.prices.length > 0) {
    let pricesContent = `ПРАЙС-ЛИСТ:\n`;
    state.prices.forEach(p => {
      pricesContent += `- ${p.name}: ${p.price} (Госпошлина: ${p.tax})\n`;
    });
    pricesContent += `\n`;
    addBlock("Стоимость", pricesContent);
  }

  // 4. Cases
  if (state.cases && state.cases.length > 0) {
    let casesContent = `КЕЙСЫ И ОПЫТ:\n`;
    state.cases.forEach(c => {
      casesContent += `Проект: ${c.title}\n`;
      casesContent += `Задача: ${c.task}\n`;
      casesContent += `Решение: ${c.solution}\n`;
      casesContent += `Результат: ${c.result}\n\n`;
    });
    addBlock("Кейсы", casesContent);
  }

  // 5. Blog / Articles
  if (state.blogPosts && state.blogPosts.length > 0) {
    let blogContent = `СТАТЬИ И ПОЛЕЗНЫЕ МАТЕРИАЛЫ:\n`;
    state.blogPosts.forEach(p => {
      blogContent += `Заголовок: ${p.title}\n`;
      blogContent += `Кратко: ${p.excerpt}\n`;
      blogContent += `Контент: ${p.content}\n\n`;
    });
    addBlock("Статьи", blogContent);
  }

  // 6. FAQ
  if (state.faqItems && state.faqItems.length > 0) {
    let faqContent = `ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ:\n`;
    state.faqItems.forEach(f => {
      faqContent += `Вопрос: ${f.q}\n`;
      faqContent += `Ответ: ${f.a}\n\n`;
    });
    addBlock("FAQ", faqContent);
  }

  // 7. Reviews
  if (state.reviews && state.reviews.length > 0) {
    let reviewsContent = `ОТЗЫВЫ КЛИЕНТОВ:\n`;
    state.reviews.forEach(r => {
      if (r.published !== false) {
        reviewsContent += `Клиент: ${r.name} ${r.company ? `(${r.company})` : ''}\n`;
        reviewsContent += `Услуга: ${r.service}\n`;
        reviewsContent += `Текст: ${r.text}\n\n`;
      }
    });
    addBlock("Отзывы", reviewsContent);
  }

  // 8. Custom Blocks (Builder)
  if (state.customBlocks && state.customBlocks.length > 0) {
    let customContent = `ДОПОЛНИТЕЛЬНЫЯ ИНФОРМАЦИЯ ИЗ КОНСТРУКТОРА:\n`;
    state.customBlocks.forEach(b => {
      if (b.active) {
        customContent += `${b.title}\n`;
        if (b.subtitle) customContent += `${b.subtitle}\n`;
        if (b.text) customContent += `${b.text}\n\n`;
      }
    });
    addBlock("Конструктор", customContent);
  }

  // 9. Contacts
  if (state.content) {
    let contactsContent = `КОНТАКТЫ:\n`;
    contactsContent += `Телефон: ${state.content.phone}\n`;
    contactsContent += `Email: ${state.content.email}\n`;
    contactsContent += `Telegram: ${state.content.telegram}\n`;
    contactsContent += `WhatsApp: ${state.content.whatsapp}\n`;
    addBlock("Контакты", contactsContent);
  }

  console.log("--- ОТЧЕТ О ПЕРЕИНДЕКСАЦИИ САЙТА ---");
  Object.entries(stats).forEach(([name, size]) => {
    console.log(`${name}: ${size} символов`);
  });
  console.log(`ИТОГО: ${content.length} символов`);
  console.log("-------------------------------------");

  return content;
}

// Exact header strings written by parseSiteContent's addBlock() calls above —
// used to split the flat knowledgeBase string back into per-section blocks.
const SECTION_HEADERS = [
  'О СЕРВИСЕ:',
  'УСЛУГИ:',
  'ПРАЙС-ЛИСТ:',
  'КЕЙСЫ И ОПЫТ:',
  'СТАТЬИ И ПОЛЕЗНЫЕ МАТЕРИАЛЫ:',
  'ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ:',
  'ОТЗЫВЫ КЛИЕНТОВ:',
  'ДОПОЛНИТЕЛЬНЫЯ ИНФОРМАЦИЯ ИЗ КОНСТРУКТОРА:',
  'КОНТАКТЫ:',
];

function splitIntoBlocks(knowledgeBase: string): string[] {
  const escaped = SECTION_HEADERS.map(h => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(?=^(?:${escaped.join('|')})$)`, 'm');
  return knowledgeBase.split(pattern).map(b => b.trim()).filter(Boolean);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3);
}

/**
 * Picks the 2-4 knowledgeBase blocks most relevant to a user's question
 * (plain keyword matching, no embeddings) instead of stuffing the whole
 * ~40KB site index into every request.
 */
export function searchKnowledgeBase(query: string, knowledgeBase: string, maxBlocks = 4, maxLength = 4000): string {
  if (!knowledgeBase) return '';

  const blocks = splitIntoBlocks(knowledgeBase);
  if (blocks.length === 0) return knowledgeBase.slice(0, maxLength);

  const queryWords = tokenize(query);
  const scored = blocks.map(block => {
    const lowerBlock = block.toLowerCase();
    const score = queryWords.reduce((sum, word) => sum + (lowerBlock.split(word).length - 1), 0);
    return { block, score };
  });
  scored.sort((a, b) => b.score - a.score);

  const relevant = scored.filter(s => s.score > 0).slice(0, maxBlocks);

  // No keyword matches — fall back to intro + contacts rather than an
  // empty context, so the bot can still answer generic/greeting messages.
  const selected = relevant.length > 0
    ? relevant.map(s => s.block)
    : blocks.filter(b => b.startsWith('О СЕРВИСЕ:') || b.startsWith('КОНТАКТЫ:'));

  const result = selected.join('\n\n');
  return result.length > maxLength ? result.slice(0, maxLength) : result;
}

/**
 * Synchronizes the bot's knowledge base with the current state.
 * TODO: In a real environment, this would also trigger a server-side 
 * RAG indexing process via a dedicated API endpoint.
 */
export function syncBotKnowledge(state: AppState): AppState {
  const newKnowledge = parseSiteContent(state);
  
  // Only update if knowledge base has actually changed to avoid unnecessary re-renders
  if (state.botConfig?.knowledgeBase === newKnowledge) {
    return state;
  }

  return {
    ...state,
    botConfig: {
      ...state.botConfig!,
      // Don't clobber an admin-edited prompt on every resync — only seed
      // the default once, the first time a prompt hasn't been set yet.
      systemPrompt: state.botConfig?.systemPrompt?.trim()
        ? state.botConfig.systemPrompt
        : DEFAULT_SYSTEM_PROMPT,
      knowledgeBase: newKnowledge
    }
  };
}
