import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { ReviewItem } from '../../types';

export default function ReviewsAdmin() {
  const { state, updateState } = useData();
  const [reviews, setReviews] = useState<ReviewItem[]>(state.reviews || []);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    updateState({ ...state, reviews });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateReview = (id: string, key: string, value: any) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, [key]: value } : r));
  };

  const addReview = () => {
    const newId = `rev-${Date.now()}`;
    setReviews([...reviews, {
      id: newId,
      name: 'Имя клиента',
      company: '',
      service: 'Услуга',
      text: 'Отзыв...',
      date: new Date().toISOString().split('T')[0],
      published: true,
      onHome: true
    }]);
    setEditingId(newId);
  };

  const removeReview = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Отзывы клиентов</h1>
        <button
          onClick={handleSave}
          className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          {saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saved ? 'Сохранено' : 'Сохранить изменения'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:col-span-1 h-fit">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <h2 className="font-bold text-gray-900">Список отзывов</h2>
             <button onClick={addReview} className="p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20"><Plus className="w-4 h-4" /></button>
          </div>
          <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
             {reviews.map(r => (
               <div 
                  key={r.id} 
                  onClick={() => setEditingId(r.id)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${editingId === r.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
               >
                  <div className="font-medium text-sm text-gray-900 mb-1">{r.name}</div>
                  <div className="text-xs text-gray-500 flex justify-between">
                     <span className="truncate pr-2">{r.service}</span>
                     <span className={r.published ? 'text-green-600' : 'text-gray-400'}>{r.published ? 'Опубликовано' : 'Скрыто'}</span>
                  </div>
               </div>
             ))}
             {reviews.length === 0 && (
                <div className="p-8 text-center bg-gray-50">
                   <p className="text-gray-500 text-sm mb-4">Отзывы будут добавлены после согласования с клиентами.</p>
                </div>
             )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {editingId ? (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                   <h2 className="font-bold text-gray-900">Редактирование отзыва</h2>
                   <button onClick={() => removeReview(editingId)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center">
                     <Trash2 className="w-4 h-4 mr-1" /> Удалить
                   </button>
                </div>
                
                <div className="p-6 space-y-5">
                   {reviews.filter(r => r.id === editingId).map(r => (
                      <div key={r.id} className="space-y-4">
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Имя клиента</label>
                               <input 
                                  type="text" value={r.name} onChange={(e) => updateReview(r.id, 'name', e.target.value)}
                                  className="w-full border-gray-300 font-bold rounded-md shadow-sm focus:border-accent focus:ring-accent"
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Компания / Проект</label>
                               <input 
                                  type="text" value={r.company || ''} onChange={(e) => updateReview(r.id, 'company', e.target.value)}
                                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent"
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Услуга</label>
                               <input 
                                  type="text" value={r.service} onChange={(e) => updateReview(r.id, 'service', e.target.value)}
                                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                               />
                            </div>
                         </div>
                         
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Текст отзыва</label>
                            <textarea 
                               value={r.text} onChange={(e) => updateReview(r.id, 'text', e.target.value)}
                               rows={6} className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                            />
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Дата</label>
                               <input 
                                  type="date" value={r.date} onChange={(e) => updateReview(r.id, 'date', e.target.value)}
                                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                               />
                            </div>
                            <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Публикация</label>
                               <div className="flex flex-col gap-2 mt-2">
                                  <label className="flex items-center text-sm font-medium">
                                     <input 
                                        type="checkbox" checked={r.published} onChange={(e) => updateReview(r.id, 'published', e.target.checked)}
                                        className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded mr-2"
                                     />
                                     Опубликовано
                                  </label>
                                  <label className="flex items-center text-sm font-medium">
                                     <input 
                                        type="checkbox" checked={r.onHome} onChange={(e) => updateReview(r.id, 'onHome', e.target.checked)}
                                        className="h-4 w-4 text-accent focus:ring-accent border-gray-300 rounded mr-2"
                                     />
                                     Показывать на главной
                                  </label>
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          ) : (
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center p-12 h-64 text-gray-500">
                <p className="mb-4">Выберите отзыв слева или добавьте новый</p>
                <button onClick={addReview} className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center">
                  <Plus className="w-5 h-5 mr-2" /> Добавить отзыв
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
