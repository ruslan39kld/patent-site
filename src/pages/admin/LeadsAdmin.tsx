import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Trash2, MessageSquare, X, ChevronRight, Paperclip, File, Upload, Download } from 'lucide-react';
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

  const addFile = (id: string) => {
     const input = document.createElement('input');
     input.type = 'file';
     input.multiple = true;
     input.onchange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
           const newFiles = Array.from(e.target.files).map((f: any) => ({
              name: f.name,
              size: f.size,
              type: f.type,
              url: URL.createObjectURL(f)
           }));
           
           updateState({
              ...state,
              leads: leads.map(l => {
                 if (l.id === id) {
                    return {
                       ...l,
                       files: [...(l.files || []), ...newFiles]
                    };
                 }
                 return l;
              })
           });
        }
     };
     input.click();
  };

  const removeFile = (leadId: string, fileIndex: number) => {
     updateState({
        ...state,
        leads: leads.map(l => {
           if (l.id === leadId) {
              const newFiles = [...(l.files || [])];
              newFiles.splice(fileIndex, 1);
              return { ...l, files: newFiles };
           }
           return l;
        })
     });
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
         <div className="bg-white border-t border-[#E2E8F0]">
            <div className="hidden md:block overflow-x-auto">
               <table className="w-full text-left bg-white">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                     <tr>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Дата</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">ФИО / Контакт</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Тип</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Коротко о задаче</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Статус</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Детали заявки</th>
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
                              {lead.date ? `${new Date(lead.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })} в ${new Date(lead.date).toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}` : 'Н/Д'}
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
                           <td className="px-6 py-4 text-right whitespace-nowrap">
                              <span className="inline-flex items-center justify-center bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-lg text-[12px] font-bold text-[#1B3F7A] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] transition-all shadow-sm group-hover:border-[#CBD5E1]">
                                 Детали <ChevronRight className="w-3.5 h-3.5 ml-0.5 opacity-70" />
                              </span>
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
                     <div className="text-[13px] text-[#0F172A] line-clamp-2 mb-3">{lead.task || lead.source}</div>
                     <div className="flex justify-end">
                        <span className="inline-flex items-center justify-center bg-white border border-[#E2E8F0] px-4 py-2 rounded-lg text-[13px] font-bold text-[#1B3F7A] shadow-sm">
                           Детали <ChevronRight className="w-4 h-4 ml-1 opacity-70" />
                        </span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
        )}
      </div>

      {/* Drawer */}
      {selectedLeadId && selectedLead && (
         <>
            {/* Backdrop */}
            <div 
               className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-sm z-40 transition-opacity" 
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
                     {selectedLead.type && (
                        <div>
                           <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Тип обращения</div>
                           <div className="text-[14px] text-[#1B3F7A] font-bold">{selectedLead.type}</div>
                        </div>
                     )}
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
                     <div>
                        <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">Источник</div>
                        <div className="text-[14px] text-[#64748B]">{selectedLead.source || 'Прямой заход'}</div>
                     </div>
                  </div>

                  {/* Task / Description */}
                  <div>
                     <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Суть обращения / Задача</label>
                     <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] p-4 text-[14px] text-[#1E293B] whitespace-pre-wrap leading-relaxed min-h-[100px]">
                        {selectedLead.task || 'Пустота...'}
                     </div>
                  </div>

                  {/* Files / Attachments */}
                  <div>
                     <div className="flex items-center justify-between mb-2">
                        <label className="block text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Файлы проекта</label>
                        <button 
                           onClick={() => addFile(selectedLead.id)}
                           className="text-[#1B3F7A] text-[12px] font-bold flex items-center gap-1 hover:text-[#2563EB] transition-colors"
                        >
                           <Paperclip className="w-3.5 h-3.5" /> Добавить
                        </button>
                     </div>
                     {selectedLead.files && selectedLead.files.length > 0 ? (
                        <div className="space-y-2">
                           {selectedLead.files.map((file, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-white border border-[#E2E8F0] rounded-[8px] p-3 shadow-sm group">
                                 <div className="flex flex-col">
                                    <a href={file.url} target="_blank" rel="noreferrer" className="text-[13px] font-bold text-[#1B3F7A] hover:underline flex items-center gap-1.5 line-clamp-1 max-w-[200px]">
                                       <File className="w-4 h-4 flex-shrink-0" /> {file.name}
                                    </a>
                                    {file.size && <span className="text-[11px] text-[#94A3B8] ml-5.5 mt-0.5">{(file.size / 1024).toFixed(1)} KB</span>}
                                 </div>
                                 <button onClick={() => removeFile(selectedLead.id, idx)} className="text-[#CBD5E1] hover:text-[#EF4444] transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="border border-dashed border-[#CBD5E1] rounded-[12px] p-6 flex flex-col items-center justify-center bg-[#F8FAFC]">
                           <Upload className="w-6 h-6 text-[#94A3B8] mb-2" />
                           <span className="text-[13px] text-[#64748B] text-center">Нет прикрепленных файлов</span>
                           <button onClick={() => addFile(selectedLead.id)} className="mt-2 text-[#1B3F7A] text-[12px] font-bold hover:underline">
                              Загрузить файл
                           </button>
                        </div>
                     )}
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
