import { useState, useEffect } from 'react';
import { useData } from '../../store/DataContext';
import { Save, CheckCircle2, Trash2, Plus } from 'lucide-react';

export default function ContactsAdmin() {
  const { state, updateState } = useData();
  
  const [contactItems, setContactItems] = useState(() => {
    if (state.content.contactItems && state.content.contactItems.length > 0) {
      return state.content.contactItems;
    }
    return [
      { id: Math.random().toString(36).substr(2, 9), type: 'phone' as const, label: 'Телефон', shortLabel: '', value: state.content.phone ?? '+7 (915) 130-85-63', isActive: !!state.content.phone },
      { id: Math.random().toString(36).substr(2, 9), type: 'email' as const, label: 'Email (для иностранных заявителей)', shortLabel: '', value: state.content.emailForeign ?? 'tarasovapatentright@yahoo.com', isActive: !!state.content.emailForeign },
      { id: Math.random().toString(36).substr(2, 9), type: 'email' as const, label: 'Email (для РФ)', shortLabel: '', value: state.content.emailRF ?? 'tarasovapatentright@yandex.ru', isActive: !!state.content.emailRF },
      { id: Math.random().toString(36).substr(2, 9), type: 'social' as const, label: 'Telegram', shortLabel: 'TG', value: state.content.telegram ?? 'https://t.me/patent_1558', isActive: !!state.content.telegram },
      { id: Math.random().toString(36).substr(2, 9), type: 'social' as const, label: 'VK', shortLabel: 'VK', value: state.content.vk ?? 'https://vk.com/attorney1558', isActive: !!state.content.vk },
      { id: Math.random().toString(36).substr(2, 9), type: 'social' as const, label: 'MAX', shortLabel: 'MAX', value: state.content.max ?? 'https://max.ru/u/f9LHodD0cOLqx_jhf9LjNAuXN_XcS2_2UCmuGrb33IO7jd_h2nQSnGIPW3E', isActive: !!state.content.max },
      { id: Math.random().toString(36).substr(2, 9), type: 'social' as const, label: 'ST (Stimit)', shortLabel: 'ST', value: state.content.stimit ?? 'https://stimit.ru/', isActive: !!state.content.stimit },
      { id: Math.random().toString(36).substr(2, 9), type: 'social' as const, label: 'WhatsApp', shortLabel: 'WA', value: state.content.whatsapp ? (state.content.whatsapp.startsWith('http') ? state.content.whatsapp : `https://wa.me/${state.content.whatsapp.replace(/[^\d]/g, '')}`) : '', isActive: !!state.content.whatsapp }
    ];
  });

  const [others, setOthers] = useState({
    responseTime: state.content.responseTime ?? 'Отвечаю в течение 30 минут',
    rospatentLink: state.content.rospatentLink ?? 'https://rospatent.gov.ru',
    ctaText: state.content.ctaText ?? 'Опишите вашу задачу — мы свяжемся с вами в течение 30 минут.'
  });
  
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Backwards compatibility sync
    const firstPhone = contactItems.find(i => i.type === 'phone' && i.isActive)?.value || '';
    const firstEmail = contactItems.find(i => i.type === 'email' && i.isActive)?.value || '';
    
    updateState({ 
      ...state, 
      content: { 
        ...state.content, 
        contactItems,
        phone: firstPhone,
        email: firstEmail,
        ...others
      } 
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateItem = (id: string, field: string, value: any) => {
    setContactItems(items => items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'value') {
          updated.isActive = value.trim().length > 0;
        }
        return updated;
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    setContactItems(items => items.filter(i => i.id !== id));
  };

  const handleAddNew = () => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'social' as const,
      label: 'Новая соцсеть',
      shortLabel: 'NEW',
      value: '',
      isActive: false
    };
    setContactItems([...contactItems, newItem]);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-[#E2E8F0]">
        <h1 className="text-2xl font-bold text-[#0F172A]">Управление контактами</h1>
        <button
          onClick={handleSave}
          className="bg-[#1B3F7A] hover:bg-secondary text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center shrink-0"
        >
          {saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saved ? 'Сохранено' : 'Сохранить контакты'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[20%]">Тип</th>
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[25%]">Название</th>
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[10%]">Абб. (2 б.)</th>
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[35%]">Ссылка / Значение</th>
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[5%] text-center">Статус</th>
                <th className="py-4 px-6 text-xs font-bold text-[#64748B] uppercase tracking-wider w-[5%] text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {contactItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 align-top">
                    <select
                      value={item.type}
                      onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] text-sm py-2"
                    >
                      <option value="phone">Телефон</option>
                      <option value="email">Email</option>
                      <option value="social">Соц. сеть / Мессенджер</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 align-top">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] text-sm"
                      placeholder="Напр. Telegram"
                    />
                  </td>
                  <td className="py-4 px-6 align-top">
                    {item.type === 'social' && (
                      <input
                        type="text"
                        value={item.shortLabel || ''}
                        onChange={(e) => updateItem(item.id, 'shortLabel', e.target.value.substring(0, 3).toUpperCase())}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] text-sm text-center uppercase font-bold"
                        placeholder="TG"
                      />
                    )}
                  </td>
                  <td className="py-4 px-6 align-top">
                    <textarea
                      value={item.value}
                      onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                      rows={2}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] text-sm break-all resize-none"
                      placeholder={item.type === 'phone' ? '+7 ...' : 'https://...'}
                    />
                  </td>
                  <td className="py-4 px-6 align-top text-center">
                    {item.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-800">
                        АКТИВНО
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-800">
                        СКРЫТО
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 align-top text-center">
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                      title="Удалить"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={6} className="py-4 px-6 bg-slate-50/30">
                  <button
                    onClick={handleAddNew}
                    className="flex items-center text-sm font-medium text-[#1B3F7A] hover:text-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Добавить новый контакт
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div className="p-6 space-y-6 bg-white border-t border-[#E2E8F0]">
            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Время ответа</label>
              <input 
                 type="text" value={others.responseTime} onChange={(e) => setOthers({ ...others, responseTime: e.target.value })}
                 className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Ссылка на реестр Роспатента</label>
              <input 
                 type="url" value={others.rospatentLink} onChange={(e) => setOthers({ ...others, rospatentLink: e.target.value })}
                 className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] text-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">Текст CTA на странице контактов</label>
              <textarea 
                 value={others.ctaText} onChange={(e) => setOthers({ ...others, ctaText: e.target.value })}
                 rows={3}
                 className="w-full border-gray-300 rounded-md shadow-sm focus:border-[#1B3F7A] focus:ring-[#1B3F7A] resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
