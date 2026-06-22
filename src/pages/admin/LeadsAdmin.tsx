import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Trash2, MessageSquare, X, ChevronRight } from 'lucide-react';
import { Lead } from '../../types';
import { cn } from '../../lib/utils';

export default function LeadsAdmin() {
  const { state, updateState } = useData();
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'in_progress' | 'closed'>('all');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const leads = state.leads || [];

  const handleStatusChange = (id: string, status: 'new' | 'in_progress' | 'processed' | 'closed') => {
    updateState({ ...state, leads: leads.map(l => l.id === id ? { ...l, status } : l) });
  };

  const removeLead = (id: string) => {
     updateState({ ...state, leads: leads.filter(l => l.id !== id) });
     if(selectedLeadId === id) setSelectedLeadId(null);
  };

  const saveComment = (id: string, text: string) => {
     updateState({ ...state, leads: leads.map(l => l.id === id ? { ...l, comment: text } : l) });
  };

  const filteredLeads = leads.filter(l => {
     if (activeTab === 'all') return true;
     if (activeTab === 'new') return l.status === 'new';
     if (activeTab === 'in_progress') return l.status === 'in_progress' || l.status === 'processed';
     if (activeTab === 'closed') return l.status === 'closed';
     return true;
  });

  const getStatusBadge = (status: string) => {
      switch(status) {
         case 'new': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EEF2FF] text-[#4F46E5]">Новая</span>;
         case 'in_progress': 
         case 'processed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FEF3C7] text-[#D97706]">В работе</span>;
         case 'closed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D1FAE5] text-[#059669]">Закрыто</span>;
         default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
      }
  };

  const tabs = [
    { id: 'all', label: 'Все заявки' },
    { id: 'new', label: 'Новые' },
    { id: 'in_progress', label: 'В работе' },
    { id: 'closed', label: 'Закрыты' },
  ] as const;

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-[28px] font-bold text-[#0F172A]">Лиды и Заявки</h1>
           <p className="text-[#64748B] text-sm mt-1">Управление входящими обращениями клиентов</p>
        </div>
      </div>

      <div className="bg-white rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#E2E8F0] overflow-hidden">
        <div className="border-b border-[#E2E8F0] px-4">
           <nav className="-mb-px flex space-x-8" aria-label="Tabs">
             {tabs.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={cn(
                   "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                   activeTab === tab.id
                     ? "border-[#1B3F7A] text-[#1B3F7A]"
                     : "border-transparent text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]"
                 )}
               >
                 {tab.label}
                 <span className={cn(
                    "ml-2 py-0.5 px-2.5 rounded-full text-xs",
                    activeTab === tab.id ? "bg-[#EEF3FB] text-[#1B3F7A]" : "bg-[#F1F5F9] text-[#64748B]"
                 )}>
                    {tab.id === 'all' ? leads.length : leads.filter(l => {
                       if (tab.id === 'new') return l.status === 'new';
                       if (tab.id === 'in_progress') return l.status === 'in_progress' || l.status === 'processed';
                       if (tab.id === 'closed') return l.status === 'closed';
                       return false;
                    }).length}
                 </span>
               </button>
             ))}
           </nav>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="p-16 text-center text-[#64748B]">
            <MessageSquare className="w-12 h-12 text-[#CBD5E1] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">В этой категории нет заявок</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left bg-white">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                   <tr>
                      <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Дата</th>
                      <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Клиент</th>
                      <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Источник</th>
                      <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Статус</th>
                      <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider w-10"></th>
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
                            {lead.date ? new Date(lead.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', hour:'2-digit', minute:'2-digit' }) : 'Н/Д'}
                         </td>
                         <td className="px-6 py-4">
                            <div className="font-bold text-[#0F172A] text-sm">{lead.name || 'Аноним'}</div>
                            <div className="text-[13px] text-[#64748B] mt-0.5">{lead.contact}</div>
                         </td>
                         <td className="px-6 py-4">
                            <div className="text-[13px] text-[#0F172A] font-medium">{lead.source || 'Прямой заход'}</div>
                         </td>
                         <td className="px-6 py-4">
                            {getStatusBadge(lead.status)}
                         </td>
                         <td className="px-4 py-4 text-right">
                            <ChevronRight className="w-5 h-5 text-[#CBD5E1] group-hover:text-[#1B3F7A] transition-colors" />
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedLeadId && selectedLead && (
         <>
            {/* Backdrop */}
            <div 
               className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-[2px] z-40 transition-opacity" 
               onClick={() => setSelectedLeadId(null)}
            />
            {/* Slide-over panel */}
            <div 
               className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E2E8F0]"
               style={{ animation: 'slideInRight 200ms ease-out forwards' }}
            >
               <div className="px-6 py-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                  <h2 className="text-[18px] font-bold text-[#0F172A]">Детали заявки</h2>
                  <button onClick={() => setSelectedLeadId(null)} className="text-[#94A3B8] hover:text-[#0F172A] transition-colors bg-white rounded-full p-1 border border-[#E2E8F0]">
                     <X className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Status Control */}
                  <div>
                     <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Статус лида</label>
                     <div className="grid grid-cols-3 gap-2">
                        <button 
                           onClick={() => handleStatusChange(selectedLead.id, 'new')}
                           className={cn("py-2 px-3 text-sm font-medium rounded-lg border transition-colors", selectedLead.status === 'new' ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]" : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]")}
                        >Новая</button>
                        <button 
                           onClick={() => handleStatusChange(selectedLead.id, 'in_progress')}
                           className={cn("py-2 px-3 text-sm font-medium rounded-lg border transition-colors", selectedLead.status === 'in_progress' || selectedLead.status === 'processed' ? "border-[#D97706] bg-[#FEF3C7] text-[#D97706]" : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]")}
                        >В работе</button>
                        <button 
                           onClick={() => handleStatusChange(selectedLead.id, 'closed')}
                           className={cn("py-2 px-3 text-sm font-medium rounded-lg border transition-colors", selectedLead.status === 'closed' ? "border-[#059669] bg-[#D1FAE5] text-[#059669]" : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]")}
                        >Закрыто</button>
                     </div>
                  </div>

                  {/* Client Info */}
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-5 space-y-4">
                     <div>
                        <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Имя клиента</div>
                        <div className="text-[15px] font-bold text-[#0F172A]">{selectedLead.name || 'Не указано'}</div>
                     </div>
                     <div>
                        <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Контактные данные</div>
                        <div className="text-[14px] text-[#1E293B] bg-white border border-[#E2E8F0] px-3 py-2 rounded-lg">{selectedLead.contact || 'Не указано'}</div>
                     </div>
                     <div>
                        <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Дата обращения</div>
                        <div className="text-[14px] text-[#1E293B]">{selectedLead.date ? new Date(selectedLead.date).toLocaleString('ru-RU') : 'Н/Д'}</div>
                     </div>
                  </div>

                  {/* Task / Description */}
                  <div>
                     <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Суть обращения / Задача</label>
                     <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-4 text-[14px] text-[#1E293B] whitespace-pre-wrap leading-relaxed min-h-[100px]">
                        {selectedLead.task || 'Пустота...'}
                     </div>
                  </div>

                  {/* Comments Notes */}
                  <div>
                     <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Рабочие заметки (для себя)</label>
                     <textarea 
                        value={selectedLead.comment || ''}
                        onChange={(e) => saveComment(selectedLead.id, e.target.value)}
                        placeholder="О чем договорились? Какие следующие шаги?"
                        rows={5}
                        className="w-full bg-[#fcfcfc] border border-[#E2E8F0] rounded-[12px] p-4 text-[14px] text-[#1E293B] focus:outline-none focus:border-[#1B3F7A] focus:ring-[3px] focus:ring-[#1B3F7A]/10 transition-all resize-none"
                     ></textarea>
                  </div>
               </div>
               
               <div className="px-6 py-5 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                  <button 
                     onClick={() => removeLead(selectedLead.id)}
                     className="w-full py-3 rounded-lg border border-[#EF4444] text-[#EF4444] font-bold hover:bg-red-50 transition-colors flex justify-center items-center gap-2"
                  >
                     <Trash2 className="w-4 h-4" /> Удалить заявку
                  </button>
               </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html:`
               @keyframes slideInRight {
                  from { transform: translateX(100%); }
                  to { transform: translateX(0); }
               }
            `}} />
         </>
      )}
    </div>
  );
}
