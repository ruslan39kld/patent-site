import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useData } from '../../store/DataContext';
import { Bot, RefreshCw, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast } from './AdminLayout';
import { syncBotKnowledge } from '../../lib/botSync';
import { matchesMetaQuestion, META_QUESTION_RESPONSE, matchesPriceQuestion, PRICE_QUESTION_RESPONSE } from '../../services/botService';

export default function BotAdmin() {
  const { state, updateState } = useData();
  const [testMessage, setTestMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptDraft, setPromptDraft] = useState(state.botConfig?.systemPrompt || '');
  const [promptDirty, setPromptDirty] = useState(false);
  const { toast } = useToast();

  const handleManualSync = () => {
    const newState = syncBotKnowledge(state);
    updateState(newState);
    const charCount = newState.botConfig?.knowledgeBase?.length || 0;
    toast(`База знаний успешно обновлена: ${charCount} символов проиндексировано.`);
  };

  const handleSavePrompt = () => {
    updateState({
      ...state,
      botConfig: { ...state.botConfig!, systemPrompt: promptDraft }
    });
    setPromptDirty(false);
    toast('Системный промпт сохранён.');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testMessage.trim() || isLoading) return;

    const userText = testMessage.trim();
    setTestMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);

    if (matchesMetaQuestion(userText)) {
      setChatHistory(prev => [...prev, { role: 'assistant', text: META_QUESTION_RESPONSE }]);
      return;
    }
    if (matchesPriceQuestion(userText)) {
      setChatHistory(prev => [...prev, { role: 'assistant', text: PRICE_QUESTION_RESPONSE }]);
      return;
    }

    setIsLoading(true);

    try {
      const systemPrompt = state.botConfig?.systemPrompt || "";
      const knowledge = state.botConfig?.knowledgeBase || "";
      
      const fullContext = `СИСТЕМНАЯ ИНСТРУКЦИЯ:\n${systemPrompt}\n\nБАЗА ЗНАНИЙ САЙТА:\n${knowledge}\n\nИНСТРУКЦИЯ: Отвечай пользователю строго на основе базы знаний. Если ответа нет - скажи об этом и предложи контакты.`;

      const response = await fetch('/api/gigachat/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'GigaChat',
          messages: [
            { role: 'system', content: fullContext },
            { role: 'user', content: userText }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      const data = await response.json();

      if (response.ok && data.choices?.[0]?.message?.content) {
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          text: data.choices[0].message.content 
        }]);
      } else {
        throw new Error(data.error || 'Ошибка при получении ответа от AI');
      }
    } catch (err: any) {
      toast(`Ошибка: ${err.message}`);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        text: `❌ Произошла ошибка: ${err.message}. Проверьте настройки API ключей в переменных окружения.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isBotActive = true; // For now, assume it's always "working" if the page exists

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-[#1B3F7A]" />
          <h1 className="text-2xl font-bold text-[#0F172A]">Управление ИИ Ботом</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
            isBotActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            <div className={cn("w-2 h-2 rounded-full", isBotActive ? "bg-green-500 animate-pulse" : "bg-red-500")} />
            {isBotActive ? 'Бот активен' : 'Бот отключен'}
          </div>
          <button
            onClick={handleManualSync}
            className="text-[#1B3F7A] hover:bg-gray-50 border border-[#E2E8F0] px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm text-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Переиндексировать сайт
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
        <h2 className="text-lg font-bold text-[#0F172A]">Системный промпт</h2>
        <p className="text-xs text-[#64748B] mb-4">Определяет тон и стиль ответов бота. Не затирается при переиндексации сайта.</p>
        <textarea
          rows={10}
          value={promptDraft}
          onChange={(e) => {
            setPromptDraft(e.target.value);
            setPromptDirty(true);
          }}
          className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 focus:ring-1 focus:ring-[#1B3F7A] focus:border-[#1B3F7A] outline-none transition-all font-mono text-sm"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={handleSavePrompt}
            disabled={!promptDirty}
            className="bg-[#1B3F7A] hover:bg-[#1B3F7A]/90 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Сохранить промпт
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Статус базы знаний</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-blue-900">Авто-синхронизация включена</p>
                  <p className="text-xs text-blue-700 mt-1">Любые изменения в Конструкторе, услугах или статьях автоматически обновляют память бота.</p>
                </div>
              </div>

              <div className="p-4 border border-[#E2E8F0] rounded-lg bg-gray-50">
                <p className="text-xs font-bold text-[#64748B] uppercase mb-1">Размер проиндексированного текста</p>
                <p className="text-lg font-bold text-[#1B3F7A]">
                  {state.botConfig?.knowledgeBase ? (state.botConfig.knowledgeBase.length / 1024).toFixed(1) : '0'} KB
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-orange-900">Управление ключами</p>
                  <p className="text-xs text-orange-700 mt-1">API ключи провайдеров теперь зашиты в системные переменные (.env) для безопасности.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] flex flex-col h-[600px]">
            <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#1B3F7A]" />
                <h2 className="text-lg font-bold text-[#0F172A]">Тестирование бота</h2>
              </div>
              <button 
                onClick={() => setChatHistory([])}
                className="text-xs text-[#64748B] hover:text-[#1B3F7A] transition-colors"
              >
                Очистить чат
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#94A3B8]">
                  <Bot className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm">Напишите сообщение, чтобы проверить работу бота</p>
                </div>
              ) : (
                chatHistory.map((msg, i) => (
                  <div key={i} className={cn(
                    "flex",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}>
                    <div className={cn(
                      "max-w-[80%] p-3 rounded-xl text-sm shadow-sm [&_p]:m-0 [&_p+p]:mt-2 [&_ul]:pl-4 [&_ol]:pl-4 [&_ul]:list-disc [&_ol]:list-decimal [&_strong]:font-bold",
                      msg.role === 'user'
                        ? "bg-[#1B3F7A] text-white rounded-br-none"
                        : "bg-white text-[#0F172A] border border-[#E2E8F0] rounded-bl-none"
                    )}>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E2E8F0] p-3 rounded-xl rounded-bl-none shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#E2E8F0] bg-white rounded-b-xl">
              <div className="relative">
                <input
                  type="text"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Задайте вопрос по контенту сайта..."
                  className="w-full pl-4 pr-12 py-3 border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-[#1B3F7A] focus:border-[#1B3F7A] outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!testMessage.trim() || isLoading}
                  className="absolute right-2 top-1.5 p-2 bg-[#1B3F7A] text-white rounded-lg hover:bg-[#1B3F7A]/90 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
