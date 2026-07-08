import React, { useState } from 'react';
import { useData } from '../../store/DataContext';
import { PriceItem } from '../../types';
import { Plus, Check, Save, Edit2, Trash2, X, Info } from 'lucide-react';
import { categories } from '../Pricing';

export default function PricesAdmin() {
  const { state, updateState } = useData();
  const [prices, setPrices] = useState<PriceItem[]>(state.prices || []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [tempData, setTempData] = useState<Partial<PriceItem>>({});
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSaveAll = () => {
    updateState({ ...state, prices });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handleEdit = (id: string, currentData: PriceItem) => {
    setEditingId(id);
    setIsAdding(false);
    setTempData(currentData);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setTempData({ categoryId: categories[0].id, name: '', price: '', tax: '' });
  };

  const saveEdit = () => {
    if (isAdding) {
      const newPrice: PriceItem = {
        id: `price-${Date.now()}`,
        categoryId: tempData.categoryId || '',
        name: tempData.name || '',
        price: tempData.price || '',
        tax: tempData.tax || '',
      };
      setPrices([newPrice, ...prices]);
    } else {
      setPrices(prices.map(p => p.id === editingId ? { ...p, ...tempData } as PriceItem : p));
    }
    setEditingId(null);
    setIsAdding(false);
    setTempData({});
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
      setPrices(prices.filter(p => p.id !== id));
    }
  };

  const Modal = () => {
    if (!editingId && !isAdding) return null;
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
            <h3 className="text-xl font-bold">{isAdding ? 'Добавление услуги' : 'Редактирование услуги'}</h3>
            <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="text-[#64748B] hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
               <label className="block text-sm font-bold text-[#64748B] mb-1">Категория</label>
               <select
                 className="w-full border-[#E2E8F0] rounded-md shadow-sm focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                 value={tempData.categoryId || ''}
                 onChange={(e) => setTempData({...tempData, categoryId: e.target.value})}
               >
                 {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
               </select>
            </div>
            <div>
               <label className="block text-sm font-bold text-[#64748B] mb-1">Название услуги</label>
               <input
                 type="text"
                 className="w-full border-[#E2E8F0] rounded-md shadow-sm focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                 value={tempData.name || ''}
                 onChange={(e) => setTempData({...tempData, name: e.target.value})}
               />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-bold text-[#64748B] mb-1">Стоимость</label>
                 <input
                   type="text"
                   className="w-full border-[#E2E8F0] rounded-md shadow-sm focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                   value={tempData.price || ''}
                   onChange={(e) => setTempData({...tempData, price: e.target.value})}
                 />
              </div>
              <div>
                 <label className="block text-sm font-bold text-[#64748B] mb-1">Госпошлина</label>
                 <input
                   type="text"
                   className="w-full border-[#E2E8F0] rounded-md shadow-sm focus:ring-[#3B82F6] focus:border-[#3B82F6]"
                   value={tempData.tax || ''}
                   onChange={(e) => setTempData({...tempData, tax: e.target.value})}
                 />
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-[#E2E8F0] flex justify-end gap-3 bg-[#F8FAFC]/50">
             <button onClick={() => { setEditingId(null); setIsAdding(false); }} className="px-4 py-2 border border-[#E2E8F0] text-black font-medium rounded-lg hover:bg-gray-50">Отмена</button>
             <button onClick={saveEdit} className="px-4 py-2 bg-[#3B82F6] text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">Сохранить</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Управление стоимостью</h1>
          <p className="text-[#64748B] mt-1">Добавление, редактирование и удаление видов и стоимости услуг</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAdd} className="bg-white border border-[#E2E8F0] text-black hover:bg-gray-50 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" /> Добавить
          </button>
          <button 
            onClick={handleSaveAll}
            className="bg-[#1B3F7A] text-white hover:bg-[#1B3F7A]/90 px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 shadow-[0_4px_10px_rgba(27,63,122,0.2)]"
          >
            {savedStatus ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedStatus ? 'Сохранено!' : 'Сохранить изменения'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]/50">
          <h2 className="text-lg font-bold text-[#0F172A]">Таблица стоимости</h2>
          <div className="text-sm text-[#64748B] flex items-center bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-md shadow-sm">
            <Info className="w-4 h-4 mr-2 text-[#3B82F6]" /> Синхронизировано с главной страницей
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {categories.map(cat => {
              const catPrices = prices.filter(p => p.categoryId === cat.id);
              if (catPrices.length === 0) return null;
              
              return (
                <div key={cat.id} className="mb-8 last:mb-0">
                  <h3 className="text-[#1B3F7A] font-bold text-lg mb-4 border-b border-[#E2E8F0] pb-2">{cat.title}</h3>
                  <div className="space-y-3">
                    {catPrices.map((price) => (
                      <div key={price.id} className="bg-white border border-[#E2E8F0] rounded-lg p-5 flex flex-col md:flex-row gap-4 items-center relative hover:shadow-md transition-shadow group">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                          <div className="col-span-1 lg:col-span-2">
                            <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Услуга</label>
                            <p className="text-[#0F172A] font-medium">{price.name}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Стоимость</label>
                            <p className="text-[#0F172A] font-medium">{price.price}</p>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1">Госпошлины</label>
                            <p className="text-[#0F172A] font-medium">{price.tax}</p>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 shrink-0 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(price.id, price)} className="p-2 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors" title="Редактировать">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteItem(price.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Удалить">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {prices.length === 0 && (
              <div className="p-8 text-center bg-[#F8FAFC] rounded-lg border border-dashed border-[#E2E8F0]">
                <p className="text-[#64748B]">Нет данных. Нажмите "Добавить", чтобы создать новую запись.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal />
    </div>
  );
}
