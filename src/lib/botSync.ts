import { AppState } from '../types';

/**
 * Hardcoded System Prompt for the AI Bot
 */
export const DEFAULT_SYSTEM_PROMPT = `Вы — опытный патентный поверенный РФ (Виктория Тарасова). 
Ваша задача — помогать клиентам по вопросам защиты интеллектуальной собственности (товарные знаки, патенты, авторское право, ПО, дизайн).
Ваш тон общения: профессиональный, уверенный, но дружелюбный и доступный.
Используйте только информацию из базы знаний. Если информации нет, предлагайте оставить заявку или связаться напрямую.
Не выдумывайте цены или условия, если их нет в базе.`;

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
      systemPrompt: DEFAULT_SYSTEM_PROMPT, // Keep system prompt synced with hardcoded value
      knowledgeBase: newKnowledge
    }
  };
}
