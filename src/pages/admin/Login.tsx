import React, { useState } from 'react';
import { ShieldCheck, Lock, User } from 'lucide-react';
import { useData } from '../../store/DataContext';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { state } = useData();
  const expectedLogin = 'tarasovapatentright@yandex.ru';
  const expectedPassword = '123456789';

  const [username, setUsername] = useState(expectedLogin);
  const [password, setPassword] = useState(expectedPassword);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === expectedLogin && password === expectedPassword) {
      onLogin();
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8E8] flex flex-col justify-center items-center px-4 relative selection:bg-[#1B3F7A] selection:text-white font-sans text-[#1E293B]">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#1B3F7A]/5 rounded-full blur-[120px] z-0 pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#22D3EE]/5 rounded-full blur-[120px] z-0 pointer-events-none"></div>

      <div className="bg-white/80 backdrop-blur-xl border border-[#E2E8F0] p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1B3F7A]/20 text-[#1B3F7A] mb-4 shadow-lg border border-[#1B3F7A]/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] mb-2">Панель управления</h1>
          <p className="text-sm font-medium text-[#64748B]">Синхронизация и управление сайтом</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 text-sm font-medium p-4 rounded-lg mb-6 border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-2">Логин</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3F7A]/50 focus:border-[#1B3F7A] transition-all text-[#0F172A] font-medium placeholder-[#94A3B8]/50"
                placeholder="Введите логин"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-2">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3F7A]/50 focus:border-[#1B3F7A] transition-all text-[#0F172A] font-medium placeholder-[#94A3B8]/50"
                placeholder="Введите пароль"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#1B3F7A] hover:bg-[#1B3F7A]/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-6"
          >
            Войти в систему
          </button>
        </form>
      </div>
    </div>
  );
}
