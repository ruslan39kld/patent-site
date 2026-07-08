import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bot, Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { sendBotMessage, ChatMessage, Provider } from '../services/botService';
import { useData } from '../store/DataContext';

const defaultFaqData = [
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

export default function FAQ() {
  const { state: appState } = useData();
  const [activeTab, setActiveTab] = useState("Все");
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const faqData = useMemo(() => {
    if (!appState.faqItems || appState.faqItems.length === 0) {
      return defaultFaqData;
    }
    
    const catMap: Record<string, string> = {
      'general': 'Общие',
      'trademarks': 'Товарные знаки',
      'patents': 'Патенты',
      'copyright': 'Авторские права'
    };

    const grouped = appState.faqItems.reduce((acc, item) => {
      const cat = catMap[item.category] || item.category || 'Общие';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item.q);
      return acc;
    }, {} as Record<string, string[]>);

    return Object.entries(grouped).map(([category, questions]) => ({
      category,
      questions
    }));
  }, [appState.faqItems]);

  const categories = Array.from(new Set(["Все", ...faqData.map(g => g.category)]));
  
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
    // Check if we came from home page with a specific question
    const state = location.state as { question?: string };
    if (state?.question && !selectedQuestion) {
      handleQuestionClick(state.question);
      // Remove state so it doesn't trigger again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, selectedQuestion]);

  useEffect(() => {
    if (messagesEndRef.current) {
      const parent = messagesEndRef.current.parentElement;
      if (parent) {
        parent.scrollTo({ top: parent.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages, isTyping]);

  const handleQuestionClick = async (question: string) => {
    setSelectedQuestion(question);
    
    const newUserMessage: ChatMessage = { role: 'user', content: question };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
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

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 h-[calc(100vh-80px)] lg:h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-8 overflow-hidden">
        
        {/* Left Side: Questions List */}
        <div className={cn(
          "flex-col w-full lg:w-[40%] h-full shrink-0",
          selectedQuestion ? "hidden lg:flex" : "flex"
        )}>
          <div className="mb-6 shrink-0 relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#3B82F6]/10 blur-[120px] rounded-full pointer-events-none"></div>
            <Link to="/#faq" className="inline-flex items-center text-[#3B82F6] font-medium hover:text-[#1B3F7A] transition-colors mb-6 relative z-10">
              <ArrowLeft className="w-5 h-5 mr-2" /> Назад на главную
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-2 relative z-10">Все вопросы и ответы</h1>
            <p className="text-[#6B7280] relative z-10">Нажмите на вопрос — получите ответ от AI-консультанта</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-2 shrink-0 hide-scrollbar relative z-10">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "px-4 py-2 rounded-full font-bold text-[13px] whitespace-nowrap transition-all border",
                  activeTab === cat 
                    ? "bg-[#3B82F6] text-white border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.4)]" 
                    : "bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#EEF3FB] hover:text-[#1B3F7A] hover:border-[#3B82F6]/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="flex-1 overflow-y-auto pr-2 pb-10 custom-scrollbar space-y-6 relative z-10">
            {faqData.filter(g => activeTab === "Все" || g.category === activeTab).map(group => (
              <div key={group.category} className="bg-white rounded-2xl border border-[#3B82F6]/15 overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.05)]">
                <div className="bg-[#f8fafc] px-6 py-3 border-b border-[#3B82F6]/10 font-bold text-[#3B82F6] uppercase tracking-wider text-[11px]">
                  {group.category}
                </div>
                <div className="divide-y divide-[#E5E7EB]/50">
                  {group.questions.map(q => (
                    <button
                      key={q}
                      onClick={() => handleQuestionClick(q)}
                      className={cn(
                        "w-full px-6 py-4 text-left flex justify-between items-center transition-all group relative overflow-hidden",
                        selectedQuestion === q ? "bg-[#3B82F6]/5" : "hover:bg-[#3B82F6]/5"
                      )}
                    >
                      <div className={cn("absolute inset-0 bg-gradient-to-r from-[#3B82F6]/10 to-transparent opacity-0 transition-opacity duration-300", selectedQuestion === q ? "opacity-100" : "group-hover:opacity-100")}></div>
                      <span className={cn(
                        "font-medium pr-4 leading-snug relative z-10",
                        selectedQuestion === q ? "text-[#3B82F6] font-bold drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" : "text-[#1F2937] group-hover:text-[#1B3F7A]"
                      )}>{q}</span>
                      <ArrowRight className={cn(
                        "w-4 h-4 shrink-0 transition-all relative z-10",
                        selectedQuestion === q ? "text-[#3B82F6] translate-x-1 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" : "text-[#9CA3AF] group-hover:text-[#3B82F6] group-hover:translate-x-1"
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
          "flex-col w-full lg:w-[60%] h-full bg-white rounded-2xl border border-[#3B82F6]/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] overflow-hidden relative",
          selectedQuestion ? "flex" : "hidden lg:flex"
        )}>
          {!selectedQuestion && messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F8FAFC] relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[500px] h-[300px] bg-[#3B82F6]/10 blur-[120px] rounded-full pointer-events-none"></div>
              
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#3B82F6] mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-[#3B82F6]/20 relative z-10 rotate-3 transition-transform hover:rotate-6">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-[#1B3F7A] mb-3 relative z-10">AI-консультант готов ответить</h3>
              <p className="text-[#6B7280] max-w-md relative z-10">
                Выберите любой вопрос из списка слева, чтобы получить подробный ответ, или задайте свой вопрос.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="h-[64px] bg-[#3B82F6] flex items-center justify-between px-6 shrink-0 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    ВТ
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold leading-tight drop-shadow-sm">Виктория AI</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span style={{
                        width: 8, height: 8, 
                        borderRadius: '50%',
                        background: providerBadge[provider].color,
                        display: 'inline-block',
                        boxShadow: `0 0 8px ${providerBadge[provider].color}`
                      }}/>
                      <span className="text-[12px] font-medium leading-none tracking-wide text-white/90">
                        {providerBadge[provider].label} • онлайн
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#F8FAFC] flex flex-col gap-6 relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] h-[400px] bg-[#3B82F6]/5 blur-[120px] rounded-full pointer-events-none"></div>

                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex w-full relative z-10", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "flex gap-3 max-w-[90%] md:max-w-[80%]",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(59,130,246,0.3)] text-white font-bold text-xs border border-white/20">
                          ВТ
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-1">
                        <div className={cn(
                          "p-4 text-[15px] leading-relaxed shadow-sm relative",
                          msg.role === 'user' 
                            ? "bg-[#3B82F6] text-white rounded-[20px] rounded-tr-sm shadow-[0_4px_15px_rgba(59,130,246,0.2)]" 
                            : "bg-white text-[#1F2937] rounded-[20px] rounded-tl-sm border border-[#3B82F6]/10 shadow-[0_4px_15px_rgba(0,0,0,0.02)]"
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
                          msg.role === 'user' ? "text-right text-[#3B82F6]/70" : "text-left"
                        )}>
                          {formatTime()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex w-full justify-start relative z-10">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(59,130,246,0.3)] text-white font-bold text-xs border border-white/20">
                        ВТ
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="bg-white text-[#1F2937] p-4 rounded-[20px] rounded-tl-sm shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-[#3B82F6]/10 flex items-center gap-3">
                          <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin" />
                          <span className="text-[15px] text-[#3B82F6]/70 italic font-medium">Виктория печатает...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-[#3B82F6]/10 shrink-0 relative z-10">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(inputValue);
                  }}
                  className="flex items-center gap-3 w-full max-w-4xl mx-auto relative"
                >
                  <input
                    type="text"
                    placeholder="Напишите уточняющий вопрос..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-[#F8FAFC] border border-[#3B82F6]/20 rounded-full px-5 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/30 focus:border-[#3B82F6]/40 transition-all text-[#1F2937] placeholder-gray-400 shadow-inner"
                    disabled={isTyping}
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="w-12 h-12 bg-[#3B82F6] text-white rounded-full flex items-center justify-center hover:bg-[#2563EB] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shrink-0 shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:shadow-[0_4px_20px_rgba(59,130,246,0.6)] hover:-translate-y-0.5"
                    aria-label="Отправить"
                  >
                    <Send className="w-5 h-5 ml-1 drop-shadow-sm" />
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
