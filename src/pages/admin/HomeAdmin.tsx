import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, CheckCircle2, ChevronDown, ChevronRight, Plus, Trash2, GripVertical, FileImage } from 'lucide-react';

export default function HomeAdmin() {
  const { state, updateState } = useData();
  const [content, setContent] = useState(state.content);
  const [success, setSuccess] = useState('');
  const [openTab, setOpenTab] = useState('hero');

  const save = () => {
    updateState({ ...state, content });
    setSuccess('Главная страница сохранена');
    setTimeout(() => setSuccess(''), 3000);
  };

  const tabs = [
    { id: 'hero', label: '1. Hero-блок' },
    { id: 'badges', label: '2. Экспертные бейджи' },
    { id: 'cards', label: '3. Карточки задач' },
    { id: 'risks', label: '4. Блок рисков' },
    { id: 'process', label: '5. Процесс работы' },
    { id: 'cta', label: '6. Финальный CTA' },
  ];

  const updateContent = (key: string, value: any) => {
    setContent({ ...content, [key]: value });
  };
  
  const updateArrayItem = (arrayKey: string, index: number, field: string, value: any) => {
    const newArr = [...(content[arrayKey] || [])];
    newArr[index] = { ...newArr[index], [field]: value };
    updateContent(arrayKey, newArr);
  };
  
  const removeArrayItem = (arrayKey: string, index: number) => {
    const newArr = [...(content[arrayKey] || [])];
    newArr.splice(index, 1);
    updateContent(arrayKey, newArr);
  };
  
  const addArrayItem = (arrayKey: string, defaultItem: any) => {
    const newArr = [...(content[arrayKey] || []), defaultItem];
    updateContent(arrayKey, newArr);
  };

  const moveItem = (arrayKey: string, index: number, direction: number) => {
    const newArr = [...(content[arrayKey] || [])];
    if (index + direction < 0 || index + direction >= newArr.length) return;
    const temp = newArr[index];
    newArr[index] = newArr[index + direction];
    newArr[index + direction] = temp;
    updateContent(arrayKey, newArr);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Главная страница</h1>
        <button 
          onClick={save}
          className="bg-primary text-white px-6 py-2 rounded-lg flex items-center hover:bg-secondary font-medium transition-colors"
        >
          {success ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {success ? 'Сохранено' : 'Сохранить изменения'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
           {tabs.map(tab => (
              <button 
                 key={tab.id}
                 onClick={() => setOpenTab(tab.id)}
                 className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-colors ${openTab === tab.id ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-100'}`}
              >
                 {tab.label}
              </button>
           ))}
        </div>

        <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
           {openTab === 'hero' && (
              <div className="space-y-6">
                 <h2 className="text-xl font-bold border-b pb-4">Настройки Hero-блока</h2>
                 
                 <div className="flex items-center space-x-2 pb-2">
                    <input type="checkbox" id="hero-active" checked={content.heroActive !== false} onChange={e => updateContent('heroActive', e.target.checked)} className="rounded text-primary focus:ring-primary w-4 h-4" />
                    <label htmlFor="hero-active" className="text-sm font-medium text-gray-700">Включить блок</label>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Заголовок H1</label>
                   <input 
                     value={content.heroTitle || ''} 
                     onChange={(e) => updateContent('heroTitle', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent font-medium text-lg" 
                   />
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Подзаголовок</label>
                   <textarea 
                     value={content.heroSubtitle || ''} 
                     onChange={(e) => updateContent('heroSubtitle', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent resize-none h-24" 
                   />
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Статусная строка</label>
                   <input 
                     value={content.heroStatus || ''} 
                     onChange={(e) => updateContent('heroStatus', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent" 
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Текст основной кнопки</label>
                       <input value="Защитить проект" className="w-full border-gray-300 rounded-md shadow-sm text-sm" readOnly />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ссылка основной кнопки</label>
                       <input value="#services" className="w-full border-gray-300 rounded-md shadow-sm text-sm" readOnly />
                    </div>
                 </div>
              </div>
           )}

           {openTab === 'badges' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">Экспертные бейджи</h2>
                    <button onClick={() => addArrayItem('badges', { title: 'Новый', desc: 'Бейдж...', active: true })} className="text-sm bg-primary/10 text-primary font-bold px-3 py-1.5 rounded flex items-center hover:bg-primary/20 transition-colors">
                       <Plus className="w-4 h-4 mr-1" /> Добавить бейдж
                    </button>
                 </div>
                 
                 <div className="space-y-3">
                    {(content.badges || []).map((badge: any, i: number) => (
                       <div key={i} className="flex gap-4 items-center bg-gray-50 border p-3 rounded-lg">
                          <div className="flex flex-col gap-1">
                             <button onClick={() => moveItem('badges', i, -1)} className="text-gray-400 hover:text-gray-700">▲</button>
                             <button onClick={() => moveItem('badges', i, 1)} className="text-gray-400 hover:text-gray-700">▼</button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 flex-1">
                             <input type="text" value={badge.title} onChange={e => updateArrayItem('badges', i, 'title', e.target.value)} className="text-sm border-gray-300 rounded shadow-sm font-bold" />
                             <input type="text" value={badge.desc} onChange={e => updateArrayItem('badges', i, 'desc', e.target.value)} className="text-sm border-gray-300 rounded shadow-sm" />
                          </div>
                          <div className="flex items-center gap-2">
                             <input type="checkbox" checked={badge.active !== false} onChange={e => updateArrayItem('badges', i, 'active', e.target.checked)} className="rounded text-primary focus:ring-primary w-4 h-4" />
                             <button onClick={() => removeArrayItem('badges', i)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 className="w-4 h-4"/></button>
                          </div>
                       </div>
                    ))}
                    {(!content.badges || content.badges.length === 0) && (
                       <div className="text-center py-8 text-gray-400 border border-dashed rounded-lg">Нет бейджей</div>
                    )}
                 </div>
              </div>
           )}

           {openTab === 'cards' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">С какой задачей вы пришли?</h2>
                    <button onClick={() => addArrayItem('cards', { title: 'Новая задача', desc: '', service: '', link: '', active: true })} className="text-sm bg-primary/10 text-primary font-bold px-3 py-1.5 rounded flex items-center hover:bg-primary/20 transition-colors">
                       <Plus className="w-4 h-4 mr-1" /> Добавить карточку
                    </button>
                 </div>
                 <div className="space-y-4">
                    {(content.cards || []).map((card: any, i: number) => (
                       <div key={i} className="flex gap-4 items-start bg-gray-50 border p-4 rounded-lg relative">
                          <div className="flex flex-col gap-1 mt-2">
                             <button onClick={() => moveItem('cards', i, -1)} className="text-gray-400 hover:text-gray-700">▲</button>
                             <button onClick={() => moveItem('cards', i, 1)} className="text-gray-400 hover:text-gray-700">▼</button>
                          </div>
                          <div className="flex-1 space-y-3">
                             <input type="text" value={card.title} onChange={e => updateArrayItem('cards', i, 'title', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm font-bold" placeholder="Название карточки" />
                             <textarea value={card.desc} onChange={e => updateArrayItem('cards', i, 'desc', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm" placeholder="Описание" rows={2}></textarea>
                             <div className="grid grid-cols-2 gap-4">
                                <input type="text" value={card.service} onChange={e => updateArrayItem('cards', i, 'service', e.target.value)} className="text-sm border-gray-300 rounded shadow-sm" placeholder="Связанная услуга" />
                                <input type="text" value={card.link} onChange={e => updateArrayItem('cards', i, 'link', e.target.value)} className="text-sm border-gray-300 rounded shadow-sm" placeholder="Ссылка (например: /services/tm)" />
                             </div>
                             <div className="flex items-center gap-2 pt-2 text-sm text-gray-600">
                                <input type="checkbox" checked={card.active !== false} onChange={e => updateArrayItem('cards', i, 'active', e.target.checked)} className="rounded text-primary focus:ring-primary w-4 h-4" />
                                Показывать карточку
                             </div>
                          </div>
                          <button onClick={() => removeArrayItem('cards', i)} className="text-gray-400 hover:text-red-500 absolute top-4 right-4"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    ))}
                    {(!content.cards || content.cards.length === 0) && (
                       <div className="text-center py-8 text-gray-400 border border-dashed rounded-lg">Карточки не добавлены</div>
                    )}
                 </div>
              </div>
           )}

           {openTab === 'risks' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">Блок рисков</h2>
                    <button onClick={() => addArrayItem('risks', { title: 'Новый риск', desc: '', active: true })} className="text-sm bg-primary/10 text-primary font-bold px-3 py-1.5 rounded flex items-center hover:bg-primary/20 transition-colors">
                       <Plus className="w-4 h-4 mr-1" /> Добавить риск
                    </button>
                 </div>
                 <div className="space-y-4">
                    {(content.risks || []).map((risk: any, i: number) => (
                       <div key={i} className="flex gap-4 items-start bg-gray-50 border p-4 rounded-lg relative">
                          <div className="flex flex-col gap-1 mt-2">
                             <button onClick={() => moveItem('risks', i, -1)} className="text-gray-400 hover:text-gray-700">▲</button>
                             <button onClick={() => moveItem('risks', i, 1)} className="text-gray-400 hover:text-gray-700">▼</button>
                          </div>
                          <div className="flex-1 space-y-3">
                             <input type="text" value={risk.title} onChange={e => updateArrayItem('risks', i, 'title', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm font-bold" placeholder="Название риска" />
                             <textarea value={risk.desc} onChange={e => updateArrayItem('risks', i, 'desc', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm" placeholder="Описание" rows={2}></textarea>
                             <div className="flex items-center gap-2 pt-2 text-sm text-gray-600">
                                <input type="checkbox" checked={risk.active !== false} onChange={e => updateArrayItem('risks', i, 'active', e.target.checked)} className="rounded text-primary focus:ring-primary w-4 h-4" />
                                Показывать
                             </div>
                          </div>
                          <button onClick={() => removeArrayItem('risks', i)} className="text-gray-400 hover:text-red-500 absolute top-4 right-4"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    ))}
                    {(!content.risks || content.risks.length === 0) && (
                       <div className="text-center py-8 text-gray-400 border border-dashed rounded-lg">Риски не добавлены</div>
                    )}
                 </div>
              </div>
            )}
           {openTab === 'process' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">Процесс работы</h2>
                    <button onClick={() => addArrayItem('process', { title: 'Новый этап', desc: '', active: true })} className="text-sm bg-primary/10 text-primary font-bold px-3 py-1.5 rounded flex items-center hover:bg-primary/20 transition-colors">
                       <Plus className="w-4 h-4 mr-1" /> Добавить этап
                    </button>
                 </div>
                 <div className="space-y-4">
                    {(content.process || []).map((step: any, i: number) => (
                       <div key={i} className="flex gap-4 items-start bg-gray-50 border p-4 rounded-lg relative">
                          <div className="flex flex-col gap-1 mt-2">
                             <button onClick={() => moveItem('process', i, -1)} className="text-gray-400 hover:text-gray-700">▲</button>
                             <button onClick={() => moveItem('process', i, 1)} className="text-gray-400 hover:text-gray-700">▼</button>
                          </div>
                          <div className="font-bold text-gray-300 text-2xl pt-2 w-8 text-center">{i + 1}</div>
                          <div className="flex-1 space-y-3">
                             <input type="text" value={step.title} onChange={e => updateArrayItem('process', i, 'title', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm font-bold" placeholder="Название этапа" />
                             <textarea value={step.desc} onChange={e => updateArrayItem('process', i, 'desc', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm" placeholder="Описание этапа" rows={2}></textarea>
                          </div>
                          <button onClick={() => removeArrayItem('process', i)} className="text-gray-400 hover:text-red-500 absolute top-4 right-4"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    ))}
                    {(!content.process || content.process.length === 0) && (
                       <div className="text-center py-8 text-gray-400 border border-dashed rounded-lg">Этапы не добавлены</div>
                    )}
                 </div>
              </div>
            )}
           {openTab === 'cta' && (
              <div className="space-y-6">
                 <h2 className="text-xl font-bold border-b pb-4">Финальный CTA</h2>
                 
                 <div className="flex items-center space-x-2 pb-2">
                    <input type="checkbox" id="cta-active" checked={content.ctaActive !== false} onChange={e => updateContent('ctaActive', e.target.checked)} className="rounded text-primary focus:ring-primary w-4 h-4" />
                    <label htmlFor="cta-active" className="text-sm font-medium text-gray-700">Показывать блок</label>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Заголовок CTA</label>
                   <input 
                     value={content.ctaTitle || 'Готовы защитить свой бизнес?'} 
                     onChange={(e) => updateContent('ctaTitle', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm text-sm font-bold" 
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Описание CTA</label>
                   <textarea 
                     value={content.ctaDesc || 'Оставьте заявку, и мы свяжемся с вами в течение 15 минут...'} 
                     onChange={(e) => updateContent('ctaDesc', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm text-sm h-24" 
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Текст кнопки</label>
                      <input 
                        value={content.ctaButton || 'Связаться с патентным поверенным'} 
                        onChange={(e) => updateContent('ctaButton', e.target.value)} 
                        className="w-full border-gray-300 rounded-md shadow-sm text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ссылка кнопки</label>
                      <input 
                        value={content.ctaLink || '#contacts'} 
                        onChange={(e) => updateContent('ctaLink', e.target.value)} 
                        className="w-full border-gray-300 rounded-md shadow-sm text-sm" 
                      />
                    </div>
                 </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
