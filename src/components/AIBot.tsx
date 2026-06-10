import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { sendBotMessage, ChatMessage, Provider } from '../services/botService';

export default function AIBot() {
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

  const WELCOME = 'Здравствуйте! Я AI-консультант Виктории Тарасовой. ' +
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
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
    return () => {
      document.body.style.overflow = '';
    };
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
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[10.5rem] right-6 z-40 w-[56px] h-[56px] rounded-full bg-[#1B3F7A] text-white flex items-center justify-center shadow-lg transition-all hover:bg-[#2960B0] hover:scale-110"
        aria-label="Открыть AI-консультанта"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center md:p-4 transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full h-full md:w-[1000px] md:h-[90vh] md:max-h-[90vh] bg-white md:rounded-[16px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200">
            
            {/* Header */}
            <div className="h-[64px] bg-[#1B3F7A] flex items-center justify-between px-6 shrink-0 relative">
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
                      display: 'inline-block',
                      marginRight: 6
                    }}/>
                    <span className="text-[12px] font-medium leading-none tracking-wide text-white/80">
                      {providerBadge[provider].label} • онлайн
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Закрыть"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#F8FAFC] flex flex-col gap-6 relative">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "flex gap-3 max-w-[90%] md:max-w-[70%]",
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

            {/* Quick Questions */}
            <div className="bg-white border-t border-[#E5E7EB] overflow-x-auto text-nowrap hide-scrollbar px-6 py-3 flex gap-2">
              {quickButtons.map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputValue(btn);
                    handleSend(btn);
                  }}
                  className="whitespace-nowrap text-[13px] font-medium bg-[#F8F9FA] border border-[#E5E7EB] text-[#1B3F7A] hover:bg-[#EEF3FB] hover:border-[#1B3F7A]/30 px-6 py-2.5 rounded-full transition-colors text-center shadow-sm"
                >
                  {btn}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="h-[64px] bg-white border-t border-[#E5E7EB] shrink-0 p-0">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
                className="flex items-center h-full pl-6 pr-4 w-full"
              >
                <input
                  type="text"
                  placeholder="Напишите вопрос..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-transparent border-none text-[15px] focus:outline-none focus:ring-0 text-[#1F2937] placeholder-gray-400 h-full"
                  disabled={isTyping}
                />
                <button 
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 bg-[#1B3F7A] text-white rounded-full flex items-center justify-center hover:bg-[#2960B0] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shrink-0 shadow-sm ml-4"
                  aria-label="Отправить"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

