import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { sendBotMessage, ChatMessage, Provider } from '../services/botService';
import { useData } from '../store/DataContext';

export default function AIBot() {
  const { state } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [provider, setProvider] = useState<Provider>('gigachat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultQuickButtons = [
    "Как зарегистрировать бренд?",
    "Нарушили мои права",
    "Сколько стоит?",
    "Что такое патент?"
  ];
  const [quickButtons, setQuickButtons] = useState(defaultQuickButtons);

  const WELCOME = state.botConfig?.greeting || 'Здравствуйте! Я AI-консультант Виктории Тарасовой. ' +
    'Задайте вопрос о защите бренда, патенте или авторских правах. ' +
    'Первичная консультация Виктории — бесплатно.';

  const providerBadge: Record<Provider, {color: string; label: string}> = {
    gigachat: { color: '#22C55E', label: 'GigaChat' },
    claude:   { color: '#EAB308', label: 'Claude AI' },
    offline:  { color: '#EF4444', label: 'Офлайн' },
  };

  useEffect(() => {
    const handleOpen = (e: any) => {
      setIsOpen(true);
      if (e.detail?.initialMessage) {
        setMessages([{ role: 'assistant', content: e.detail.initialMessage }]);
      } else if (messages.length === 0) {
        setMessages([{ role: 'assistant', content: WELCOME }]);
      }
      
      if (e.detail?.chips) {
        setQuickButtons(e.detail.chips);
      }
    };
    window.addEventListener('open-ai-bot', handleOpen);
    return () => window.removeEventListener('open-ai-bot', handleOpen);
  }, [messages.length, WELCOME]);

  useEffect(() => {
    if (isOpen) {
      if (!(window as any).activeModals) (window as any).activeModals = 0;
      (window as any).activeModals++;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        (window as any).activeModals--;
        if ((window as any).activeModals <= 0) {
          document.body.style.overflow = '';
          (window as any).activeModals = 0;
        }
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
        { 
          role: 'assistant', 
          content: 'Сейчас не могу ответить онлайн. Напишите напрямую: +7 (999) 000-00-00 или Telegram' 
        }
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
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center pointer-events-auto bg-white/30 backdrop-blur-sm transition-opacity duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-[95vw] md:w-[90vw] max-w-[1200px] h-[95vh] md:h-[85vh] max-h-[800px] bg-white md:rounded-3xl shadow-[0_0_50px_rgba(27,63,122,0.3)] border border-[#3B82F6]/20 flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300 relative">
            
            {/* Header */}
            <div className="h-[80px] bg-[#1B3F7A] flex items-center justify-between px-6 md:px-8 shrink-0 relative overflow-hidden">
               <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#3B82F6]/30 blur-[60px] rounded-full pointer-events-none"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  ВТ
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-xl tracking-wide uppercase">Виктория AI</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span style={{
                      width: 8, height: 8, 
                      borderRadius: '50%',
                      background: providerBadge[provider].color,
                      display: 'inline-block',
                      boxShadow: `0 0 10px ${providerBadge[provider].color}`
                    }}/>
                    <span className="text-[12px] font-bold tracking-widest uppercase text-white/70">
                      {providerBadge[provider].label} • онлайн
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all z-10"
                aria-label="Закрыть"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 bg-[#F8FAFC] flex flex-col gap-6 relative">
              <div className="max-w-5xl mx-auto w-full flex flex-col gap-6">
                {messages.map((msg, i) => (
                  <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "flex gap-4 max-w-[90%] md:max-w-[75%]",
                      msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}>
                      {msg.role === 'assistant' && (
                        <div className="w-10 h-10 rounded-2xl bg-[#1B3F7A] flex items-center justify-center shrink-0 mt-1 shadow-md text-white font-bold text-sm">
                          ВТ
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-1">
                        <div className={cn(
                          "p-5 text-[16px] leading-relaxed relative",
                          msg.role === 'user' 
                            ? "bg-[#1B3F7A] text-white rounded-[24px] rounded-tr-sm shadow-[0_4px_20px_rgba(27,63,122,0.15)]" 
                            : "bg-white text-[#1F2937] rounded-[24px] rounded-tl-sm border border-[#E5E7EB] shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                        )}>
                          {msg.content.split('\n').map((line, idx) => (
                            <span key={idx}>
                              {line}
                              {idx !== msg.content.split('\n').length - 1 && <br />}
                            </span>
                          ))}
                        </div>
                        <span className={cn(
                          "text-[12px] font-bold tracking-wider text-gray-400 px-2 mt-1",
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
                    <div className="flex gap-4 max-w-[80%]">
                      <div className="w-10 h-10 rounded-2xl bg-[#1B3F7A] flex items-center justify-center shrink-0 mt-1 shadow-md text-white font-bold text-sm">
                        ВТ
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="bg-white text-[#1F2937] px-6 py-5 rounded-[24px] rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-[#E5E7EB] flex items-center gap-3">
                          <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin" />
                          <span className="text-[15px] font-medium text-gray-500">Ассистент печатает...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            </div>

            {/* Quick Questions */}
            <div className="bg-white border-t border-[#E5E7EB] overflow-x-auto text-nowrap hide-scrollbar px-6 md:px-8 py-4 flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] relative z-10 shrink-0">
               <div className="max-w-5xl mx-auto w-full flex gap-3">
                {quickButtons.map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputValue(btn);
                      handleSend(btn);
                    }}
                    className="whitespace-nowrap text-[14px] font-bold tracking-wide bg-[#F8F9FA] border border-[#E5E7EB] text-[#1B3F7A] hover:bg-[#1B3F7A] hover:text-white hover:border-[#1B3F7A] px-6 py-3 rounded-full transition-all text-center shadow-sm"
                  >
                    {btn}
                  </button>
                ))}
               </div>
            </div>

            {/* Input Area */}
            <div className="h-[90px] bg-white border-t border-[#E5E7EB] shrink-0 p-0 relative z-10">
              <div className="max-w-5xl mx-auto w-full h-full">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend(inputValue);
                  }}
                  className="flex items-center h-full px-6 md:px-8 w-full"
                >
                  <input
                    type="text"
                    placeholder="Напишите ваш вопрос..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-transparent border-none text-[16px] focus:outline-none focus:ring-0 text-[#1F2937] placeholder-gray-400 h-full font-medium"
                    disabled={isTyping}
                  />
                  <button 
                    type="submit"
                    disabled={!inputValue.trim() || isTyping}
                    className="w-14 h-14 bg-[#3B82F6] text-white rounded-2xl flex items-center justify-center hover:bg-[#2563EB] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shrink-0 shadow-[0_4px_15px_rgba(59,130,246,0.3)] disabled:shadow-none ml-4 group"
                    aria-label="Отправить"
                  >
                    <Send className="w-6 h-6 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

