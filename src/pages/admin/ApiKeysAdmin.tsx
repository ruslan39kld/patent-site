import { useState, useEffect } from 'react';
import { Save, CheckCircle, XCircle, Key, Server, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ApiKeysAdmin() {
  const [gigachatKey, setGigachatKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');
  
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    setGigachatKey(localStorage.getItem('gigachat_auth_key') || '');
    setAnthropicKey(localStorage.getItem('anthropic_api_key') || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('gigachat_auth_key', gigachatKey);
    localStorage.setItem('anthropic_api_key', anthropicKey);
    // show success indicator (could be simple alert or toast)
    alert('Настройки сохранены');
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

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">API Ключи (AI Бот)</h1>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
        >
          <Save className="w-4 h-4" /> Сохранить изменения
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#22C55E]/10 rounded-full flex items-center justify-center text-[#22C55E]">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">GigaChat API (Сбер)</h2>
            <p className="text-sm text-gray-500">Основной AI провайдер для бота консультанта</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">GigaChat Auth Key</label>
            <div className="relative">
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={gigachatKey}
                onChange={(e) => setGigachatKey(e.target.value)}
                placeholder="Basic eyJ..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Ключ из личного кабинета developers.sber.ru. Формат: Basic {'<base64>'}. <br />Сохраняется в localStorage браузера или в .env на сервере.</p>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <button 
              onClick={testGigaChat}
              disabled={testStatus === 'loading'}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-bold flex items-center gap-2"
            >
              {testStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
              Проверить GigaChat
            </button>
            
            {testStatus !== 'idle' && (
              <span className={cn(
                "text-sm font-medium",
                testStatus === 'success' ? "text-[#22C55E]" : "text-[#EF4444]"
              )}>
                {testMessage}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#EAB308]/10 rounded-full flex items-center justify-center text-[#EAB308]">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Anthropic API (Claude)</h2>
            <p className="text-sm text-gray-500">Резервный провайдер если GigaChat недоступен</p>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Anthropic API Key (fallback)</label>
            <div className="relative">
              <Key className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Резервный провайдер если GigaChat недоступен. Сохраняется в localStorage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
