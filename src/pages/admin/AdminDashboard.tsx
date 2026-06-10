import { useData } from '../../store/DataContext';
import { Users, FileText, Briefcase, BookOpen, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { state, resetState } = useData();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
        <button 
          onClick={() => {
            if (window.confirm('Внимание! Это действие удалит все изменения и вернет данные к исходному состоянию по ТЗ. Продолжить?')) {
              resetState();
              alert('Данные сброшены успешно.');
            }
          }}
          className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center"
        >
          <AlertCircle className="w-4 h-4 mr-2" /> Сбросить к исходному ТЗ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 border shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
             <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Услуг</div>
            <div className="text-2xl font-bold">{state.services.length}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mr-4">
             <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Кейсов</div>
            <div className="text-2xl font-bold">{state.cases.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center mr-4">
             <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Статей</div>
            <div className="text-2xl font-bold">{state.blogPosts.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border shadow-sm flex items-center">
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mr-4">
             <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Новых заявок</div>
            <div className="text-2xl font-bold">{state.leads.length}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-gray-900">Последние заявки (Leads)</h2>
        </div>
        <div className="divide-y">
          {state.leads.length > 0 ? state.leads.slice(0, 5).map(lead => (
            <div key={lead.id} className="p-6 flex flex-col md:flex-row justify-between hover:bg-gray-50 transition-colors">
              <div>
                <div className="flex items-center mb-2">
                  <span className="font-bold text-gray-900 mr-3">{lead.name}</span>
                  <span className="text-sm px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{lead.status}</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">{lead.contact} • {new Date(lead.date).toLocaleString('ru-RU')}</div>
                <div className="text-sm font-medium bg-gray-100 p-3 rounded-lg border text-gray-700 max-w-2xl">{lead.task}</div>
                <div className="text-xs text-gray-400 mt-2">Источник: {lead.source}</div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-gray-500">Заявок пока нет.</div>
          )}
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 text-blue-800 p-6 rounded-xl">
         <h3 className="font-bold mb-2 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" /> Доступный функционал панели
         </h3>
         <p className="text-sm leading-relaxed mb-4">
            В рамках текущего прототипа реализован сбор заявок (Leads) и сохранение их в LocalStorage, а также логика сброса состояния. Разделы редактирования контента (Услуги, Блог) подготовлены в структуре данных (см. src/types/index.ts) и легко расширяются на базе существующих форм.
         </p>
      </div>
    </div>
  );
}
