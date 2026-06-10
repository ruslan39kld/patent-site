import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, Plus, Trash2, CheckCircle2, LayoutTemplate } from 'lucide-react';
import { CustomBlock } from '../../types';

export default function BuilderAdmin() {
  const { state, updateState } = useData();
  const [blocks, setBlocks] = useState<CustomBlock[]>(state.customBlocks || []);
  
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSave = () => {
    updateState({ ...state, customBlocks: blocks });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateBlock = (id: string, key: keyof CustomBlock, value: any) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [key]: value } : b));
  };

  const addBlock = (type: string) => {
    const newId = `block-${Date.now()}`;
    setBlocks([...blocks, { id: newId, type, title: 'Новый блок', subtitle: '', text: '', buttonText: '', buttonLink: '', active: true }]);
    setEditingId(newId);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Конструктор страниц</h1>
        <button
          onClick={handleSave}
          className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          {saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saved ? 'Сохранено' : 'Сохранить изменения'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h2 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Добавить блок</h2>
              <div className="space-y-2">
                 <button onClick={() => addBlock('text')} className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-primary/5 hover:text-primary rounded-md border border-gray-200 transition-colors">+ Текстовый блок</button>
                 <button onClick={() => addBlock('cards')} className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-primary/5 hover:text-primary rounded-md border border-gray-200 transition-colors">+ Блок карточек</button>
                 <button onClick={() => addBlock('cta')} className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-primary/5 hover:text-primary rounded-md border border-gray-200 transition-colors">+ CTA-блок</button>
                 <button onClick={() => addBlock('faq')} className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-primary/5 hover:text-primary rounded-md border border-gray-200 transition-colors">+ FAQ-блок</button>
                 <button onClick={() => addBlock('image')} className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-primary/5 hover:text-primary rounded-md border border-gray-200 transition-colors">+ Блок с изображением</button>
                 <button onClick={() => addBlock('advantages')} className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-primary/5 hover:text-primary rounded-md border border-gray-200 transition-colors">+ Блок преимуществ</button>
              </div>
           </div>
        </div>

        <div className="lg:col-span-3">
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
              {blocks.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-16 text-gray-400 h-full">
                    <LayoutTemplate className="w-16 h-16 mb-4 text-gray-200" />
                    <p className="font-medium text-gray-500">Страница пока пуста</p>
                    <p className="text-sm">Выберите блок слева, чтобы начать конструирование.</p>
                 </div>
              ) : (
                 <div className="p-4 space-y-4">
                    {blocks.map(b => (
                       <div key={b.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50 relative hover:shadow-md transition-shadow">
                          <button onClick={() => setBlocks(blocks.filter(x => x.id !== b.id))} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 className="w-5 h-5"/></button>
                          
                          <div className="grid grid-cols-2 gap-4 max-w-lg mb-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Название блока (Тип: {b.type})</label>
                                <input type="text" className="w-full border-gray-300 rounded text-sm" value={b.title} onChange={e => updateBlock(b.id, 'title', e.target.value)} />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Статус</label>
                                <select className="w-full border-gray-300 rounded text-sm" value={b.active ? 'Опубликован' : 'Скрыт'} onChange={e => updateBlock(b.id, 'active', e.target.value === 'Опубликован')}>
                                   <option value="Опубликован">Опубликован</option>
                                   <option value="Скрыт">Скрыт</option>
                                </select>
                             </div>
                          </div>
                          
                          {/* Expanded fields based on type */}
                          {editingId === b.id && (
                             <div className="pt-4 border-t border-gray-200 grid grid-cols-1 gap-4">
                                <div>
                                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Подзаголовок / Доп инфо</label>
                                   <input type="text" className="w-full border-gray-300 rounded text-sm" value={b.subtitle || ''} onChange={e => updateBlock(b.id, 'subtitle', e.target.value)} />
                                </div>
                                <div>
                                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Основной текст</label>
                                   <textarea rows={3} className="w-full border-gray-300 rounded text-sm" value={b.text || ''} onChange={e => updateBlock(b.id, 'text', e.target.value)}></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                   <div>
                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Текст кнопки (если есть)</label>
                                      <input type="text" className="w-full border-gray-300 rounded text-sm" value={b.buttonText || ''} onChange={e => updateBlock(b.id, 'buttonText', e.target.value)} />
                                   </div>
                                   <div>
                                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ссылка кнопки</label>
                                      <input type="text" className="w-full border-gray-300 rounded text-sm" value={b.buttonLink || ''} onChange={e => updateBlock(b.id, 'buttonLink', e.target.value)} />
                                   </div>
                                </div>
                             </div>
                          )}
                          
                          <button onClick={() => setEditingId(editingId === b.id ? null : b.id)} className="text-primary text-sm font-medium mt-2 focus:outline-none">
                             {editingId === b.id ? 'Свернуть расширенные настройки' : 'Редактировать параметры блока'}
                          </button>
                       </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
