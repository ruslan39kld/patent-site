import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import { Service as ServiceInfo } from '../../types';
import { cn } from '../../lib/utils';
import { useToast } from './AdminLayout';

export default function ServicesAdmin() {
  const { state, updateState } = useData();
  const [services, setServices] = useState<ServiceInfo[]>(state.services);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const saveToState = (newServices: ServiceInfo[]) => {
    setServices(newServices);
    updateState({ ...state, services: newServices });
    toast('Изменения в услугах сохранены', 'success');
  };

  const addService = () => {
     const newId = `service-${Date.now()}`;
     const newService: ServiceInfo = {
        id: newId,
        title: 'Новая услуга',
        slug: `new-service-${Date.now()}`,
        shortDesc: '',
        fullDesc: '',
        situations: [],
        includes: [],
        price: { fee: '', duties: '', duration: '' }
     };
     setServices([...services, newService]);
     setEditingId(newId);
  };

  const deleteService = (id: string) => {
     setServices(services.filter(s => s.id !== id));
     if(editingId === id) setEditingId(null);
  };

  const updateArrayField = (serviceId: string, field: 'situations' | 'includes', index: number, value: string) => {
     setServices(services.map(s => {
        if(s.id === serviceId) {
           const newArr = [...s[field]];
           newArr[index] = value;
           return { ...s, [field]: newArr };
        }
        return s;
     }));
  };

  const addArrayItem = (serviceId: string, field: 'situations' | 'includes') => {
     setServices(services.map(s => {
        if(s.id === serviceId) {
           return { ...s, [field]: [...s[field], 'Новый пункт'] };
        }
        return s;
     }));
  };

  const removeArrayItem = (serviceId: string, field: 'situations' | 'includes', index: number) => {
     setServices(services.map(s => {
        if(s.id === serviceId) {
           return { ...s, [field]: s[field].filter((_, i) => i !== index) };
        }
        return s;
     }));
  };

  const currentService = services.find(s => s.id === editingId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0F172A]">Управление услугами</h1>
        <button 
          onClick={() => saveToState(services)}
          className="bg-[#1B3F7A] text-white px-6 py-2 rounded-lg flex items-center hover:bg-[#2960B0] font-medium transition-colors"
        >
          <Save className="w-5 h-5 mr-2" />
          Сохранить изменения
        </button>
      </div>

      {editingId && currentService ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
             <h2 className="text-xl font-bold">Редактирование: {currentService.title}</h2>
             <div className="flex gap-4">
               <button onClick={() => setEditingId(null)} className="text-[#64748B] hover:text-[#0F172A]">Вернуться к списку</button>
               <button onClick={() => deleteService(currentService.id)} className="text-red-500 hover:text-red-600 font-medium text-sm ml-4 border-l border-[#E2E8F0] pl-4">Удалить услугу</button>
             </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 mb-8">
            <div className="grid grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-bold mb-2">Название услуги</label>
                 <input value={currentService.title} onChange={(e) => {
                   const updated = services.map(s => s.id === editingId ? { ...s, title: e.target.value } : s);
                   setServices(updated);
                 }} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2" />
               </div>
               <div>
                 <label className="block text-sm font-bold mb-2">Слаг (URL)</label>
                 <input value={currentService.slug} onChange={(e) => {
                   const updated = services.map(s => s.id === editingId ? { ...s, slug: e.target.value } : s);
                   setServices(updated);
                 }} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2" />
               </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Краткое описание (для карточки)</label>
              <textarea value={currentService.shortDesc} onChange={(e) => {
                const updated = services.map(s => s.id === editingId ? { ...s, shortDesc: e.target.value } : s);
                setServices(updated);
              }} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2 h-20" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Детальное описание</label>
              <textarea value={currentService.fullDesc} onChange={(e) => {
                const updated = services.map(s => s.id === editingId ? { ...s, fullDesc: e.target.value } : s);
                setServices(updated);
              }} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2 h-32" />
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] border-[#E2E8F0]">
                  <div className="flex justify-between items-center mb-4">
                     <label className="block text-sm font-bold">С какими ситуациями приходят</label>
                     <button onClick={() => addArrayItem(currentService.id, 'situations')} className="text-[#0F172A] hover:text-secondary text-sm font-medium flex items-center"><Plus className="w-4 h-4" /> Добавить</button>
                  </div>
                  <div className="space-y-2">
                     {currentService.situations.map((sit, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                           <GripVertical className="text-[#64748B] w-5 h-5 flex-shrink-0 mt-2" />
                           <textarea value={sit} onChange={(e) => updateArrayField(currentService.id, 'situations', idx, e.target.value)} className="w-full border border-[#E2E8F0] rounded text-sm px-3 py-2 min-h-[60px]" />
                           <button onClick={() => removeArrayItem(currentService.id, 'situations', idx)} className="text-[#64748B] hover:text-red-500 mt-2"><Trash2 className="w-4 h-4"/></button>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] border-[#E2E8F0]">
                  <div className="flex justify-between items-center mb-4">
                     <label className="block text-sm font-bold">Что входит в услугу</label>
                     <button onClick={() => addArrayItem(currentService.id, 'includes')} className="text-[#0F172A] hover:text-secondary text-sm font-medium flex items-center"><Plus className="w-4 h-4" /> Добавить</button>
                  </div>
                  <div className="space-y-2">
                     {currentService.includes.map((inc, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                           <GripVertical className="text-[#64748B] w-5 h-5 flex-shrink-0 mt-2" />
                           <textarea value={inc} onChange={(e) => updateArrayField(currentService.id, 'includes', idx, e.target.value)} className="w-full border border-[#E2E8F0] rounded text-sm px-3 py-2 min-h-[60px]" />
                           <button onClick={() => removeArrayItem(currentService.id, 'includes', idx)} className="text-[#64748B] hover:text-red-500 mt-2"><Trash2 className="w-4 h-4"/></button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] border-[#E2E8F0]">
               <div>
                  <label className="block text-sm font-bold mb-2">Срок</label>
                  <input value={currentService.price.duration} onChange={(e) => {
                     const updated = services.map(s => s.id === editingId ? { ...s, price: { ...s.price, duration: e.target.value } } : s);
                     setServices(updated);
                  }} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm" />
               </div>
               <div>
                  <label className="block text-sm font-bold mb-2">Стоимость (гонорар)</label>
                  <input value={currentService.price.fee} onChange={(e) => {
                     const updated = services.map(s => s.id === editingId ? { ...s, price: { ...s.price, fee: e.target.value } } : s);
                     setServices(updated);
                  }} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm" />
               </div>
               <div>
                  <label className="block text-sm font-bold mb-2">Пошлины</label>
                  <input value={currentService.price.duties || ''} onChange={(e) => {
                     const updated = services.map(s => s.id === editingId ? { ...s, price: { ...s.price, duties: e.target.value } } : s);
                     setServices(updated);
                  }} className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2 text-sm" />
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-[#E2E8F0] overflow-hidden">
           <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center">
              <h2 className="font-bold text-[#0F172A]">Список услуг</h2>
              <button onClick={addService} className="bg-[#1B3F7A] text-white hover:bg-[#2960B0] font-medium flex items-center text-sm px-4 py-2 rounded-lg transition-colors">
                <Plus className="w-4 h-4 mr-1"/> Добавить услугу
              </button>
           </div>
          <table className="w-full text-left bg-white">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider w-12"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Название</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Слаг</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Срок</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Цена</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {services.map((svc, index) => (
                <tr key={svc.id} className={cn("hover:bg-[#F8FAFC] transition-colors", index % 2 === 1 ? "bg-[#FAFAFA]" : "bg-white")}>
                  <td className="px-6 py-4"><input type="checkbox" className="rounded border-[#E2E8F0]" /></td>
                  <td className="px-6 py-3 font-medium text-[#1E293B]">{svc.title}</td>
                  <td className="px-6 py-3 text-[#64748B] text-sm">{svc.slug}</td>
                  <td className="px-6 py-3 text-[#64748B] text-sm">{svc.price.duration}</td>
                  <td className="px-6 py-3 text-[#64748B] text-sm">{svc.price.fee}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D1FAE5] text-[#065F46]">
                      Активна
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button 
                      onClick={() => setEditingId(svc.id)}
                      className="text-[#2960B0] hover:text-[#1B3F7A] font-medium text-sm mr-4"
                    >
                      Редактировать
                    </button>
                    <button 
                      onClick={() => deleteService(svc.id)}
                      className="text-[#EF4444] hover:text-red-700 font-medium text-sm"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
