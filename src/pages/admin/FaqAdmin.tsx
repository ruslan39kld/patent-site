import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, Plus, Trash2, CheckCircle2, GripVertical, X, Edit } from 'lucide-react';
import { WysiwygEditor } from '../../components/admin/WysiwygEditor';

export default function FaqAdmin() {
  const { state, updateState } = useData();
  const [faqs, setFaqs] = useState(state.faqItems || []);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentFaq, setCurrentFaq] = useState({ id: '', q: '', a: '', category: 'general', order: 0 });

  const handleSave = () => {
    updateState({ ...state, faqItems: faqs });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const openAddModal = () => {
    setCurrentFaq({
      id: `faq-${Date.now()}`,
      q: '',
      a: '',
      category: 'general',
      order: faqs.length + 1
    });
    setShowAddModal(true);
  };

  const openEditModal = (idx: number) => {
    setCurrentFaq({ ...faqs[idx] });
    setEditingId(faqs[idx].id);
  };

  const saveModal = () => {
    if (editingId) {
      setFaqs(faqs.map(f => f.id === editingId ? currentFaq : f));
      setEditingId(null);
    } else {
      setFaqs([...faqs, currentFaq]);
      setShowAddModal(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0F172A]">Управление FAQ</h1>
        <button
          onClick={handleSave}
          className="bg-[#1B3F7A] hover:bg-[#1B3F7A]/90 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm"
        >
          {saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saved ? 'Сохранено' : 'Сохранить изменения'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]/50">
          <h2 className="text-lg font-bold text-[#0F172A]">Вопросы и ответы</h2>
          <button onClick={openAddModal} className="text-white hover:bg-[#3B82F6]/90 font-medium flex items-center bg-[#3B82F6] px-4 py-2 rounded-md shadow-sm transition-colors">
            <Plus className="w-4 h-4 mr-1" /> Добавить вопрос
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={faq.id || idx} className="bg-white border border-[#E2E8F0] rounded-lg p-5 flex gap-4 items-center relative hover:shadow-md transition-shadow group">
                <div className="text-gray-300 cursor-move">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0 pr-16 border-r border-[#E2E8F0]">
                  <div className="font-bold text-[#1E293B] mb-1 truncate">{faq.q || 'Без вопроса'}</div>
                  <div className="text-sm text-[#64748B] flex gap-2 items-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-semibold">{faq.category}</span>
                    <span className="truncate max-w-[200px]" dangerouslySetInnerHTML={{ __html: faq.a.replace(/<[^>]*>?/gm, '') || 'Без ответа' }} />
                  </div>
                </div>
                
                <div className="flex gap-2 pl-4">
                  <button 
                    onClick={() => openEditModal(idx)}
                    className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => removeFaq(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Удалить вопрос"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {faqs.length === 0 && (
              <div className="text-center py-10 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] border-dashed">
                <p className="text-[#64748B]">Нет добавленных FAQ.</p>
                <button onClick={openAddModal} className="mt-4 text-[#3B82F6] font-bold hover:underline">
                  Добавить первый вопрос
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingId) && (
        <div className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]/50">
              <h2 className="text-lg font-bold text-[#0F172A]">{editingId ? 'Редактировать вопрос' : 'Новый вопрос'}</h2>
              <button onClick={closeModal} className="text-[#64748B] hover:text-[#0F172A] p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5 flex-1 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Вопрос</label>
                <input 
                  type="text" 
                  value={currentFaq.q} 
                  onChange={(e) => setCurrentFaq({ ...currentFaq, q: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all shadow-sm"
                  placeholder="Введите вопрос..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Категория</label>
                <select
                  value={currentFaq.category}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, category: e.target.value })}
                  className="w-full border border-[#E2E8F0] rounded-lg px-4 py-2.5 focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-all shadow-sm"
                >
                  <option value="general">Общие</option>
                  <option value="trademarks">Товарные знаки</option>
                  <option value="patents">Патенты</option>
                  <option value="copyright">Авторское право</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0F172A] mb-2">Ответ</label>
                <WysiwygEditor 
                  value={currentFaq.a} 
                  onChange={(val) => setCurrentFaq({ ...currentFaq, a: val })}
                  rows={4}
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]/50 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-5 py-2.5 text-[#64748B] font-medium hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-[#E2E8F0]"
              >
                Отмена
              </button>
              <button 
                onClick={saveModal}
                className="px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
