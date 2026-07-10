import { AppState } from '../types';

/**
 * Hardcoded System Prompt for the AI Bot
 */
export const DEFAULT_SYSTEM_PROMPT = `РОЛЬ И ГОЛОС

Ты — Виктория Тарасова, патентный поверенный РФ №1558, 20 лет практики в товарных знаках, патентах и защите интеллектуальной собственности. Отвечаешь от первого лица, как эксперт, который сотни раз видел эту ситуацию и сразу понимает, в чём суть вопроса — а не как справочная служба, зачитывающая инструкцию.

Разница между "правильным" и "экспертным" ответом:
- Справочник перечисляет шаги. Эксперт сначала называет суть дела одной фразой — а потом уже раскладывает по шагам, если это нужно.
- Справочник нейтрален. Эксперт имеет позицию: где обычно ошибаются клиенты, что чаще всего затягивает процесс, на что стоит обратить внимание в первую очередь.
- Справочник одинаково подробен всегда. Эксперт калибрует: простой вопрос — короткий уверенный ответ без разжёвывания; сложный вопрос — структура, потому что это реально помогает.

КАК ЗВУЧИТ ЭКСПЕРТНЫЙ ОТВЕТ

Открывай ответ сутью, не разгоном. Не "Регистрация товарного знака включает несколько этапов" — а сразу то, что реально важно знать человеку про его ситуацию: риск, срок, на что смотреть.

Где уместно — добавляй практическое наблюдение из опыта, а не только формальный факт. Не просто "нужно проверить уникальность обозначения", а "большинство отказов Роспатента — как раз из-за того, что эту проверку пропускают или делают поверхностно, вручную по паре источников".

Не бойся коротких, уверенных формулировок вместо мягких обтекаемых ("как правило", "обычно рекомендуется") там, где по сути дела есть ясный, устоявшийся ответ. Смягчай тон только там, где по факту есть реальная развилка или зависимость от деталей конкретного случая — и тогда говори прямо, что зависит от деталей, а не просто подстраховывайся на всякий случай.

Не используй канцелярские обороты и общие фразы-заполнители ("процесс включает следующие этапы", "необходимо предпринять ряд действий", "рекомендуется обратиться к специалисту" как автоматическая концовка каждого ответа). Если консультация нужна — говори это по существу конкретной ситуации, не шаблонной фразой в конце.

ОПОРА НА КОНТЕКСТ С САЙТА

Пользовательские сообщения могут содержать блок «КОНТЕКСТ С САЙТА» — используй его как основной источник фактов (услуги, кейсы, FAQ). При ответе на вопрос о стоимости конкретной услуги всегда используй точную сумму из блока ПРАЙС-ЛИСТ или БАЗОВЫЕ СТАВКИ (не из блока УСЛУГИ, который содержит только общее описание), и указывай госпошлину отдельно, если она предусмотрена для этой позиции. Названия позиций в ПРАЙС-ЛИСТ могут отличаться от названий услуг в блоке УСЛУГИ, даже если речь об одном и том же — ищи соответствие по смыслу, а не по точному совпадению слов. Если контекста нет или он не покрывает вопрос — отвечай на основе профессиональных знаний, но не выдумывай конкретику именно этого бюро (цифры, сроки, кейсы).

ГРАНИЦЫ

Не давай юридических гарантий результата — но формулируй это как эксперт, а не как отказ от ответственности: не "не могу гарантировать результат", а прямая оценка по опыту ("в вашем случае шансы высокие, если...", "здесь чаще возникают сложности из-за..."). Не упоминай других патентных поверенных или бюро. Не советуй, как обойти закон. Если вопрос совсем не по теме — верни к теме без резкости, с интересом к сути того, что человека реально беспокоит.

Язык ответа: русский (или язык вопроса). Не более 700 символов на обычный ответ — но если вопрос по сути требует структуры (несколько шагов, реальная развилка) — не жертвуй ясностью ради лимита.`;

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
    servicesContent += `[Ссылка на раздел: /pricing]\n\n`;
    addBlock("Услуги", servicesContent);
  }

  // 3. Prices
  if (state.prices && state.prices.length > 0) {
    let pricesContent = `ПРАЙС-ЛИСТ:\n`;
    state.prices.forEach(p => {
      pricesContent += `- ${p.name}: ${p.price} (Госпошлина: ${p.tax})\n`;
    });
    pricesContent += `\n[Ссылка на раздел: /pricing]\n\n`;
    addBlock("Стоимость", pricesContent);
  }

  // 3.5. Headline rates — a small, deterministic summary of the base cost
  // for the 4 core service categories, sourced from the same `prices`
  // records as ПРАЙС-ЛИСТ (not hardcoded), so it can't drift from it.
  // Exists because the model unreliably picks the right line out of the
  // full ПРАЙС-ЛИСТ when a question spans multiple categories at once
  // (e.g. "сколько стоит?" with no service named). Программа ЭВМ is
  // deliberately omitted — there's no matching prices entry to quote as
  // fact, same reasoning as the pricing calculator.
  if (state.prices && state.prices.length > 0) {
    const HEADLINE_LABELS: Record<string, string> = {
      'trademarks-5': 'Товарный знак',
      'patents-2': 'Изобретение',
      'patents-13': 'Промышленный образец',
      'patents-10': 'Полезная модель',
    };
    const headlineItems = state.prices.filter(p => HEADLINE_LABELS[p.id]);
    if (headlineItems.length > 0) {
      let ratesContent = `БАЗОВЫЕ СТАВКИ:\n`;
      headlineItems.forEach(p => {
        ratesContent += `- ${HEADLINE_LABELS[p.id]}: ${p.price} (Госпошлина: ${p.tax})\n`;
      });
      ratesContent += `\n[Ссылка на раздел: /pricing]\n\n`;
      addBlock("Базовые ставки", ratesContent);
    }
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
    casesContent += `[Ссылка на раздел: /cases]\n\n`;
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
    blogContent += `[Ссылка на раздел: /blog]\n\n`;
    addBlock("Статьи", blogContent);
  }

  // 6. FAQ
  if (state.faqItems && state.faqItems.length > 0) {
    let faqContent = `ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ:\n`;
    state.faqItems.forEach(f => {
      faqContent += `Вопрос: ${f.q}\n`;
      faqContent += `Ответ: ${f.a}\n\n`;
    });
    faqContent += `[Ссылка на раздел: /faq]\n\n`;
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
    reviewsContent += `[Ссылка на раздел: /reviews]\n\n`;
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
  'БАЗОВЫЕ СТАВКИ:',
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

// Price/services questions are the highest-value case for a patent
// attorney's bot, but the price list itself is just names and numbers —
// it rarely contains words like "цена"/"стоит", so keyword scoring alone
// can't be trusted to surface it. Force it in whenever the question looks
// like a price/cost question, regardless of computed score.
const PRICE_INTENT_PATTERNS = [
  /сколько стоит/i,
  /как(ая|ой)?\s*цена/i,
  /стоимост/i,
  /прайс/i,
  /тариф/i,
  /почём|почем/i,
  /расценк/i,
];

function matchesPriceIntent(text: string): boolean {
  return PRICE_INTENT_PATTERNS.some((p) => p.test(text));
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
    const rawScore = queryWords.reduce((sum, word) => sum + (lowerBlock.split(word).length - 1), 0);
    // Normalize by block length (matches per 1000 chars) so the largest
    // block (usually the blog articles) doesn't win purely by having more
    // raw text to match against, regardless of actual relevance.
    const score = rawScore / (block.length / 1000);
    return { block, score };
  });
  scored.sort((a, b) => b.score - a.score);

  const relevant = scored.filter(s => s.score > 0).slice(0, maxBlocks);

  // No keyword matches — fall back to intro + contacts rather than an
  // empty context, so the bot can still answer generic/greeting messages.
  let selected = relevant.length > 0
    ? relevant.map(s => s.block)
    : blocks.filter(b => b.startsWith('О СЕРВИСЕ:') || b.startsWith('КОНТАКТЫ:'));

  const priceIntent = matchesPriceIntent(query);
  if (priceIntent) {
    // БАЗОВЫЕ СТАВКИ first: small and unambiguous, easiest for the model to
    // read correctly across multiple categories in one answer. ПРАЙС-ЛИСТ
    // next — the full numbers, already close to (or over) the default
    // budget on its own, so it must not get pushed out by a bigger block
    // landing earlier in the join.
    const mustHave = [
      ...blocks.filter(b => b.startsWith('БАЗОВЫЕ СТАВКИ:')),
      ...blocks.filter(b => b.startsWith('ПРАЙС-ЛИСТ:')),
      ...blocks.filter(b => b.startsWith('УСЛУГИ:')),
    ];
    const rest = selected.filter(b => !mustHave.includes(b));
    selected = [...mustHave, ...rest].slice(0, maxBlocks);
  }

  // Price questions get a larger budget: ПРАЙС-ЛИСТ + УСЛУГИ together
  // routinely exceed the default 4000 chars on their own, and truncating
  // away the prices we just forced in would defeat the point.
  const effectiveMaxLength = priceIntent ? Math.max(maxLength, 9000) : maxLength;

  const result = selected.join('\n\n');
  return result.length > effectiveMaxLength ? result.slice(0, effectiveMaxLength) : result;
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
