import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';
import { Service as ServiceInfo } from '../../types';

export default function ServicesAdmin() {
  const { state, updateState } = useData();
  const [services, setServices] = useState<ServiceInfo[]>(state.services);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  const saveToState = (newServices: ServiceInfo[]) => {
    setServices(newServices);
    updateState({ ...state, services: newServices });
    setSuccess('Услуги сохранены');
    setTimeout(() => setSuccess(''), 3000);
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
     if(window.confirm('Точно удалить услугу?')) {
        setServices(services.filter(s => s.id !== id));
        if(editingId === id) setEditingId(null);
     }
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
        <h1 className="text-2xl font-bold text-gray-900">Управление услугами</h1>
        <button 
          onClick={() => saveToState(services)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-secondary font-medium"
        >
          {success ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {success ? 'Сохранено' : 'Сохранить изменения'}
        </button>
      </div>

      {editingId && currentService ? (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
             <h2 className="text-xl font-bold">Редактирование: {currentService.title}</h2>
             <div className="flex gap-4">
               <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-primary">Вернуться к списку</button>
               <button onClick={() => deleteService(currentService.id)} className="text-red-500 hover:text-red-600 font-medium text-sm ml-4 border-l border-gray-200 pl-4">Удалить услугу</button>
             </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8 mb-8">
            <div className="grid grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-bold mb-2">Название услуги</label>
                 <input value={currentService.title} onChange={(e) => {
                   const updated = services.map(s => s.id === editingId ? { ...s, title: e.target.value } : s);
                   setServices(updated);
                 }} className="w-full border rounded-lg px-4 py-2" />
               </div>
               <div>
                 <label className="block text-sm font-bold mb-2">Слаг (URL)</label>
                 <input value={currentService.slug} onChange={(e) => {
                   const updated = services.map(s => s.id === editingId ? { ...s, slug: e.target.value } : s);
                   setServices(updated);
                 }} className="w-full border rounded-lg px-4 py-2" />
               </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Краткое описание (для карточки)</label>
              <textarea value={currentService.shortDesc} onChange={(e) => {
                const updated = services.map(s => s.id === editingId ? { ...s, shortDesc: e.target.value } : s);
                setServices(updated);
              }} className="w-full border rounded-lg px-4 py-2 h-20" />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Детальное описание</label>
              <textarea value={currentService.fullDesc} onChange={(e) => {
                const updated = services.map(s => s.id === editingId ? { ...s, fullDesc: e.target.value } : s);
                setServices(updated);
              }} className="w-full border rounded-lg px-4 py-2 h-32" />
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                     <label className="block text-sm font-bold">С какими ситуациями приходят</label>
                     <button onClick={() => addArrayItem(currentService.id, 'situations')} className="text-primary hover:text-secondary text-sm font-medium flex items-center"><Plus className="w-4 h-4" /> Добавить</button>
                  </div>
                  <div className="space-y-2">
                     {currentService.situations.map((sit, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                           <GripVertical className="text-gray-400 w-5 h-5 flex-shrink-0 mt-2" />
                           <textarea value={sit} onChange={(e) => updateArrayField(currentService.id, 'situations', idx, e.target.value)} className="w-full border rounded text-sm px-3 py-2 min-h-[60px]" />
                           <button onClick={() => removeArrayItem(currentService.id, 'situations', idx)} className="text-gray-400 hover:text-red-500 mt-2"><Trash2 className="w-4 h-4"/></button>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                     <label className="block text-sm font-bold">Что входит в услугу</label>
                     <button onClick={() => addArrayItem(currentService.id, 'includes')} className="text-primary hover:text-secondary text-sm font-medium flex items-center"><Plus className="w-4 h-4" /> Добавить</button>
                  </div>
                  <div className="space-y-2">
                     {currentService.includes.map((inc, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                           <GripVertical className="text-gray-400 w-5 h-5 flex-shrink-0 mt-2" />
                           <textarea value={inc} onChange={(e) => updateArrayField(currentService.id, 'includes', idx, e.target.value)} className="w-full border rounded text-sm px-3 py-2 min-h-[60px]" />
                           <button onClick={() => removeArrayItem(currentService.id, 'includes', idx)} className="text-gray-400 hover:text-red-500 mt-2"><Trash2 className="w-4 h-4"/></button>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
               <div>
                  <label className="block text-sm font-bold mb-2">Срок</label>
                  <input value={currentService.price.duration} onChange={(e) => {
                     const updated = services.map(s => s.id === editingId ? { ...s, price: { ...s.price, duration: e.target.value } } : s);
                     setServices(updated);
                  }} className="w-full border rounded-lg px-4 py-2 text-sm" />
               </div>
               <div>
                  <label className="block text-sm font-bold mb-2">Стоимость (гонорар)</label>
                  <input value={currentService.price.fee} onChange={(e) => {
                     const updated = services.map(s => s.id === editingId ? { ...s, price: { ...s.price, fee: e.target.value } } : s);
                     setServices(updated);
                  }} className="w-full border rounded-lg px-4 py-2 text-sm" />
               </div>
               <div>
                  <label className="block text-sm font-bold mb-2">Пошлины</label>
                  <input value={currentService.price.duties || ''} onChange={(e) => {
                     const updated = services.map(s => s.id === editingId ? { ...s, price: { ...s.price, duties: e.target.value } } : s);
                     setServices(updated);
                  }} className="w-full border rounded-lg px-4 py-2 text-sm" />
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
           <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h2 className="font-bold">Список услуг</h2>
              <button onClick={addService} className="text-primary hover:text-secondary font-medium flex items-center text-sm"><Plus className="w-4 h-4"/> Добавить услугу</button>
           </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Название</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Слаг</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Срок</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{svc.title}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{svc.slug}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{svc.price.duration}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingId(svc.id)}
                      className="text-primary hover:text-secondary font-medium mr-4"
                    >
                      Редактировать
                    </button>
                    <button 
                      onClick={() => deleteService(svc.id)}
                      className="text-gray-400 hover:text-red-500 font-medium"
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
