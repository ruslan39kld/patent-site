import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bot, Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { sendBotMessage, ChatMessage, Provider } from '../services/botService';

const faqData = [
  {
    category: "Товарные знаки",
    questions: [
      "Можно ли зарегистрировать бренд, если я только начинаю продажи?",
      "Что делать, если конкурент уже использует похожее название?",
      "Нужно ли регистрировать логотип отдельно от названия?",
      "Можно ли защитить упаковку товара?",
      "Кому принадлежат права на логотип, заказанный у дизайнера?",
      "Как долго действует товарный знак?",
      "Что такое классы МКТУ и сколько их нужно выбирать?"
    ]
  },
  {
    category: "Патенты",
    questions: [
      "Чем изобретение отличается от полезной модели?",
      "Можно ли запатентовать идею без прототипа?",
      "Сколько стоит патент и как долго ждать?",
      "Что такое патентный поиск и зачем он нужен?"
    ]
  },
  {
    category: "IT и ПО",
    questions: [
      "Нужно ли регистрировать программу ЭВМ, если авторское право есть автоматически?",
      "Кому принадлежит код, написанный фрилансером?",
      "Как защитить приложение или SaaS-сервис?",
      "Что такое аудит прав на ПО?"
    ]
  },
  {
    category: "Авторские права",
    questions: [
      "Можно ли защитить приложение или сайт?",
      "Как оформить права на дизайн, заказанный у фрилансера?",
      "Что делать, если украли контент или дизайн?"
    ]
  },
  {
    category: "Общие",
    questions: [
      "Сколько стоит и как долго длится регистрация?",
      "В чём разница между патентным поверенным и юристом?",
      "Нужно ли платить госпошлину и сколько?",
      "Работаете ли вы с зарубежными регистрациями?"
    ]
  }
];

const categories = ["Все", "Товарные знаки", "Патенты", "IT и ПО", "Авторские права", "Общие"];

export default function FAQ() {
  const [activeTab, setActiveTab] = useState("Все");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState<Provider>('gigachat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const providerBadge: Record<Provider, {color: string; label: string}> = {
    gigachat: { color: '#22C55E', label: 'GigaChat' },
    claude:   { color: '#EAB308', label: 'Claude AI' },
    offline:  { color: '#EF4444', label: 'Офлайн' },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleQuestionClick = async (question: string) => {
    setSelectedQuestion(question);
    
    // Reset chat and start with the selected question
    const newUserMessage: ChatMessage = { role: 'user', content: question };
    setMessages([newUserMessage]);
    setIsTyping(true);

    try {
      const reply = await sendBotMessage([newUserMessage], setProvider);
      setMessages([{ role: 'user', content: question }, { role: 'assistant', content: reply }]);
    } catch {
      setProvider('offline');
      setMessages([
        { role: 'user', content: question },
        { role: 'assistant', content: 'Сейчас не могу ответить онлайн. Пожалуйста, напишите напрямую в Telegram.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const newUserMessage: ChatMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const reply = await sendBotMessage(updatedMessages, setProvider);
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setProvider('offline');
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Сейчас не могу ответить онлайн. Пожалуйста, напишите напрямую в Telegram.' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      {/* Mobile Header (when chat is open) */}
      <div className={cn(
        "lg:hidden bg-white border-b border-[#E5E7EB] sticky top-0 z-50 transition-all",
        selectedQuestion ? "flex items-center px-4 h-[64px]" : "hidden"
      )}>
        <button 
          onClick={() => setSelectedQuestion(null)}
          className="flex items-center text-[#1B3F7A] font-bold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Назад к вопросам
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Questions List */}
        <div className={cn(
          "flex-col w-full lg:w-[40%] h-full shrink-0",
          selectedQuestion ? "hidden lg:flex" : "flex"
        )}>
          <div className="mb-6 shrink-0">
            <Link to="/" className="inline-flex items-center text-[#1B3F7A] font-medium hover:text-[#C8A028] transition-colors mb-6">
              <ArrowLeft className="w-5 h-5 mr-2" /> Назад на главную
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-2">Все вопросы и ответы</h1>
            <p className="text-[#6B7280]">Нажмите на вопрос — получите ответ от AI-консультанта</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 shrink-0 hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "px-4 py-2 rounded-full font-bold text-[13px] whitespace-nowrap transition-colors border",
                  activeTab === cat 
                    ? "bg-[#1B3F7A] text-white border-[#1B3F7A]" 
                    : "bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#EEF3FB] hover:text-[#1B3F7A] hover:border-[#1B3F7A]/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="flex-1 overflow-y-auto pr-2 pb-10 custom-scrollbar space-y-6">
            {faqData.filter(g => activeTab === "Все" || g.category === activeTab).map(group => (
              <div key={group.category} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#E5E7EB] font-bold text-[#1B3F7A] uppercase tracking-wider text-[11px]">
                  {group.category}
                </div>
                <div className="divide-y divide-[#E5E7EB]">
                  {group.questions.map(q => (
                    <button
                      key={q}
                      onClick={() => handleQuestionClick(q)}
                      className={cn(
                        "w-full px-6 py-4 text-left flex justify-between items-center transition-colors group",
                        selectedQuestion === q ? "bg-[#EEF3FB]" : "hover:bg-[#F8FAFC]"
                      )}
                    >
                      <span className={cn(
                        "font-medium pr-4 leading-snug",
                        selectedQuestion === q ? "text-[#1B3F7A] font-bold" : "text-[#1F2937] group-hover:text-[#1B3F7A]"
                      )}>{q}</span>
                      <ArrowRight className={cn(
                        "w-4 h-4 shrink-0 transition-transform",
                        selectedQuestion === q ? "text-[#1B3F7A] translate-x-1" : "text-[#9CA3AF] group-hover:text-[#1B3F7A] group-hover:translate-x-1"
                      )} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Chat Panel */}
        <div className={cn(
          "flex-col w-full lg:w-[60%] h-full bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden",
          selectedQuestion ? "flex" : "hidden lg:flex"
        )}>
          {!selectedQuestion && messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F8FAFC]">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#1B3F7A] mb-6 shadow-sm border border-[#E5E7EB]">
                <Bot className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-[#1B3F7A] mb-3">AI-консультант готов ответить</h3>
              <p className="text-[#6B7280] max-w-md">
                Выберите любой вопрос из списка слева, чтобы получить подробный ответ, или задайте свой вопрос.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-[64px] bg-[#1B3F7A] flex items-center justify-between px-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    ВТ
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold leading-tight">Виктория AI</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span style={{
                        width: 8, height: 8, 
                        borderRadius: '50%',
                        background: providerBadge[provider].color,
                        display: 'inline-block'
                      }}/>
                      <span className="text-[12px] font-medium leading-none tracking-wide text-white/80">
                        {providerBadge[provider].label} • онлайн
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#F8FAFC] flex flex-col gap-6">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "flex gap-3 max-w-[90%] md:max-w-[80%]",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-[#1B3F7A] flex items-center justify-center shrink-0 mt-1 shadow-sm text-white font-bold text-xs">
                          ВТ
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-1">
                        <div className={cn(
                          "p-4 text-[15px] leading-relaxed shadow-sm relative",
                          msg.role === 'user' 
                            ? "bg-[#1B3F7A] text-white rounded-[20px] rounded-tr-sm" 
                            : "bg-white text-[#1F2937] rounded-[20px] rounded-tl-sm border border-[#E5E7EB]"
                        )}>
                          {msg.content.split('\n').map((line, idx) => (
                            <span key={idx}>
                              {line}
                              {idx !== msg.content.split('\n').length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                        <span className={cn(
                          "text-[11px] text-gray-400 font-medium px-1",
                          msg.role === 'user' ? "text-right" : "text-left"
                        )}>
                          {formatTime()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex w-full justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-[#1B3F7A] flex items-center justify-center shrink-0 mt-1 shadow-sm text-white font-bold text-xs">
                        ВТ
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="bg-white text-[#1F2937] p-4 rounded-[20px] rounded-tl-sm shadow-sm border border-[#E5E7EB] flex items-center gap-3">
                          <Loader2 className="w-5 h-5 text-[#1B3F7A] animate-spin" />
                          <span className="text-[15px] text-gray-500 italic">Виктория печатает...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-[#E5E7EB] shrink-0">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(inputValue);
                  }}
                  className="flex items-center gap-3 w-full max-w-4xl mx-auto"
                >
                  <input
                    type="text"
                    placeholder="Напишите уточняющий вопрос..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-[#F3F4F6] border-none rounded-full px-5 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1B3F7A]/20 transition-all text-[#1F2937] placeholder-gray-400"
                    disabled={isTyping}
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="w-12 h-12 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center hover:bg-[#2960B0] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shrink-0 shadow-md"
                    aria-label="Отправить"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}
