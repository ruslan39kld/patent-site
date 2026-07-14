import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, Plus, Trash2, X } from 'lucide-react';
import { ReviewItem } from '../../types';
import ImageUploader from '../../components/ImageUploader';
import DocxUploader from '../../components/DocxUploader';
import ReviewCard from '../../components/ReviewCard';
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
            {/* Same card component the live site renders, so this preview never drifts from what visitors actually see. */}
            <ReviewCard review={r} className="!rounded-none !border-none !shadow-none !p-6 flex-1" />

            <div className="px-6 pb-4">
              <label className="flex items-center cursor-pointer">
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
                    <label className="block text-sm font-medium text-[#0F172A] mb-2">
                      Фото клиента
                    </label>
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
              
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[13px] font-medium text-[#0F172A]">Текст отзыва</label>
                  <DocxUploader onInsertText={(text) => updateEditingReview('text', text)} />
                </div>
                <textarea
                  rows={5}
                  value={editingReview.text} onChange={e => updateEditingReview('text', e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:border-[#1B3F7A] focus:ring-[3px] focus:ring-[#1B3F7A]/10 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">
                  Скан/фото отзыва (необязательно, дополнительно к тексту)
                </label>
                <ImageUploader
                  value={editingReview.reviewImage || ''}
                  onChange={(val) => updateEditingReview('reviewImage', val)}
                  shape="document"
                  className="w-full max-w-sm"
                />
              </div>
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
