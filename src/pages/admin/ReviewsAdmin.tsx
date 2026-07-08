import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, Plus, Trash2, Star, X } from 'lucide-react';
import { ReviewItem } from '../../types';
import ImageUploader from '../../components/ImageUploader';
import { useToast } from './AdminLayout';

export default function ReviewsAdmin() {
  const { state, updateState } = useData();
  const [reviews, setReviews] = useState<ReviewItem[]>(state.reviews || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSaveAll = () => {
    updateState({ ...state, reviews });
    toast('Изменения в отзывах сохранены', 'success');
  };

  const addReview = () => {
    const newId = `rev-${Date.now()}`;
    setReviews([{
      id: newId,
      name: 'Новый клиент',
      company: '',
      service: '',
      text: '',
      image: '',
      date: new Date().toISOString().split('T')[0],
      published: true,
      onHome: true,
      reviewType: 'text'
    }, ...reviews]);
    setEditingId(newId);
  };

  const removeReview = (id: string) => {
    const newReviews = reviews.filter(r => r.id !== id);
    setReviews(newReviews);
    updateState({ ...state, reviews: newReviews });
  };

  const closeEdit = () => {
    setEditingId(null);
  };

  const updateEditingReview = (key: string, value: any) => {
    setReviews(reviews.map(r => r.id === editingId ? { ...r, [key]: value } : r));
  };

  const editingReview = reviews.find(r => r.id === editingId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] font-bold text-[#0F172A]">Отзывы</h1>
        <div className="flex gap-3">
          <button
            onClick={addReview}
            className="border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-[#F8FAFC] px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <Plus className="w-4 h-4 mr-2" /> Добавить отзыв
          </button>
          <button
            onClick={handleSaveAll}
            className="bg-[#1B3F7A] hover:bg-[#2960B0] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          >
            <Save className="w-4 h-4 mr-2" />
            Сохранить изменения
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(r => (
          <div key={r.id} className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col hover:border-[#CBD5E1] transition-colors">
            <div className="p-6 flex-1">
              <div className="flex items-center gap-4 mb-4">
                {r.image ? (
                  <img src={r.image} alt={r.name} className="w-14 h-14 rounded-full object-cover shrink-0 border border-[#E2E8F0]" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#EEF3FB] text-[#1B3F7A] flex items-center justify-center font-bold text-lg shrink-0">
                    {r.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-bold text-[#0F172A] leading-tight">{r.name}</div>
                  <div className="text-[13px] text-[#64748B] mt-0.5 max-w-[160px] truncate">{r.company || r.service || 'Клиент'}</div>
                </div>
              </div>
              
              <div className="flex gap-1 mb-3">
                {[1,2,3,4,5].map(star => (
                   <Star key={star} className="w-4 h-4 fill-[#C8A028] text-[#C8A028]" />
                ))}
              </div>
              
              {r.reviewType === 'image' ? (
                 <div className="mb-4 h-20 w-full overflow-hidden rounded bg-gray-100 flex items-center justify-center text-sm text-gray-500 border border-gray-200">
                    {r.reviewImage ? (
                       <img src={r.reviewImage} className="w-full h-full object-cover opacity-50" />
                    ) : (
                       <span>[Отзыв-картинка]</span>
                    )}
                 </div>
              ) : (
                <p className="text-[14px] text-[#1E293B] line-clamp-3 mb-4 leading-relaxed">
                  {r.text || 'Нет текста отзыва...'}
                </p>
              )}
              
              <label className="flex items-center cursor-pointer mt-auto">
                <div className="relative">
                  <input type="checkbox" className="sr-only" checked={r.onHome} onChange={(e) => {
                    const next = reviews.map(rev => rev.id === r.id ? { ...rev, onHome: e.target.checked } : rev);
                    setReviews(next);
                  }} />
                  <div className={`block w-8 h-5 rounded-full transition-colors ${r.onHome ? 'bg-[#10B981]' : 'bg-[#CBD5E1]'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${r.onHome ? 'translate-x-3' : ''}`}></div>
                </div>
                <div className="ml-3 text-[13px] text-[#64748B] font-medium">На главной</div>
              </label>
            </div>
            
            <div className="grid grid-cols-2 border-t border-[#E2E8F0] bg-[#F8FAFC]">
              <button 
                onClick={() => setEditingId(r.id)}
                className="py-3 text-[13px] font-medium text-[#1B3F7A] hover:bg-[#EEF3FB] transition-colors border-r border-[#E2E8F0]"
              >
                Редактировать
              </button>
              <button 
                onClick={() => removeReview(r.id)}
                className="py-3 text-[13px] font-medium text-[#EF4444] hover:bg-red-50 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingId && editingReview && (
        <div className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
             className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col"
             style={{ animation: 'modalEnter 150ms ease-out forwards' }}
          >
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-white">
              <h2 className="text-[20px] font-bold text-[#0F172A]">Редактировать отзыв</h2>
              <button onClick={closeEdit} className="text-[#94A3B8] hover:text-[#0F172A] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh] bg-white space-y-6">
              <div className="flex gap-6 items-start">
                 <div className="w-1/3">
                    <label className="block text-sm font-medium text-[#0F172A] mb-2">Фото клиента</label>
                    <ImageUploader 
                      value={editingReview.image} 
                      onChange={(val) => updateEditingReview('image', val)}
                      shape="circle"
                      className="w-full"
                    />
                 </div>
                 <div className="w-2/3 space-y-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Имя</label>
                      <input 
                        type="text" value={editingReview.name} onChange={e => updateEditingReview('name', e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1B3F7A] focus:ring-[3px] focus:ring-[#1B3F7A]/10 transition-all font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Комп. / Должность</label>
                         <input 
                           type="text" value={editingReview.company || ''} onChange={e => updateEditingReview('company', e.target.value)}
                           className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1B3F7A] focus:ring-[3px] focus:ring-[#1B3F7A]/10 transition-all"
                         />
                       </div>
                       <div>
                         <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Связанная услуга</label>
                         <input 
                           type="text" value={editingReview.service || ''} onChange={e => updateEditingReview('service', e.target.value)}
                           className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1B3F7A] focus:ring-[3px] focus:ring-[#1B3F7A]/10 transition-all"
                         />
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Тип отзыва</label>
                   <select 
                     value={editingReview.reviewType || 'text'} 
                     onChange={e => updateEditingReview('reviewType', e.target.value)}
                     className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1B3F7A] focus:ring-[3px] focus:ring-[#1B3F7A]/10 transition-all font-medium"
                   >
                     <option value="text">Текстовый отзыв</option>
                     <option value="image">Отзыв-картинка (скриншот)</option>
                   </select>
                 </div>
              </div>

              {(editingReview.reviewType === 'image') ? (
                 <div>
                   <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Картинка отзыва (скриншот / скан)</label>
                   <ImageUploader 
                     value={editingReview.reviewImage || ''} 
                     onChange={(val) => updateEditingReview('reviewImage', val)}
                     shape="portrait"
                     className="w-full max-w-sm"
                   />
                 </div>
              ) : (
                 <div>
                    <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Текст отзыва</label>
                    <textarea 
                      rows={5}
                      value={editingReview.text} onChange={e => updateEditingReview('text', e.target.value)}
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1B3F7A] focus:ring-[3px] focus:ring-[#1B3F7A]/10 transition-all resize-none"
                    />
                 </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex justify-end gap-3">
               <button 
                 onClick={closeEdit} 
                 className="px-5 py-2 rounded-lg bg-[#F1F5F9] text-[#64748B] font-medium hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-colors text-sm"
               >
                 Отмена
               </button>
               <button 
                 onClick={() => {
                   handleSaveAll();
                   closeEdit();
                 }}
                 className="px-5 py-2 rounded-lg bg-[#1B3F7A] text-white font-medium hover:bg-[#2960B0] transition-colors text-sm"
               >
                 Сохранить
               </button>
            </div>
          </div>
          
          <style dangerouslySetInnerHTML={{__html:`
             @keyframes modalEnter {
                from { opacity: 0; transform: scale(0.97); }
                to { opacity: 1; transform: scale(1); }
             }
          `}} />
        </div>
      )}
    </div>
  );
}
