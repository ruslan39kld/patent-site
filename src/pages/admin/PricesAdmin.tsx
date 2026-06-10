import { useState } from 'react';
import { useData } from '../../store/DataContext';
import { Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { PriceItem as ServicePrice } from '../../types';

export default function PricesAdmin() {
  const { state, updateState } = useData();
  const [prices, setPrices] = useState<ServicePrice[]>(state.prices || []);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateState({ ...state, prices });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updatePrice = (index: number, key: keyof ServicePrice, value: string) => {
    const newPrices = [...prices];
    newPrices[index] = { ...newPrices[index], [key]: value };
    setPrices(newPrices);
  };

  const addPrice = () => {
    setPrices([...prices, {
      id: `price-${Date.now()}`,
      serviceId: 'new-service',
      service: 'Новая услуга',
      fee: 'от 0 руб.',
      duty: 'по тарифу',
      time: 'по согласованию',
    }]);
  };

  const removePrice = (index: number) => {
    setPrices(prices.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Управление стоимостью</h1>
        <button
          onClick={handleSave}
          className="bg-primary hover:bg-secondary text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          {saved ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
          {saved ? 'Сохранено' : 'Сохранить изменения'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Таблица стоимости</h2>
          <button onClick={addPrice} className="text-primary hover:text-secondary font-medium flex items-center text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm">
            <Plus className="w-4 h-4 mr-1" /> Добавить строку
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {prices.map((price, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-5 flex flex-col md:flex-row gap-4 items-start relative hover:shadow-md transition-shadow">
                <button 
                  onClick={() => removePrice(idx)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full pr-8">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Услуга</label>
                    <input 
                      type="text" 
                      value={price.service || ''} 
                      onChange={(e) => updatePrice(idx, 'service', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Гонорар</label>
                    <input 
                      type="text" 
                      value={price.fee || ''} 
                      onChange={(e) => updatePrice(idx, 'fee', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Госпошлины</label>
                    <input 
                      type="text" 
                      value={price.duty || ''} 
                      onChange={(e) => updatePrice(idx, 'duty', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Срок</label>
                    <input 
                      type="text" 
                      value={price.time || ''} 
                      onChange={(e) => updatePrice(idx, 'time', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            {prices.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Нет добавленных цен.</p>
                <button onClick={addPrice} className="mt-4 text-primary font-bold hover:underline">
                  Добавить первую стоимость
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
