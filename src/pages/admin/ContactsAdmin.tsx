import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, CheckCircle2 } from 'lucide-react';

export default function ContactsAdmin() {
  const { state, updateState } = useData();
  const [contacts, setContacts] = useState({
    phone: state.content.phone || '+7 (999) 000-00-00',
    email: state.content.email || 'info@tarasovapatent.ru',
    telegram: state.content.telegram || '@tarasovapatent',
    whatsapp: state.content.whatsapp || '79990000000',
    responseTime: 'Отвечаю в течение 30 минут',
    rospatentLink: 'https://rospatent.gov.ru',
    privacyLink: '/privacy',
    ctaText: 'Опишите вашу задачу — мы свяжемся с вами в течение 30 минут.'
  });
  
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateState({ ...state, content: { ...state.content, ...contacts } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChange = (key: string, value: string) => {
    setContacts({ ...contacts, [key]: value });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Управление контактами</h1>
        <button
          onClick={handleSave}
          className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          {saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saved ? 'Сохранено' : 'Сохранить контакты'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-6">
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Телефон</label>
                 <input 
                    type="text" value={contacts.phone} onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent font-medium text-lg"
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                 <input 
                    type="email" value={contacts.email} onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent font-medium text-lg"
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Telegram (Ник / Ссылка)</label>
                 <input 
                    type="text" value={contacts.telegram} onChange={(e) => handleChange('telegram', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent"
                 />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp (Номер без +)</label>
                 <input 
                    type="text" value={contacts.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent"
                 />
              </div>
           </div>

           <hr className="border-gray-100" />

           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Время ответа</label>
              <input 
                 type="text" value={contacts.responseTime} onChange={(e) => handleChange('responseTime', e.target.value)}
                 className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent"
              />
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ссылка на реестр Роспатента</label>
              <input 
                 type="url" value={contacts.rospatentLink} onChange={(e) => handleChange('rospatentLink', e.target.value)}
                 className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent text-blue-600"
              />
           </div>

           <hr className="border-gray-100" />

           <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Текст CTA на странице контактов</label>
              <textarea 
                 value={contacts.ctaText} onChange={(e) => handleChange('ctaText', e.target.value)}
                 rows={3}
                 className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent resize-none"
              />
           </div>
        </div>
      </div>
    </div>
  );
}
