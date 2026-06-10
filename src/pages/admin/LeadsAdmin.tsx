import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Trash2, MessageSquare, ExternalLink } from 'lucide-react';

export default function LeadsAdmin() {
  const { state, updateState } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const leads = state.leads || [];

  const handleStatusChange = (id: string, status: string) => {
    updateState({ ...state, leads: leads.map(l => l.id === id ? { ...l, status } : l) });
  };

  const removeLead = (id: string) => {
     updateState({ ...state, leads: leads.filter(l => l.id !== id) });
  }

  const saveComment = (id: string) => {
     updateState({ ...state, leads: leads.map(l => l.id === id ? { ...l, comment: commentText } : l) });
     setEditingId(null);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Управление заявками</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Заявок пока нет</h3>
            <p className="max-w-sm mx-auto">После отправки формы на сайте заявки будут появляться здесь автоматически.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-500">
                   <tr>
                      <th className="px-6 py-4">Дата</th>
                      <th className="px-6 py-4">Имя</th>
                      <th className="px-6 py-4">Контакты</th>
                      <th className="px-6 py-4">Тип / Задача</th>
                      <th className="px-6 py-4">Статус</th>
                      <th className="px-6 py-4">Комментарий</th>
                      <th className="px-6 py-4 text-right">Действия</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                   {leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50/50">
                         <td className="px-6 py-4 whitespace-nowrap">{new Date(lead.date).toLocaleString('ru-RU')}</td>
                         <td className="px-6 py-4 font-medium text-gray-900">{lead.name}</td>
                         <td className="px-6 py-4">
                            <div className="font-medium">{lead.contact}</div>
                         </td>
                         <td className="px-6 py-4 max-w-[200px]">
                            <div className="text-xs font-bold text-primary bg-primary/5 inline-block px-2 py-1 rounded mb-1">{lead.type} ({lead.source})</div>
                            <div className="truncate" title={lead.desc}>{lead.desc}</div>
                         </td>
                         <td className="px-6 py-4">
                            <select 
                               value={lead.status}
                               onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                               className={`text-xs font-bold rounded-full px-3 py-1 border-0 ring-1 ring-inset ${
                                  lead.status === 'Новая' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                  lead.status === 'В работе' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                                  'bg-green-50 text-green-700 ring-green-600/20'
                               }`}
                            >
                               <option value="Новая">Новая</option>
                               <option value="В работе">В работе</option>
                               <option value="Завершена">Завершена</option>
                            </select>
                         </td>
                         <td className="px-6 py-4 min-w-[200px]">
                            {editingId === lead.id ? (
                               <div className="flex gap-2">
                                  <input 
                                     type="text" value={commentText} onChange={e => setCommentText(e.target.value)}
                                     className="w-full text-xs rounded border-gray-300"
                                  />
                                  <button onClick={() => saveComment(lead.id)} className="text-xs bg-primary text-white px-2 py-1 rounded">Ок</button>
                               </div>
                            ) : (
                               <div 
                                  className="cursor-pointer hover:bg-gray-100 p-1 rounded min-h-[1.5rem] text-xs text-gray-500 italic"
                                  onClick={() => { setEditingId(lead.id); setCommentText(lead.comment); }}
                               >
                                  {lead.comment || 'Добавить комментарий...'}
                               </div>
                            )}
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button onClick={() => removeLead(lead.id)} className="text-gray-400 hover:text-red-500">
                               <Trash2 className="w-5 h-5 inline" />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}
