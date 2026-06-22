import { useState } from 'react';
import { useData } from '../../store/DataContext';
import ImageUploader from '../../components/ImageUploader';
import { Save, ChevronDown, ChevronRight, Plus, Trash2, GripVertical, FileImage } from 'lucide-react';
import { useToast } from './AdminLayout';
import BuilderAdmin from './BuilderAdmin';

export default function HomeAdmin() {
  const { state, updateState } = useData();
  const [content, setContent] = useState(state.content);
  const [openTab, setOpenTab] = useState('hero');
  const { toast } = useToast();

  const save = () => {
    updateState({ ...state, content });
    toast('Главная страница сохранена', 'success');
  };

  const tabs = [
    { id: 'hero', label: '1. Hero-блок' },
    { id: 'badges', label: '2. Экспертные бейджи' },
    { id: 'cards', label: '3. Карточки задач' },
    { id: 'risks', label: '4. Блок рисков' },
    { id: 'process', label: '5. Процесс работы' },
    { id: 'certificates', label: '6. Сертификаты' },
    { id: 'patents', label: '7. Патенты' },
    { id: 'quiz', label: 'Подбор решения (Квиз)' },
    { id: 'builder', label: 'Доп. блоки (Конструктор)' },
    { id: 'cta', label: '8. Финальный CTA' },
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
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-[#E2E8F0] border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0F172A]">Главная страница</h1>
        <button 
          onClick={save}
          className="bg-[#1B3F7A] text-white px-6 py-2 rounded-lg flex items-center hover:bg-[#2960B0] font-medium transition-colors"
        >
          <Save className="w-5 h-5 mr-2" />
          Сохранить изменения
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
           {tabs.map(tab => (
              <button 
                 key={tab.id}
                 onClick={() => setOpenTab(tab.id)}
                 className={`w-full text-left px-4 py-3 rounded-lg text-sm font-bold transition-colors ${openTab === tab.id ? 'bg-[#1B3F7A] text-white shadow-md' : 'bg-white text-[#1E293B] hover:bg-[#F8FAFC] border border-[#E2E8F0] border-[#E2E8F0]'}`}
              >
                 {tab.label}
              </button>
           ))}
        </div>

        <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-[#E2E8F0] border-[#E2E8F0] p-6 min-h-[500px]">
           {openTab === 'hero' && (
              <div className="space-y-6">
                 <h2 className="text-xl font-bold border-b pb-4">Настройки Hero-блока</h2>
                 
                 <div className="flex items-center space-x-2 pb-2">
                    <input type="checkbox" id="hero-active" checked={content.heroActive !== false} onChange={e => updateContent('heroActive', e.target.checked)} className="rounded text-[#0F172A] focus:ring-[#1B3F7A] w-4 h-4" />
                    <label htmlFor="hero-active" className="text-sm font-medium text-[#1E293B]">Включить блок</label>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Заголовок H1</label>
                   <input 
                     value={content.heroTitle || ''} 
                     onChange={(e) => updateContent('heroTitle', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] font-medium text-lg" 
                   />
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Подзаголовок</label>
                   <textarea 
                     value={content.heroSubtitle || ''} 
                     onChange={(e) => updateContent('heroSubtitle', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] resize-none h-24" 
                   />
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Статусная строка</label>
                   <input 
                     value={content.heroStatus || ''} 
                     onChange={(e) => updateContent('heroStatus', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A]" 
                   />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Текст основной кнопки</label>
                       <input value="Защитить проект" className="w-full border-gray-300 rounded-md shadow-sm text-sm" readOnly />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Ссылка основной кнопки</label>
                       <input value="#services" className="w-full border-gray-300 rounded-md shadow-sm text-sm" readOnly />
                    </div>
                 </div>

                 <div>
                   <div className="flex justify-between items-end mb-2">
                     <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">Изображение эксперта в Hero-блоке</label>
                     <span className="text-xs text-[#64748B]">Рекомендуемый размер: 800 × 1000 px</span>
                   </div>
                   <ImageUploader 
                     value={content.heroImage || ''} 
                     onChange={(base64) => updateContent('heroImage', base64)} 
                     className="w-full max-w-sm" 
                     shape="portrait" 
                   />
                 </div>
              </div>
           )}

           {openTab === 'badges' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">Экспертные бейджи</h2>
                    <button onClick={() => addArrayItem('badges', { title: 'Новый', desc: 'Бейдж...', active: true })} className="text-sm bg-[#1B3F7A]/10 text-[#0F172A] font-bold px-3 py-1.5 rounded flex items-center hover:bg-[#1B3F7A]/20 transition-colors">
                       <Plus className="w-4 h-4 mr-1" /> Добавить бейдж
                    </button>
                 </div>
                 
                 <div className="space-y-3">
                    {(content.badges || []).map((badge: any, i: number) => (
                       <div key={i} className="flex gap-4 items-center bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-lg">
                          <div className="flex flex-col gap-1">
                             <button onClick={() => moveItem('badges', i, -1)} className="text-[#64748B] hover:text-[#1E293B]">▲</button>
                             <button onClick={() => moveItem('badges', i, 1)} className="text-[#64748B] hover:text-[#1E293B]">▼</button>
                          </div>
                          <div className="grid grid-cols-2 gap-4 flex-1">
                             <input type="text" value={badge.title} onChange={e => updateArrayItem('badges', i, 'title', e.target.value)} className="text-sm border-gray-300 rounded shadow-sm font-bold" />
                             <input type="text" value={badge.desc} onChange={e => updateArrayItem('badges', i, 'desc', e.target.value)} className="text-sm border-gray-300 rounded shadow-sm" />
                          </div>
                          <div className="flex items-center gap-2">
                             <input type="checkbox" checked={badge.active !== false} onChange={e => updateArrayItem('badges', i, 'active', e.target.checked)} className="rounded text-[#0F172A] focus:ring-[#1B3F7A] w-4 h-4" />
                             <button onClick={() => removeArrayItem('badges', i)} className="text-[#64748B] hover:text-red-500 p-1"><Trash2 className="w-4 h-4"/></button>
                          </div>
                       </div>
                    ))}
                    {(!content.badges || content.badges.length === 0) && (
                       <div className="text-center py-8 text-[#64748B] border border-[#E2E8F0] border-dashed rounded-lg">Нет бейджей</div>
                    )}
                 </div>
              </div>
           )}

           {openTab === 'cards' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">С какой задачей вы пришли?</h2>
                    <button onClick={() => addArrayItem('cards', { title: 'Новая задача', desc: '', linkTitle: '', linkHref: '', active: true })} className="text-sm bg-[#1B3F7A]/10 text-[#0F172A] font-bold px-3 py-1.5 rounded flex items-center hover:bg-[#1B3F7A]/20 transition-colors">
                       <Plus className="w-4 h-4 mr-1" /> Добавить карточку
                    </button>
                 </div>
                 <div className="space-y-4">
                    {(content.cards || []).map((card: any, i: number) => (
                       <div key={i} className="flex gap-4 items-start bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg relative">
                          <div className="flex flex-col gap-1 mt-2">
                             <button onClick={() => moveItem('cards', i, -1)} className="text-[#64748B] hover:text-[#1E293B]">▲</button>
                             <button onClick={() => moveItem('cards', i, 1)} className="text-[#64748B] hover:text-[#1E293B]">▼</button>
                          </div>
                          <div className="flex-1 space-y-3">
                             <input type="text" value={card.title} onChange={e => updateArrayItem('cards', i, 'title', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm font-bold" placeholder="Название карточки" />
                             <textarea value={card.desc} onChange={e => updateArrayItem('cards', i, 'desc', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm" placeholder="Описание" rows={2}></textarea>
                             <div className="grid grid-cols-2 gap-4">
                                <input type="text" value={card.linkTitle || card.service} onChange={e => updateArrayItem('cards', i, 'linkTitle', e.target.value)} className="text-sm border-gray-300 rounded shadow-sm" placeholder="Связанная услуга" />
                                <input type="text" value={card.linkHref || card.link} onChange={e => updateArrayItem('cards', i, 'linkHref', e.target.value)} className="text-sm border-gray-300 rounded shadow-sm" placeholder="Ссылка (например: /services/tm)" />
                             </div>
                             <div className="flex items-center gap-2 pt-2 text-sm text-[#64748B]">
                                <input type="checkbox" checked={card.active !== false} onChange={e => updateArrayItem('cards', i, 'active', e.target.checked)} className="rounded text-[#0F172A] focus:ring-[#1B3F7A] w-4 h-4" />
                                Показывать карточку
                             </div>
                          </div>
                          <button onClick={() => removeArrayItem('cards', i)} className="text-[#64748B] hover:text-red-500 absolute top-4 right-4"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    ))}
                    {(!content.cards || content.cards.length === 0) && (
                       <div className="text-center py-8 text-[#64748B] border border-[#E2E8F0] border-dashed rounded-lg">Карточки не добавлены</div>
                    )}
                 </div>
              </div>
           )}

           {openTab === 'risks' && (
              <div className="space-y-6">
                 <div>
                   <div className="flex justify-between items-end mb-2">
                     <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">Изображение для блока рисков</label>
                     <span className="text-xs text-[#64748B]">Рекомендуемый размер: 800 × 600 px</span>
                   </div>
                   <ImageUploader 
                     value={content.risksImage || ''} 
                     onChange={(base64) => updateContent('risksImage', base64)} 
                     className="w-full max-w-sm" 
                     shape="landscape" 
                   />
                 </div>
                 <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">Блок рисков</h2>
                    <button onClick={() => addArrayItem('risks', { title: 'Новый риск', desc: '', active: true })} className="text-sm bg-[#1B3F7A]/10 text-[#0F172A] font-bold px-3 py-1.5 rounded flex items-center hover:bg-[#1B3F7A]/20 transition-colors">
                       <Plus className="w-4 h-4 mr-1" /> Добавить риск
                    </button>
                 </div>
                 <div className="space-y-4">
                    {(content.risks || []).map((risk: any, i: number) => (
                       <div key={i} className="flex gap-4 items-start bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg relative">
                          <div className="flex flex-col gap-1 mt-2">
                             <button onClick={() => moveItem('risks', i, -1)} className="text-[#64748B] hover:text-[#1E293B]">▲</button>
                             <button onClick={() => moveItem('risks', i, 1)} className="text-[#64748B] hover:text-[#1E293B]">▼</button>
                          </div>
                          <div className="flex-1 space-y-3">
                             <input type="text" value={risk.title} onChange={e => updateArrayItem('risks', i, 'title', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm font-bold" placeholder="Название риска" />
                             <textarea value={risk.desc} onChange={e => updateArrayItem('risks', i, 'desc', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm" placeholder="Описание" rows={2}></textarea>
                             <div className="flex items-center gap-2 pt-2 text-sm text-[#64748B]">
                                <input type="checkbox" checked={risk.active !== false} onChange={e => updateArrayItem('risks', i, 'active', e.target.checked)} className="rounded text-[#0F172A] focus:ring-[#1B3F7A] w-4 h-4" />
                                Показывать
                             </div>
                          </div>
                          <button onClick={() => removeArrayItem('risks', i)} className="text-[#64748B] hover:text-red-500 absolute top-4 right-4"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    ))}
                    {(!content.risks || content.risks.length === 0) && (
                       <div className="text-center py-8 text-[#64748B] border border-[#E2E8F0] border-dashed rounded-lg">Риски не добавлены</div>
                    )}
                 </div>
              </div>
            )}
           {openTab === 'process' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">Процесс работы</h2>
                    <button onClick={() => addArrayItem('process', { title: 'Новый этап', desc: '', active: true })} className="text-sm bg-[#1B3F7A]/10 text-[#0F172A] font-bold px-3 py-1.5 rounded flex items-center hover:bg-[#1B3F7A]/20 transition-colors">
                       <Plus className="w-4 h-4 mr-1" /> Добавить этап
                    </button>
                 </div>
                 <div className="space-y-4">
                    {(content.process || []).map((step: any, i: number) => (
                       <div key={i} className="flex gap-4 items-start bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg relative">
                          <div className="flex flex-col gap-1 mt-2">
                             <button onClick={() => moveItem('process', i, -1)} className="text-[#64748B] hover:text-[#1E293B]">▲</button>
                             <button onClick={() => moveItem('process', i, 1)} className="text-[#64748B] hover:text-[#1E293B]">▼</button>
                          </div>
                          <div className="font-bold text-gray-300 text-2xl pt-2 w-8 text-center">{i + 1}</div>
                          <div className="flex-1 space-y-3">
                             <input type="text" value={step.title} onChange={e => updateArrayItem('process', i, 'title', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm font-bold" placeholder="Название этапа" />
                             <div>
                               <div className="flex justify-between items-end mb-1">
                                 <span className="text-xs font-bold text-[#64748B] uppercase">Иллюстрация этапа</span>
                                 <span className="text-xs text-[#64748B]">Рекомендуемый размер: 300 × 200 px</span>
                               </div>
                               <ImageUploader 
                                 value={step.image || ''} 
                                 onChange={(base64) => updateArrayItem('process', i, 'image', base64)} 
                                 className="w-48"
                                 shape="landscape_3_2" 
                               />
                             </div>
                             <textarea value={step.desc} onChange={e => updateArrayItem('process', i, 'desc', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm" placeholder="Описание этапа" rows={2}></textarea>
                          </div>
                          <button onClick={() => removeArrayItem('process', i)} className="text-[#64748B] hover:text-red-500 absolute top-4 right-4"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    ))}
                    {(!content.process || content.process.length === 0) && (
                       <div className="text-center py-8 text-[#64748B] border border-[#E2E8F0] border-dashed rounded-lg">Этапы не добавлены</div>
                    )}
                 </div>
              </div>
            )}
           {openTab === 'about' && (
              <div className="space-y-6">
                 <h2 className="text-xl font-bold border-b pb-4">Настройки "Об эксперте"</h2>
                 
                 <div>
                   <div className="flex justify-between items-end mb-2">
                     <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider">Основное изображение эксперта</label>
                     <span className="text-xs text-[#64748B]">Рекомендуемый размер: 800 × 1000 px</span>
                   </div>
                   <ImageUploader 
                     value={content.aboutImage || ''} 
                     onChange={(base64) => updateContent('aboutImage', base64)} 
                     className="w-full max-w-sm" 
                     shape="portrait" 
                   />
                 </div>
                 
                 <div>
                   <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Заголовок H2</label>
                   <input 
                     value={content.aboutTitle || 'Защищаю то, на чём строится ваш бизнес'} 
                     onChange={(e) => updateContent('aboutTitle', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] text-sm" 
                   />
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Основной текст</label>
                   <textarea 
                     value={content.aboutText || 'Виктория Тарасова помогает предпринимателям защитить то, на чём строится их бизнес: название, бренд, продукт, дизайн, технологии и права на созданные разработки.'} 
                     onChange={(e) => updateContent('aboutText', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] text-sm h-24 resize-none" 
                   />
                 </div>

                 <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="font-bold">Карточки преимуществ</h3>
                       <button onClick={() => addArrayItem('aboutCards', { title: 'Новое преимущество', desc: '', active: true })} className="text-sm bg-[#1B3F7A]/10 text-[#0F172A] font-bold px-3 py-1.5 rounded flex items-center hover:bg-[#1B3F7A]/20 transition-colors">
                          <Plus className="w-4 h-4 mr-1" /> Добавить
                       </button>
                    </div>
                    <div className="space-y-4">
                       {(content.aboutCards || [
                         { title: 'Официальный статус', desc: 'Действующий патентный поверенный РФ (рег. №1558). Несу ответственность за результат.' },
                         { title: 'Бизнес-подход', desc: 'Подбираю инструменты защиты, которые сохранят долю рынка и защитят от судов.' },
                         { title: 'Опыт защиты', desc: 'Широкая практика в палате по спорам и судах по интеллектуальным правам.' },
                         { title: 'Конфиденциальность', desc: 'Строгое соблюдение коммерческой тайны и безопасное обращение с данными.' }
                       ]).map((card: any, i: number) => (
                          <div key={i} className="flex gap-4 items-start bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg relative">
                             <div className="flex flex-col gap-1 mt-2">
                                <button onClick={() => moveItem('aboutCards', i, -1)} className="text-[#64748B] hover:text-[#1E293B]">▲</button>
                                <button onClick={() => moveItem('aboutCards', i, 1)} className="text-[#64748B] hover:text-[#1E293B]">▼</button>
                             </div>
                             <div className="flex-1 space-y-3">
                                <input type="text" value={card.title} onChange={e => updateArrayItem('aboutCards', i, 'title', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm font-bold" placeholder="Заголовок карточки" />
                                <textarea value={card.desc} onChange={e => updateArrayItem('aboutCards', i, 'desc', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm" placeholder="Описание" rows={2}></textarea>
                                <div className="flex items-center gap-2 pt-2 text-sm text-[#64748B]">
                                   <input type="checkbox" checked={card.active !== false} onChange={e => updateArrayItem('aboutCards', i, 'active', e.target.checked)} className="rounded text-[#0F172A] focus:ring-[#1B3F7A] w-4 h-4" />
                                   Показывать
                                </div>
                             </div>
                             <button onClick={() => removeArrayItem('aboutCards', i)} className="text-[#64748B] hover:text-red-500 absolute top-4 right-4"><Trash2 className="w-4 h-4"/></button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
           {openTab === 'certificates' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">Сертификаты</h2>
                    <button onClick={() => addArrayItem('certificates', { name: 'Новый сертификат', type: 'Тип', active: true })} className="text-sm bg-[#1B3F7A]/10 text-[#0F172A] font-bold px-3 py-1.5 rounded flex items-center hover:bg-[#1B3F7A]/20 transition-colors">
                       <Plus className="w-4 h-4 mr-1" /> Добавить
                    </button>
                 </div>
                 <div className="space-y-4">
                    {(content.certificates || []).map((cert: any, i: number) => (
                       <div key={i} className="flex gap-4 items-center bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg relative">
                          <div className="flex flex-col gap-1">
                             <button onClick={() => moveItem('certificates', i, -1)} className="text-[#64748B] hover:text-[#1E293B]">▲</button>
                             <button onClick={() => moveItem('certificates', i, 1)} className="text-[#64748B] hover:text-[#1E293B]">▼</button>
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input type="text" value={cert.name} onChange={e => updateArrayItem('certificates', i, 'name', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm font-bold" placeholder="Название" />
                             <input type="text" value={cert.type} onChange={e => updateArrayItem('certificates', i, 'type', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm" placeholder="Тип" />
                             <div className="md:col-span-2">
                               <div className="flex justify-between items-end mb-1">
                                 <span className="text-xs font-bold text-[#64748B] uppercase">Скан документа</span>
                                 <span className="text-xs text-[#64748B]">Рекомендуемый размер: 600 × 800 px</span>
                               </div>
                               <ImageUploader 
                                 value={cert.image || ''} 
                                 onChange={(base64) => updateArrayItem('certificates', i, 'image', base64)} 
                                 className="w-32" 
                                 shape="portrait" 
                               />
                             </div>
                          </div>
                          <button onClick={() => removeArrayItem('certificates', i)} className="text-[#64748B] hover:text-red-500 p-2"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    ))}
                    {(!content.certificates || content.certificates.length === 0) && (
                       <div className="text-center py-8 text-[#64748B] border border-[#E2E8F0] border-dashed rounded-lg">Сертификаты не добавлены</div>
                    )}
                 </div>
              </div>
            )}
           {openTab === 'patents' && (
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="text-xl font-bold">Патенты</h2>
                    <button onClick={() => addArrayItem('patents', { name: 'Новый патент', type: 'Изобретение', active: true })} className="text-sm bg-[#1B3F7A]/10 text-[#0F172A] font-bold px-3 py-1.5 rounded flex items-center hover:bg-[#1B3F7A]/20 transition-colors">
                       <Plus className="w-4 h-4 mr-1" /> Добавить
                    </button>
                 </div>
                 <div className="space-y-4">
                    {(content.patents || []).map((patent: any, i: number) => (
                       <div key={i} className="flex gap-4 items-center bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg relative">
                          <div className="flex flex-col gap-1">
                             <button onClick={() => moveItem('patents', i, -1)} className="text-[#64748B] hover:text-[#1E293B]">▲</button>
                             <button onClick={() => moveItem('patents', i, 1)} className="text-[#64748B] hover:text-[#1E293B]">▼</button>
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input type="text" value={patent.name} onChange={e => updateArrayItem('patents', i, 'name', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm font-bold" placeholder="Название" />
                             <input type="text" value={patent.type} onChange={e => updateArrayItem('patents', i, 'type', e.target.value)} className="w-full text-sm border-gray-300 rounded shadow-sm" placeholder="Тип" />
                             <div className="md:col-span-2">
                               <div className="flex justify-between items-end mb-1">
                                 <span className="text-xs font-bold text-[#64748B] uppercase">Скан документа</span>
                                 <span className="text-xs text-[#64748B]">Рекомендуемый размер: 600 × 800 px</span>
                               </div>
                               <ImageUploader 
                                 value={patent.image || ''} 
                                 onChange={(base64) => updateArrayItem('patents', i, 'image', base64)} 
                                 className="w-32" 
                                 shape="portrait" 
                               />
                             </div>
                          </div>
                          <button onClick={() => removeArrayItem('patents', i)} className="text-[#64748B] hover:text-red-500 p-2"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    ))}
                    {(!content.patents || content.patents.length === 0) && (
                       <div className="text-center py-8 text-[#64748B] border border-[#E2E8F0] border-dashed rounded-lg">Патенты не добавлены</div>
                    )}
                 </div>
              </div>
            )}
           {openTab === 'quiz' && (
              <div className="space-y-6">
                 <h2 className="text-xl font-bold border-b pb-4">Блок "Подбор решения (Квиз)"</h2>
                 <div>
                   <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Надзаголовок (Тег)</label>
                   <input 
                     value={content.quizTag || 'Подбор решения'} 
                     onChange={(e) => updateContent('quizTag', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] text-sm" 
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Заголовок</label>
                   <input 
                     value={content.quizTitle || 'Какой вид защиты вам нужен?'} 
                     onChange={(e) => updateContent('quizTitle', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] text-sm" 
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Подзаголовок (описание)</label>
                   <textarea 
                     value={content.quizSubtitle || 'Ответьте на 2 вопроса и получите профессиональную рекомендацию юриста по защите интеллектуальной собственности.'} 
                     onChange={(e) => updateContent('quizSubtitle', e.target.value)} 
                     rows={3}
                     className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] text-sm" 
                   />
                 </div>
                 <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-lg mt-4">
                   <p className="text-sm text-[#64748B]">Вопросы и логика квиза редактируются программистом, так как они тесно связаны с алгоритмом обработки заявок.</p>
                 </div>
              </div>
            )}
           {openTab === 'builder' && (
              <BuilderAdmin hideHeader={true} />
            )}
           {openTab === 'cta' && (
              <div className="space-y-6">
                 <h2 className="text-xl font-bold border-b pb-4">Финальный CTA</h2>
                 
                 <div className="flex items-center space-x-2 pb-2">
                    <input type="checkbox" id="cta-active" checked={content.ctaActive !== false} onChange={e => updateContent('ctaActive', e.target.checked)} className="rounded text-[#0F172A] focus:ring-[#1B3F7A] w-4 h-4" />
                    <label htmlFor="cta-active" className="text-sm font-medium text-[#1E293B]">Показывать блок</label>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Заголовок CTA</label>
                   <input 
                     value={content.ctaTitle || 'Готовы защитить свой бизнес?'} 
                     onChange={(e) => updateContent('ctaTitle', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm text-sm font-bold" 
                   />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Описание CTA</label>
                   <textarea 
                     value={content.ctaDesc || 'Оставьте заявку, и мы свяжемся с вами в течение 15 минут...'} 
                     onChange={(e) => updateContent('ctaDesc', e.target.value)} 
                     className="w-full border-gray-300 rounded-md shadow-sm text-sm h-24" 
                   />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Текст кнопки</label>
                      <input 
                        value={content.ctaButton || 'Связаться с патентным поверенным'} 
                        onChange={(e) => updateContent('ctaButton', e.target.value)} 
                        className="w-full border-gray-300 rounded-md shadow-sm text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Ссылка кнопки</label>
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
