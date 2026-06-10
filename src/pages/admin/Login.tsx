import React, { useState } from 'react';
import { ShieldCheck, Lock, User } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center px-4 relative selection:bg-secondary selection:text-white">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGIxMTRiIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')] opacity-100 z-0"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] z-0"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[100px] z-0"></div>

      <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-2xl shadow-xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-accent mb-4 shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">Панель управления</h1>
          <p className="text-sm font-medium text-gray">Виктория Тарасова · Патентный поверенный РФ №1558</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm font-medium p-4 rounded-lg mb-6 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-primary mb-2">Логин</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray/50" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-primary font-medium"
                placeholder="Введите логин"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-primary mb-2">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray/50" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-primary font-medium"
                placeholder="Введите пароль"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-6"
          >
            Войти в систему
          </button>
        </form>
      </div>
    </div>
  );
}
