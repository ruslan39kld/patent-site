import { useData } from '../../store/DataContext';
import { Eye, MousePointerClick, Bot, FileText, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { state, resetState } = useData();

  // Basic stats mapping
  const todayVisits = state.stats?.todayVisits || 0;
  const totalVisits = state.stats?.totalVisits || 0;
  const pagesInDb = (state.services?.length || 0) + (state.cases?.length || 0) + (state.blogPosts?.length || 0);
  const leadsCount = state.leads?.length || 0;

  // Chart data calculation
  const history = state.stats?.viewsHistory || [];
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    let dayCount = 0;
    if (dateStr === state.stats?.lastVisitDate) {
      dayCount = state.stats?.todayVisits || 0;
    } else {
      const histItem = history.find(h => h.date === dateStr);
      if (histItem) dayCount = histItem.visits;
    }
    
    last7Days.push({
      name: d.toLocaleDateString('ru-RU', { weekday: 'short' }),
      visits: dayCount
    });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F172A]">Дашборд</h1>
          <p className="text-[#64748B] text-sm mt-1">Отображение актуальных данных активности</p>
        </div>
        <button 
          onClick={() => {
            resetState();
            alert('Данные сброшены.');
          }}
          className="bg-[#EEF3FB] text-[#1B3F7A] border border-[#1B3F7A]/20 hover:bg-[#EEF3FB]/80 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center"
        >
          <AlertCircle className="w-4 h-4 mr-2" /> Сбросить данные
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#EEF3FB] text-[#1B3F7A] flex items-center justify-center shrink-0">
             <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] text-[#64748B] font-medium mb-1">Визитов сегодня</div>
            <div className="text-[32px] leading-tight font-bold text-[#0F172A] flex items-baseline gap-2">
              {todayVisits}
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
             <MousePointerClick className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] text-[#64748B] font-medium mb-1">Всего визитов</div>
            <div className="text-[32px] leading-tight font-bold text-[#0F172A] flex items-baseline gap-2">
              {totalVisits}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-green-50 text-[#10B981] flex items-center justify-center shrink-0">
             <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] text-[#64748B] font-medium mb-1">Всего заявок</div>
            <div className="text-[32px] leading-tight font-bold text-[#0F172A] flex items-baseline gap-2">
              {leadsCount}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex gap-4">
          <div className="w-10 h-10 rounded-[10px] bg-[#FBF3DC] text-[#C8A028] flex items-center justify-center shrink-0">
             <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[13px] text-[#64748B] font-medium mb-1">Страниц в базе</div>
            <div className="text-[32px] leading-tight font-bold text-[#0F172A] flex items-baseline gap-2">
              {pagesInDb}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-[#0F172A]">Активность за 7 дней</h2>
          <div className="flex gap-2">
            <button className="text-sm px-2 py-1 bg-[#F8FAFC] rounded text-[#0F172A] font-medium">7д</button>
            <button className="text-sm px-2 py-1 text-[#64748B] hover:bg-[#F8FAFC] rounded">30д</button>
            <button className="text-sm px-2 py-1 text-[#64748B] hover:bg-[#F8FAFC] rounded">90д</button>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last7Days} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(27,63,122,0.15)"/>
                  <stop offset="95%" stopColor="rgba(27,63,122,0)"/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="name" stroke="#94A3B8" tick={{fill: '#94A3B8', fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis stroke="#94A3B8" tick={{fill: '#94A3B8', fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', color: '#0F172A', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#1B3F7A' }}
              />
              <Area type="monotone" dataKey="visits" stroke="#1B3F7A" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col">
        <div className="px-6 py-4 border-b border-[#E2E8F0]">
          <h2 className="font-bold text-[#0F172A]">Последние заявки</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left bg-white">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs uppercase text-[#64748B] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">ФИО</th>
                <th className="px-6 py-4">Телефон / Мессенджер</th>
                <th className="px-6 py-4">Коротко о задаче</th>
                <th className="px-6 py-4">Дата поступления</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {state.leads && state.leads.length > 0 ? (
                state.leads.slice(0, 10).map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-6 py-4 font-medium text-[#0F172A] whitespace-nowrap">{lead.name}</td>
                    <td className="px-6 py-4 text-[#1E293B] whitespace-nowrap">{lead.contact}</td>
                    <td className="px-6 py-4 text-[#475569]">{lead.task || lead.source}</td>
                    <td className="px-6 py-4 text-[#64748B] whitespace-nowrap">
                      {new Date(lead.date).toLocaleDateString('ru-RU')} в {new Date(lead.date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-[#94A3B8]">
                    Нет новых заявок
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-[#E2E8F0]">
          <a href="/admin/leads" className="block w-full text-center text-sm font-medium text-[#1B3F7A] hover:bg-[#EEF3FB] py-2 rounded-lg transition-colors">
            Показать все заявки
          </a>
        </div>
      </div>
    </div>
  );
}
