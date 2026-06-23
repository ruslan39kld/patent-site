const fs = require('fs');

const statusBadge = `getStatusBadge(lead.status)`;

let code = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf-8');

const replacement = `         <div className="overflow-x-auto">
          <table className="min-w-full text-left bg-white">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs uppercase text-[#64748B] font-bold tracking-wider">
              <tr>
                 <th className="px-6 py-4">Дата</th>
                 <th className="px-6 py-4">ФИО / Контакт</th>
                 <th className="px-6 py-4">Тип</th>
                 <th className="px-6 py-4">Коротко о задаче</th>
                 <th className="px-6 py-4">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {state.leads && state.leads.length > 0 ? (
                state.leads.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#F8FAFC] transition-colors">
                     <td className="px-6 py-4 text-[#64748B] whitespace-nowrap text-[13px]">
                        {\`\${new Date(lead.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })} в \${new Date(lead.date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}\`}
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-[#0F172A] text-sm">{lead.name || 'Аноним'}</div>
                        <div className="text-[13px] text-[#64748B] mt-0.5">{lead.contact}</div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        {lead.type ? (
                           <div className="text-[11px] text-[#1B3F7A] font-bold bg-[#EEF3FB] border border-[#3B82F6]/20 px-2 py-1 rounded inline-block uppercase tracking-wider">{lead.type}</div>
                        ) : (
                           <div className="text-[11px] text-[#CBD5E1] font-bold border border-[#CBD5E1] px-2 py-1 rounded inline-block uppercase tracking-wider">Консультация</div>
                        )}
                     </td>
                     <td className="px-6 py-4">
                        <div className="text-[13px] text-[#475569] line-clamp-2 max-w-sm">{lead.task || lead.source}</div>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        {lead.status === 'new' && <span className="bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide">НОВАЯ</span>}
                        {lead.status === 'in_progress' && <span className="bg-[#FEF3C7] text-[#D97706] px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide">В РАБОТЕ</span>}
                        {lead.status === 'processed' && <span className="bg-[#FEF3C7] text-[#D97706] px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide">В РАБОТЕ</span>}
                        {lead.status === 'closed' && <span className="bg-[#D1FAE5] text-[#059669] px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide">ЗАКРЫТО</span>}
                        {!lead.status && <span className="bg-[#EEF2FF] text-[#4F46E5] px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide">НОВАЯ</span>}
                     </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-[#94A3B8]">
                    Нет новых заявок
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>`;

code = code.replace(/<div className="overflow-x-auto">[\s\S]*?<\/table>[\s\S]*?<\/div>/, replacement);
fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', code);
