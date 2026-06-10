import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, Plus, Trash2, CheckCircle2, GripVertical } from 'lucide-react';

export default function FaqAdmin() {
  const { state, updateState } = useData();
  const [faqs, setFaqs] = useState(state.faqItems || []);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateState({ ...state, faqItems: faqs });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateFaq = (index: number, key: string, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [key]: value };
    setFaqs(newFaqs);
  };

  const addFaq = () => {
    const newId = `faq-${Date.now()}`;
    setFaqs([...faqs, {
      id: newId,
      q: 'Новый вопрос',
      a: 'Новый ответ',
      category: 'general',
      order: faqs.length + 1
    }]);
  };

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Управление FAQ</h1>
        <button
          onClick={handleSave}
          className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          {saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saved ? 'Сохранено' : 'Сохранить изменения'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Вопросы и ответы</h2>
          <button onClick={addFaq} className="text-primary hover:text-secondary font-medium flex items-center bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm">
            <Plus className="w-4 h-4 mr-1" /> Добавить вопрос
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border focus-within:ring-1 focus-within:ring-accent rounded-lg p-5 flex gap-4 items-start relative hover:shadow-md transition-shadow">
                <div className="mt-2 text-gray-300 cursor-move">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 space-y-4 pr-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Вопрос</label>
                        <input 
                           type="text" 
                           value={faq.q || ''} 
                           onChange={(e) => updateFaq(idx, 'q', e.target.value)}
                           className="w-full font-medium border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Категория</label>
                        <select
                           value={faq.category || 'general'}
                           onChange={(e) => updateFaq(idx, 'category', e.target.value)}
                           className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                        >
                           <option value="general">Общие</option>
                           <option value="trademarks">Товарные знаки</option>
                           <option value="patents">Патенты</option>
                           <option value="copyright">Авторское право</option>
                        </select>
                     </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Ответ</label>
                    <textarea 
                      value={faq.a || ''} 
                      onChange={(e) => updateFaq(idx, 'a', e.target.value)}
                      rows={3}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm resize-none"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={() => removeFaq(idx)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                  title="Удалить вопрос"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {faqs.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Нет добавленных FAQ.</p>
                <button onClick={addFaq} className="mt-4 text-primary font-bold hover:underline">
                  Добавить первый вопрос
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
