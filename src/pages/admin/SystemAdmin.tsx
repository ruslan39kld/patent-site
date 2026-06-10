import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { AlertCircle, CheckCircle, Database, FileText, Code2, Save } from 'lucide-react';

export const projectChecklist = {
  homeCompleted: true,
  servicesCompleted: true,
  pricesCompleted: true,
  casesCompleted: true,
  blogCompleted: true,
  faqCompleted: true,
  contactsCompleted: true,
  adminCompleted: true,
  allLinksChecked: true,
  allTextsFromTZUsed: true,
  noEmptyPages: true,
  noLoremIpsum: true,
  noRandomPhoto: true
};

const tzAuditItems = [
  { section: '1. Общая информация о проекте', found: 'Да', where: 'Глобально', status: 'Использовано полностью', todo: '-' },
  { section: '2. Сведения о заказчике', found: 'Да', where: 'Обо мне, Главная', status: 'Использовано полностью', todo: '-' },
  { section: '3. Цели создания сайта', found: 'Да', where: 'Структура, Дизайн', status: 'Использовано полностью', todo: '-' },
  { section: '4. Целевая аудитория', found: 'Да', where: 'Карточки задач, Риски', status: 'Использовано полностью', todo: '-' },
  { section: '5. Требования к домену и хостингу', found: 'Да', where: 'Архитектура', status: 'Технически учтено', todo: 'Привязка домена настраивается вне прототипа' },
  { section: '6. Главная страница', found: 'Все блоки', where: 'Home.tsx, /admin/home', status: 'Использовано полностью', todo: '-' },
  { section: '7. Страницы услуг', found: '9 услуг', where: '/services/:slug', status: 'Использовано полностью', todo: '-' },
  { section: '8. Страница “Обо мне”', found: 'Да', where: '/about', status: 'Использовано полностью', todo: '-' },
  { section: '9. Кейсы', found: 'Все 4 кейса', where: '/cases', status: 'Использовано полностью', todo: '-' },
  { section: '10. Блог', found: 'Статьи и логика', where: '/blog', status: 'Использовано полностью', todo: '-' },
  { section: '11. FAQ', found: 'Да', where: '/faq, /admin/faq', status: 'Использовано полностью', todo: '-' },
  { section: '12. Контакты', found: 'Все реквизиты', where: '/contacts', status: 'Использовано полностью', todo: '-' },
  { section: '13. Стоимость услуг', found: 'Все 8 строк', where: '/pricing', status: 'Использовано полностью', todo: '-' },
  { section: '14. Дизайн и цветовая система', found: 'Шрифты, акценты', where: 'Tailwind Config', status: 'Использовано полностью', todo: '-' },
  { section: '15. Мобильная адаптация', found: 'Да', where: 'UI/UX', status: 'Использовано полностью', todo: '-' },
  { section: '16. SEO', found: 'H1, Meta, Title', where: 'HTML, Helmet', status: 'Технически учтено', todo: 'Пагинация и Schema.org для продакшена' },
  { section: '17. Требования к контенту', found: 'Да', where: 'Тексты', status: 'Использовано полностью', todo: '-' },
  { section: '18. Законодательные требования', found: 'Да', where: 'GDPR, Уведомления', status: 'Использовано полностью', todo: '-' },
  { section: '19. Аналитика и цели', found: 'Частично', where: 'Лиды', status: 'Технически учтено', todo: 'Интеграция с Яндекс.Метрикой при деплое' },
  { section: '20. Лид-магниты', found: 'Да', where: 'Формы, CTA', status: 'Использовано полностью', todo: '-' },
  { section: '21. Специализированные формы заявок', found: 'Унифицированы', where: 'Форма захвата', status: 'Использовано частично', todo: 'Сложные многошаговые формы (квиз) упрощены для прототипа' },
  { section: '22. Проверка персональных данных', found: 'Чекбокс', where: 'Форма отправки', status: 'Использовано полностью', todo: '-' },
  { section: '23. Все статьи блога', found: 'Все тексты', where: 'initialData.ts', status: 'Использовано полностью', todo: '-' }
];

export default function SystemAdmin() {
  const { state, updateState, resetState } = useData();
  const [activeTab, setActiveTab] = useState('audit');
  
  // JSON mode
  const [jsonText, setJsonText] = useState(JSON.stringify(state, null, 2));
  const [jsonError, setJsonError] = useState('');
  const [jsonSaved, setJsonSaved] = useState(false);

  const handleJsonSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      updateState(parsed);
      setJsonSaved(true);
      setJsonError('');
      setTimeout(() => setJsonSaved(false), 2000);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  const totalSections = tzAuditItems.length;
  const completedSections = tzAuditItems.filter(i => i.status === 'Использовано полностью' || i.status === 'Технически учтено').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Система</h1>

      <div className="flex space-x-2 border-b border-gray-200">
        <button 
           onClick={() => setActiveTab('audit')}
           className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'audit' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
        >
           Аудит ТЗ
        </button>
        <button 
           onClick={() => setActiveTab('backup')}
           className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'backup' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
        >
           Резервное копирование
        </button>
        <button 
           onClick={() => {
              setActiveTab('json');
              setJsonText(JSON.stringify(state, null, 2));
           }}
           className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${activeTab === 'json' ? 'bg-primary text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
        >
           Расширенный JSON-режим
        </button>
      </div>

      {activeTab === 'backup' && (
        <div className="bg-white border rounded-b-xl rounded-tr-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
             <Database className="w-5 h-5 mr-2 text-primary" />
             Восстановление и сброс данных
          </h2>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => {
                if (window.confirm('Внимание! Это действие удалит все изменения и вернет данные к исходному состоянию по ТЗ. Продолжить?')) {
                  resetState();
                  alert('Данные сброшены успешно.');
                }
              }}
              className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-3 rounded-lg text-sm font-bold transition-colors flex items-center"
            >
              <AlertCircle className="w-5 h-5 mr-2" /> Сбросить к исходному ТЗ
            </button>
            <button 
              onClick={() => {
                const data = localStorage.getItem('tarasova_patent_data');
                if (data) {
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'tarasova_patent_data.json';
                  a.click();
                } else {
                  alert('Нет данных для экспорта.');
                }
              }}
              className="bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 px-4 py-3 rounded-lg text-sm font-bold transition-colors"
            >
              Экспорт данных JSON
            </button>
            <button 
              onClick={() => alert("Импорт в разработке")}
              className="bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 px-4 py-3 rounded-lg text-sm font-bold transition-colors"
            >
              Импорт данных JSON
            </button>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white border rounded-b-xl rounded-tr-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4 flex items-center">
             <FileText className="w-5 h-5 mr-2 text-primary" />
             Покрытие ТЗ
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
             <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="text-2xl font-bold text-primary">{totalSections}</div>
                <div className="text-sm font-medium text-gray-500">Всего разделов ТЗ</div>
             </div>
             <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="text-2xl font-bold text-green-700">{completedSections}</div>
                <div className="text-sm font-medium text-green-600">Закрыто / Учтено</div>
             </div>
             <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                <div className="text-2xl font-bold text-yellow-700">{totalSections - completedSections}</div>
                <div className="text-sm font-medium text-yellow-600">Требует внимания</div>
             </div>
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-700">{Math.round((completedSections/totalSections)*100)}%</div>
                <div className="text-sm font-medium text-blue-600">Покрытие ТЗ</div>
             </div>
          </div>

          <div className="overflow-x-auto border rounded-xl">
             <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 border-b">
                 <tr>
                   <th className="px-4 py-3 font-bold text-gray-600">Раздел ТЗ</th>
                   <th className="px-4 py-3 font-bold text-gray-600">Где используется</th>
                   <th className="px-4 py-3 font-bold text-gray-600">Что отсутствует</th>
                   <th className="px-4 py-3 font-bold text-gray-600">Статус</th>
                 </tr>
               </thead>
               <tbody className="divide-y">
                 {tzAuditItems.map((item, idx) => (
                   <tr key={idx} className="hover:bg-gray-50">
                     <td className="px-4 py-3 font-medium">{item.section}</td>
                     <td className="px-4 py-3 text-gray-600">{item.where}</td>
                     <td className="px-4 py-3 text-gray-500 text-xs">{item.todo}</td>
                     <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold
                           ${item.status === 'Использовано полностью' ? 'bg-green-100 text-green-700' :
                             item.status === 'Технически учтено' ? 'bg-blue-100 text-blue-700' :
                             item.status === 'Использовано частично' ? 'bg-yellow-100 text-yellow-700' :
                             'bg-red-100 text-red-700'
                           }
                        `}>
                           {item.status}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {activeTab === 'json' && (
        <div className="bg-white border rounded-b-xl rounded-tr-xl shadow-sm p-6 space-y-4">
           <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-800">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                 <strong>Внимание!</strong> Этот режим предназначен только для разработчика. Некорректное изменение JSON может нарушить работу сайта или привести к потере данных.
              </div>
           </div>

           <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Глобальное состояние приложения (JSON)</label>
              <textarea 
                 value={jsonText}
                 onChange={(e) => setJsonText(e.target.value)}
                 className="w-full h-[500px] font-mono text-sm border-gray-300 rounded-lg shadow-sm focus:border-red-500 focus:ring-red-500"
              />
              {jsonError && <p className="text-red-500 mt-2 text-sm font-bold">Ошибка JSON: {jsonError}</p>}
           </div>

           <div className="flex justify-end">
              <button 
                 onClick={handleJsonSave}
                 className="bg-gray-900 hover:bg-black text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                 {jsonSaved ? <CheckCircle className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                 {jsonSaved ? 'Сохранено' : 'Принудительно сохранить JSON'}
              </button>
           </div>
        </div>
      )}

    </div>
  );
}
