import { useState, useEffect, DragEvent, ChangeEvent } from 'react';
import { useData } from '../../store/DataContext';
import { Save, CheckCircle2, Bot, Database, UploadCloud, FileText, Trash2, Key, Server, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useToast } from './AdminLayout';

export default function BotAdmin() {
  const { state, updateState, isLoaded } = useData();
  const [prompts, setPrompts] = useState({
    systemPrompt: state.botConfig?.systemPrompt || 'Вы — опытный патентный поверенный РФ. Ваша задача — помогать клиентам по вопросам защиты интеллектуальной собственности...',
    greeting: state.botConfig?.greeting || 'Здравствуйте! Я AI-ассистент патентного поверенного. Чем могу помочь?',
  });
  const [knowledgeBase, setKnowledgeBase] = useState(state.botConfig?.knowledgeBase || 'Добавьте сюда факты, цены, и специфичную информацию для вашего бизнеса, которую бот должен использовать при ответах...');
  const [useGigaChat, setUseGigaChat] = useState(state.botConfig?.useGigaChat ?? true);
  const [documents, setDocuments] = useState(state.botConfig?.documents || []);
  const [isDragging, setIsDragging] = useState(false);
  const [saved, setSaved] = useState(false);

  // Re-sync once the real data has loaded from the server, otherwise
  // saving would overwrite it with the stale placeholder snapshot.
  useEffect(() => {
    if (!isLoaded) return;
    setPrompts({
      systemPrompt: state.botConfig?.systemPrompt || prompts.systemPrompt,
      greeting: state.botConfig?.greeting || prompts.greeting,
    });
    setKnowledgeBase(state.botConfig?.knowledgeBase || knowledgeBase);
    setUseGigaChat(state.botConfig?.useGigaChat ?? true);
    setDocuments(state.botConfig?.documents || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);
  
  // API Keys state
  const [gigachatKey, setGigachatKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    setGigachatKey(localStorage.getItem('gigachat_auth_key') || '');
    setAnthropicKey(localStorage.getItem('anthropic_api_key') || '');
  }, []);

  const handleSave = () => {
    updateState({
      ...state,
      botConfig: {
        ...state.botConfig,
        systemPrompt: prompts.systemPrompt,
        greeting: prompts.greeting,
        knowledgeBase,
        useGigaChat,
        documents
      }
    });
    localStorage.setItem('gigachat_auth_key', gigachatKey);
    localStorage.setItem('anthropic_api_key', anthropicKey);
    setSaved(true);
    toast('Настройки бота и ключи успешно сохранены');
    setTimeout(() => setSaved(false), 2000);
  };

  const testGigaChat = async () => {
    setTestStatus('loading');
    setTestMessage('');
    try {
      const res = await fetch('/api/gigachat/token', {
        method: 'POST',
        headers: {
          'x-gigachat-auth-key': gigachatKey
        }
      });
      
      const data = await res.json();
      if (res.ok && data.access_token) {
        setTestStatus('success');
        setTestMessage('✅ GigaChat подключён');
      } else {
        setTestStatus('error');
        setTestMessage(`❌ Ошибка: ${data.error || 'Неизвестная ошибка'}`);
      }
    } catch (e: any) {
      setTestStatus('error');
      setTestMessage(`❌ Ошибка сети: ${e.message}`);
    }
  };

  const simulateExtraction = (file: File) => {
    const newDoc = {
      id: `doc-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      uploadDate: new Date().toISOString(),
      extractedText: `\n\n--- СОДЕРЖИМОЕ ДОКУМЕНТА: ${file.name} ---\n[Конвертировано из ${file.name.split('.').pop()?.toUpperCase()}]\nТекстовое содержимое для файла...`,
    };

    setDocuments(prev => [...prev, newDoc]);
    setKnowledgeBase(prev => prev + newDoc.extractedText);
    toast('Файл успешно сконвертирован и добавлен в базу (SQLite)');
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(file => {
      simulateExtraction(file);
    });
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const removeDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setKnowledgeBase(prev => prev.replace(doc.extractedText, ''));
    }
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast('Документ удален');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-[#1B3F7A]" />
          <h1 className="text-2xl font-bold text-[#0F172A]">Настройки ИИ Бота</h1>
        </div>
        <button
          onClick={handleSave}
          className="bg-[#1B3F7A] hover:bg-[#1B3F7A]/90 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
        >
          {saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saved ? 'Сохранено' : 'Сохранить изменения'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
             <h2 className="text-lg font-bold text-[#0F172A] mb-4">Промпты и поведение</h2>
             
             <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#0F172A] mb-1">Основной системный промпт (System Prompt)</label>
                  <p className="text-sm text-[#64748B] mb-2">Определяет роль бота, его тон общения и основные правила. Без ограничения по количеству символов.</p>
                  <textarea
                    rows={12}
                    maxLength={100000}
                    value={prompts.systemPrompt}
                    onChange={(e) => setPrompts({ ...prompts, systemPrompt: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all shadow-sm font-mono text-sm"
                    placeholder="Напишите инструкцию для AI..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-[#0F172A] mb-2">Приветственное сообщение</label>
                  <textarea
                    rows={2}
                    value={prompts.greeting}
                    onChange={(e) => setPrompts({ ...prompts, greeting: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all shadow-sm text-sm"
                    placeholder="Напишите приветствие..."
                  />
                </div>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
             <div className="flex items-center gap-2 mb-4">
               <Database className="w-5 h-5 text-[#3B82F6]" />
               <h2 className="text-lg font-bold text-[#0F172A]">База знаний (RAG) SQLite</h2>
             </div>
             
             <div className="mb-6">
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Загрузка документов (PDF, DOCX, XLSX, TXT, PNG, JPEG)</label>
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragging ? 'border-[#3B82F6] bg-blue-50' : 'border-[#E2E8F0] hover:border-[#3B82F6]/50 hover:bg-gray-50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <UploadCloud className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-[#3B82F6]' : 'text-gray-400'}`} />
                  <p className="text-sm text-[#64748B] mb-4">Перетащите файлы сюда или нажмите для выбора</p>
                  <label className="bg-white border border-[#E2E8F0] text-[#0F172A] font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm inline-block">
                    Выбрать файлы
                    <input 
                      type="file" 
                      className="hidden" 
                      multiple 
                      accept=".pdf,.docx,.xlsx,.txt,.png,.jpeg,.jpg"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>
             </div>

             {documents.length > 0 && (
               <div className="mb-6">
                 <h3 className="text-sm font-bold text-[#0F172A] mb-3">Загруженные документы (SQLite)</h3>
                 <div className="space-y-3">
                   {documents.map(doc => (
                     <div key={doc.id} className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg bg-gray-50">
                       <div className="flex items-center gap-3 overflow-hidden">
                         <div className="p-2 bg-white rounded shadow-sm border border-[#E2E8F0]">
                           <FileText className="w-4 h-4 text-[#3B82F6]" />
                         </div>
                         <div className="min-w-0">
                           <p className="text-sm font-medium text-[#0F172A] truncate">{doc.name}</p>
                           <p className="text-xs text-[#64748B]">{doc.type} • {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.uploadDate).toLocaleDateString()}</p>
                         </div>
                       </div>
                       <button onClick={() => removeDocument(doc.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-white">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                   ))}
                 </div>
               </div>
             )}
             
             <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Сконвертированный текст (txt/json)</label>
                <p className="text-xs text-[#64748B] mb-2">Бот будет искать ответы в этом тексте перед тем как отвечать пользователю. Заполняется автоматически при загрузке файлов.</p>
                <textarea
                  rows={8}
                  value={knowledgeBase}
                  onChange={(e) => setKnowledgeBase(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-3 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all shadow-sm font-mono text-sm"
                  placeholder="Вставьте тексты из FAQ, статьи, регламенты, прайсы или загрузите файлы выше..."
                />
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
             <h2 className="text-lg font-bold text-[#0F172A] mb-4">Провайдер AI</h2>
             
             <div className="space-y-4">
                <label className="flex items-start gap-3 p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-gray-50">
                   <input 
                     type="radio" 
                     name="provider" 
                     checked={useGigaChat} 
                     onChange={() => setUseGigaChat(true)}
                     className="mt-1"
                   />
                   <div>
                     <div className="font-bold text-[#0F172A]">GigaChat API</div>
                     <div className="text-xs text-[#64748B]">Основной провайдер, рекомендуется для РФ.</div>
                   </div>
                </label>

                <label className="flex items-start gap-3 p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-gray-50">
                   <input 
                     type="radio" 
                     name="provider" 
                     checked={!useGigaChat} 
                     onChange={() => setUseGigaChat(false)}
                     className="mt-1"
                   />
                   <div>
                     <div className="font-bold text-[#0F172A]">Anthropic API (Claude)</div>
                     <div className="text-xs text-[#64748B]">Резервный провайдер. Требуется настройка прокси для РФ.</div>
                   </div>
                </label>
             </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
             <h2 className="text-lg font-bold text-[#0F172A] mb-4">API Ключи</h2>
             
             <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-[#1E293B] mb-2">
                    GigaChat Auth Key
                  </label>
                  <div className="relative">
                    <Key className="w-5 h-5 text-[#64748B] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={gigachatKey}
                      onChange={(e) => setGigachatKey(e.target.value)}
                      placeholder="Basic eyJ..."
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all font-mono text-sm"
                    />
                  </div>
                  <p className="text-xs text-[#64748B] mt-2">Ключ из developers.sber.ru. (Формат: Basic {'<base64>'})</p>
                  <div className="mt-2 flex items-center gap-3">
                    <button 
                      onClick={testGigaChat}
                      disabled={testStatus === 'loading'}
                      className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] rounded-md hover:bg-gray-100 transition-colors text-xs font-bold flex items-center gap-2"
                    >
                      {testStatus === 'loading' && <Loader2 className="w-3 h-3 animate-spin" />}
                      Проверить
                    </button>
                    {testStatus !== 'idle' && (
                      <span className={cn(
                        "text-xs font-medium",
                        testStatus === 'success' ? "text-[#22C55E]" : "text-[#EF4444]"
                      )}>
                        {testMessage}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0]">
                  <label className="block text-sm font-bold text-[#1E293B] mb-2">
                    Anthropic API Key (Claude)
                  </label>
                  <div className="relative">
                    <Key className="w-5 h-5 text-[#64748B] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={anthropicKey}
                      onChange={(e) => setAnthropicKey(e.target.value)}
                      placeholder="sk-ant-..."
                      className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg focus:ring-1 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all font-mono text-sm"
                    />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
