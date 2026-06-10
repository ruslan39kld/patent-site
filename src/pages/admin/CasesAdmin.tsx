import { useState, useEffect } from 'react';
import { useData } from '../../store/DataContext';
import { Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { CaseItem as Case } from '../../types';

export default function CasesAdmin() {
  const { state, updateState } = useData();
  const [cases, setCases] = useState<Case[]>(state.cases || []);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(cases.length > 0 ? cases[0].id : null);

  useEffect(() => {
    if (!editingId && cases.length > 0) {
      setEditingId(cases[0].id);
    }
  }, [cases, editingId]);

  const handleSave = () => {
    updateState({ ...state, cases });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateCase = (id: string, key: keyof Case, value: any) => {
    setCases(cases.map(c => c.id === id ? { ...c, [key]: value } : c));
  };

  const addCase = () => {
    const newId = `new-${Date.now()}`;
    setCases([...cases, {
      id: newId,
      title: 'Новый кейс',
      category: 'Защита бренда',
      serviceId: 'tm',
      situation: 'Ситуация клиента...',
      task: 'Задача...',
      solution: 'Решение...',
      result: 'Результат...',
      anonymous: false
    }]);
    setEditingId(newId);
  };

  const removeCase = (id: string) => {
    setCases(cases.filter(c => c.id !== id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Управление кейсами</h1>
        <button
          onClick={handleSave}
          className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          {saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saved ? 'Сохранено' : 'Сохранить изменения'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-1">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <h2 className="font-bold text-gray-900">Список кейсов</h2>
             <button onClick={addCase} className="p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
             {cases.map(c => (
               <div 
                  key={c.id} 
                  onClick={() => setEditingId(c.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${editingId === c.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
               >
                  <div className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{c.title}</div>
                  <div className="text-xs text-gray-500 uppercase flex items-center justify-between">
                     <span>{c.serviceId || c.serviceType || 'Без категории'}</span>
                     {c.anonymous && <span className="bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">Анонимно</span>}
                  </div>
               </div>
             ))}
             {cases.length === 0 && <div className="p-8 text-center text-gray-500 text-sm">Нет кейсов</div>}
          </div>
        </div>

        <div className="lg:col-span-2">
          {editingId ? (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <h2 className="font-bold text-gray-900">Редактирование кейса</h2>
                   <button onClick={() => removeCase(editingId)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center">
                     <Trash2 className="w-4 h-4 mr-1" /> Удалить
                   </button>
                </div>
                
                <div className="p-6 space-y-5">
                   {cases.filter(c => c.id === editingId).map(c => (
                      <div key={c.id} className="space-y-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Заголовок (Ситуация)</label>
                            <input 
                               type="text" value={c.title} onChange={(e) => updateCase(c.id, 'title', e.target.value)}
                               className="w-full border-gray-300 font-bold rounded-md shadow-sm focus:border-accent focus:ring-accent"
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Категория</label>
                               <input 
                                  type="text" value={c.category} onChange={(e) => updateCase(c.id, 'category', e.target.value)}
                                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                                  placeholder="Например: Защита бренда"
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Тип услуги</label>
                               <select 
                                  value={c.serviceId || 'Товарные знаки'} onChange={(e) => updateCase(c.id, 'serviceId', e.target.value)}
                                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                               >
                                  <option value="tm">Товарные знаки</option>
                                  <option value="copyright">Авторские права</option>
                                  <option value="invention">Патенты</option>
                                  <option value="software">IT и ПО</option>
                                  <option value="defense">Защита в суде</option>
                                  <option value="international">Международная регистрация</option>
                                  <option value="design">Промышленные образцы</option>
                               </select>
                            </div>
                         </div>
                         
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ситуация клиента</label>
                            <textarea 
                               value={c.situation || ''} onChange={(e) => updateCase(c.id, 'situation', e.target.value)}
                               rows={3} className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Задача</label>
                            <textarea 
                               value={c.task || ''} onChange={(e) => updateCase(c.id, 'task', e.target.value)}
                               rows={2} className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Что было сделано (Решение)</label>
                            <textarea 
                               value={c.solution} onChange={(e) => updateCase(c.id, 'solution', e.target.value)}
                               rows={3} className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Результат</label>
                            <textarea 
                               value={c.result} onChange={(e) => updateCase(c.id, 'result', e.target.value)}
                               rows={3} className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            />
                         </div>
                         
                         <div className="pt-4 border-t border-gray-100 flex items-center">
                            <input 
                               type="checkbox" 
                               id="anon"
                               checked={c.anonymous} 
                               onChange={(e) => updateCase(c.id, 'anonymous', e.target.checked)}
                               className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded"
                            />
                            <label htmlFor="anon" className="ml-2 block text-sm text-gray-900 font-medium">
                               Анонимный кейс (скрыть детали)
                            </label>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          ) : (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-12 h-64 text-gray-400">
                Выберите кейс слева или добавьте новый
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
