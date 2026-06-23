import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, Plus, Trash2, X } from 'lucide-react';
import { CaseItem as Case } from '../../types';
import { WysiwygEditor } from '../../components/admin/WysiwygEditor';

export default function CasesAdmin() {
  const { state, updateState } = useData();
  const [cases, setCases] = useState<Case[]>(state.cases || []);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSaveAll = () => {
    updateState({ ...state, cases });
    alert('Изменения в кейсах сохранены');
  };

  const addCase = () => {
    const newId = `new-${Date.now()}`;
    setCases([{
      id: newId,
      title: 'Новый кейс',
      category: 'Защита бренда',
      serviceId: 'tm',
      situation: '',
      task: '',
      solution: '',
      result: '',
      anonymous: false,
      date: new Date().toISOString().split('T')[0],
      image: '',
      shortDesc: ''
    }, ...cases]);
    setEditingId(newId);
  };

  const removeCase = (id: string) => {
    setCases(cases.filter(c => c.id !== id));
  };

  const closeEdit = () => {
    setEditingId(null);
  };

  const updateEditingCase = (key: string, value: any) => {
    setCases(cases.map(c => c.id === editingId ? { ...c, [key]: value } : c));
  };

  const editingCase = cases.find(c => c.id === editingId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Управление кейсами</h1>
          <p className="text-[#64748B] mt-1">Основа находится на странице "Все кейсы и результаты"</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addCase}
            className="border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-[#F8FAFC] px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Добавить кейс
          </button>
          <button
            onClick={handleSaveAll}
            className="bg-[#1B3F7A] hover:bg-[#1B3F7A]/90 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
          >
            <Save className="w-5 h-5 mr-2" />
            Сохранить изменения
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.map((c) => (
              <div key={c.id} className="bg-white border border-[#E2E8F0] rounded-lg p-5 flex flex-col gap-4 relative hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-[#EEF2FF] text-[#1B3F7A] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {c.category}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setEditingId(c.id)}
                      className="text-xs font-medium text-[#1B3F7A] hover:underline"
                    >
                      Редактировать
                    </button>
                    <button 
                      onClick={() => removeCase(c.id)}
                      className="text-xs font-medium text-red-500 hover:underline"
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Заголовок</label>
                  <p className="font-bold text-[15px] sm:text-[16px] text-[#0F172A] leading-snug">
                    {c.title}
                  </p>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Задача</label>
                    <p className="text-[13px] sm:text-[14px] text-[#1E293B] bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md whitespace-pre-wrap">
                      {c.task}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {cases.length === 0 && (
              <div className="col-span-full text-center py-10 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] border-dashed">
                <p className="text-[#64748B]">Кейсы отсутствуют.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingId && editingCase && (
        <div className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
             className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]"
             style={{ animation: 'modalEnter 150ms ease-out forwards' }}
          >
             <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-white shrink-0">
               <h2 className="text-[20px] font-bold text-[#0F172A]">Редактировать кейс</h2>
               <button onClick={closeEdit} className="text-[#94A3B8] hover:text-[#0F172A] transition-colors">
                 <X className="w-5 h-5" />
               </button>
             </div>
             
             <div className="p-6 overflow-y-auto bg-white flex-1 space-y-6">
                <div>
                   <label className="block text-[13px] font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider">Заголовок</label>
                   <input 
                     type="text" value={editingCase.title} onChange={e => updateEditingCase('title', e.target.value)}
                     className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[15px] font-medium text-[#1E293B] focus:outline-none focus:border-[#1B3F7A] focus:ring-[3px] focus:ring-[#1B3F7A]/10 transition-all placeholder:text-[#94A3B8]"
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-[13px] font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider">Категория (тег)</label>
                     <input 
                       type="text" value={editingCase.category} onChange={e => updateEditingCase('category', e.target.value)}
                       className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1B3F7A]"
                     />
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <label className="block text-[13px] font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider">Ситуация (контекст)</label>
                      <WysiwygEditor value={editingCase.situation || ''} onChange={val => updateEditingCase('situation', val)} rows={5} />
                   </div>

                   <div>
                      <label className="block text-[13px] font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider">Задача клиента</label>
                      <WysiwygEditor value={editingCase.task} onChange={val => updateEditingCase('task', val)} rows={5} />
                   </div>

                   <div>
                     <label className="block text-[13px] font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider">Что было сделано (решение)</label>
                     <WysiwygEditor value={editingCase.solution} onChange={val => updateEditingCase('solution', val)} rows={5} />
                   </div>

                   <div>
                      <label className="block text-[13px] font-bold text-[#0F172A] mb-1.5 uppercase tracking-wider">Результат</label>
                      <WysiwygEditor value={editingCase.result} onChange={val => updateEditingCase('result', val)} rows={5} />
                   </div>
                </div>

             </div>

             <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-3 shrink-0">
               <button 
                 onClick={closeEdit} 
                 className="px-6 py-2.5 rounded-lg bg-[#F1F5F9] text-[#64748B] font-bold hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-colors text-[13px] tracking-wide"
               >
                 ОТМЕНА / ГОТОВО
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
