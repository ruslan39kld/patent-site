import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, CheckCircle2, Eye, Plus, Trash2 } from 'lucide-react';
import { BlogPost } from '../../types';

export default function BlogAdmin() {
  const { state, updateState } = useData();
  const [posts, setPosts] = useState<BlogPost[]>(state.blogPosts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [success, setSuccess] = useState('');

  const saveToState = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    updateState({ ...state, blogPosts: newPosts });
    setSuccess('Блог сохранен');
    setTimeout(() => setSuccess(''), 3000);
  };

  const addPost = () => {
     const newId = `post-${Date.now()}`;
     const newPost: BlogPost = {
        id: newId,
        title: 'Новая статья',
        slug: `new-post-${Date.now()}`,
        category: 'Обзоры',
        excerpt: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        metaTitle: '',
        metaDesc: ''
     };
     setPosts([newPost, ...posts]);
     setEditingId(newId);
  };

  const deletePost = (id: string) => {
     setPosts(posts.filter(p => p.id !== id));
     if(editingId === id) setEditingId(null);
  };

  const currentPost = posts.find(p => p.id === editingId);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Управление блогом</h1>
        <button 
          onClick={() => saveToState(posts)}
          className="bg-primary text-white px-6 py-2 rounded-lg flex items-center hover:bg-secondary font-medium transition-colors"
        >
          {success ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {success ? 'Сохранено' : 'Сохранить изменения'}
        </button>
      </div>

      {editingId && currentPost ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
             <h2 className="text-xl font-bold">Редактирование статьи</h2>
             <div className="flex gap-4 items-center">
                <button className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg flex items-center text-gray-600 hover:bg-gray-50 font-medium">
                   <Eye className="w-4 h-4 mr-2" /> Предпросмотр статьи
                </button>
                <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-primary font-medium text-sm">Вернуться к списку</button>
                <button onClick={() => deletePost(currentPost.id)} className="text-red-500 hover:text-red-600 font-medium text-sm ml-4 border-l border-gray-200 pl-4">Удалить</button>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="md:col-span-2 space-y-6">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Название</label>
                   <input type="text" value={currentPost.title} onChange={(e) => setPosts(posts.map(p => p.id === editingId ? { ...p, title: e.target.value } : p))} className="w-full border-gray-300 rounded-md font-bold text-lg" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Краткое описание (для карточки и лидов)</label>
                   <textarea rows={3} value={currentPost.excerpt || ''} onChange={(e) => setPosts(posts.map(p => p.id === editingId ? { ...p, excerpt: e.target.value } : p))} className="w-full border-gray-300 rounded-md text-sm resize-none" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Полный текст статьи (HTML)</label>
                   <textarea rows={16} value={currentPost.content} onChange={(e) => setPosts(posts.map(p => p.id === editingId ? { ...p, content: e.target.value } : p))} className="w-full border-gray-300 rounded-md text-sm font-mono" />
                </div>
             </div>

             <div className="space-y-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Статус публикации</label>
                   <select className="w-full border-gray-300 rounded-md text-sm font-medium focus:ring-primary focus:border-primary">
                      <option>Опубликована</option>
                      <option>Черновик</option>
                   </select>
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Slug (URL)</label>
                   <input type="text" value={currentPost.slug} onChange={(e) => setPosts(posts.map(p => p.id === editingId ? { ...p, slug: e.target.value } : p))} className="w-full border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Категория</label>
                   <input type="text" value={currentPost.category} onChange={(e) => setPosts(posts.map(p => p.id === editingId ? { ...p, category: e.target.value } : p))} className="w-full border-gray-300 rounded-md text-sm" />
                </div>
                <hr className="border-gray-200" />
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Мета-заголовок (Title)</label>
                   <input type="text" value={currentPost.metaTitle || ''} onChange={(e) => setPosts(posts.map(p => p.id === editingId ? { ...p, metaTitle: e.target.value } : p))} className="w-full border-gray-300 rounded-md text-sm" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Мета-описание (Description)</label>
                   <textarea rows={3} value={currentPost.metaDesc || ''} onChange={(e) => setPosts(posts.map(p => p.id === editingId ? { ...p, metaDesc: e.target.value } : p))} className="w-full border-gray-300 rounded-md text-sm resize-none" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-2">CTA в конце статьи</label>
                   <input type="text" placeholder="Текст кнопки" className="w-full border-gray-300 rounded-md text-sm" />
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
           <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-900">Список статей</h2>
              <button onClick={addPost} className="p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20"><Plus className="w-5 h-5"/></button>
           </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase">Название</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase">Категория</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase">Мета-заголовок</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase">Статус</th>
                <th className="px-6 py-4 font-bold text-gray-500 uppercase text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 max-w-[300px] truncate">{post.title}</td>
                  <td className="px-6 py-4 text-gray-500">{post.category}</td>
                  <td className="px-6 py-4 text-gray-400 truncate max-w-[200px]">{post.metaTitle}</td>
                  <td className="px-6 py-4 text-green-600 font-medium text-xs">Опубликована</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setEditingId(post.id)}
                      className="text-primary hover:text-secondary font-medium mr-4"
                    >
                      Редактировать
                    </button>
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
