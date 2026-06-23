import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/LeadsAdmin.tsx', 'utf-8');

const replacement = `         <div className="bg-white border-t border-[#E2E8F0]">
            <div className="hidden md:block overflow-x-auto">
               <table className="w-full text-left bg-white">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                     <tr>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Дата</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">ФИО / Контакт</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Тип</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Коротко о задаче</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Статус</th>
                        <th className="px-4 py-4 w-10"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                     {filteredLeads.map((lead, index) => (
                        <tr 
                           key={lead.id} 
                           onClick={() => setSelectedLeadId(lead.id)}
                           className={cn(
                              "group cursor-pointer transition-colors", 
                              index % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white",
                              selectedLeadId === lead.id ? "bg-[#EEF3FB] border-l-2 border-[#1B3F7A]" : "hover:bg-[#F8FAFC]"
                           )}
                        >
                           <td className="px-6 py-4 whitespace-nowrap text-[13px] text-[#64748B]">
                              {lead.date ? \`\${new Date(lead.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })} в \${new Date(lead.date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}\` : 'Н/Д'}
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
                              <div className="text-[13px] text-[#0F172A] line-clamp-2 max-w-xs">{lead.task || lead.source}</div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(lead.status)}
                           </td>
                           <td className="px-4 py-4 text-right whitespace-nowrap">
                              <ChevronRight className="w-5 h-5 text-[#CBD5E1] group-hover:text-[#1B3F7A] transition-colors" />
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>

            {/* Mobile Lead Cards */}
            <div className="md:hidden divide-y divide-[#E2E8F0]">
               {filteredLeads.map((lead) => (
                  <div 
                     key={lead.id}
                     onClick={() => setSelectedLeadId(lead.id)}
                     className={cn(
                        "p-4 cursor-pointer hover:bg-[#F8FAFC] transition-colors",
                        selectedLeadId === lead.id && "bg-[#EEF3FB] border-l-2 border-[#1B3F7A]"
                     )}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <div className="font-bold text-[#0F172A] text-sm">{lead.name || 'Аноним'}</div>
                           <div className="text-[13px] text-[#64748B]">{lead.contact}</div>
                        </div>
                        {getStatusBadge(lead.status)}
                     </div>
                     <div className="flex gap-2 items-center mb-2 flex-wrap">
                        {lead.type ? (
                           <span className="text-[10px] text-[#1B3F7A] font-bold bg-[#EEF3FB] border border-[#3B82F6]/20 px-2 py-0.5 rounded uppercase tracking-wider">{lead.type}</span>
                        ) : (
                           <span className="text-[10px] text-[#CBD5E1] font-bold border border-[#CBD5E1] px-2 py-0.5 rounded uppercase tracking-wider">Консультация</span>
                        )}
                        <span className="text-[11px] text-[#64748B]">{lead.date ? new Date(lead.date).toLocaleDateString('ru-RU') : ''}</span>
                     </div>
                     <div className="text-[13px] text-[#0F172A] line-clamp-2">{lead.task || lead.source}</div>
                  </div>
               ))}
            </div>
         </div>`;

code = code.replace(/<div className="overflow-x-auto">[\s\S]*?<\/table>\s*<\/div>/, replacement);
fs.writeFileSync('src/pages/admin/LeadsAdmin.tsx', code);
