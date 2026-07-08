import React, { useState, useEffect } from 'react';
import { Calculator, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CalcOption {
  id: string;
  label: string;
  price: number;
}

const objectTypes: CalcOption[] = [
  { id: 'tm', label: 'Товарный знак', price: 15000 },
  { id: 'patent', label: 'Изобретение', price: 30000 },
  { id: 'design', label: 'Промышленный образец', price: 15000 },
  { id: 'software', label: 'Программа ЭВМ', price: 30000 },
];

const regions: CalcOption[] = [
  { id: 'ru', label: 'Российская Федерация', price: 0 },
  { id: 'intl', label: 'Международная', price: 35000 },
];

export default function PricingCalculator() {
  const [selectedType, setSelectedType] = useState(objectTypes[0]);
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [classesCount, setClassesCount] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let sum = selectedType.price;
    
    // add region price if applicable
    if (selectedType.id === 'tm' && selectedRegion.id === 'intl') {
      sum += 35000;
    } else if (selectedType.id === 'patent' && selectedRegion.id === 'intl') {
      sum += 70000;
    }

    // add classes price if it's trademark
    if (selectedType.id === 'tm' && classesCount > 1) {
      if (selectedRegion.id === 'intl') {
        sum += (classesCount - 1) * 3500;
      } else {
        sum += (classesCount - 1) * 1000; 
      }
    }

    setTotal(sum);
  }, [selectedType, selectedRegion, classesCount]);

  return (
    <div className="bg-white rounded-[32px] border border-[#E5E7EB] shadow-xl p-6 md:p-10 mb-16 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#EEF3FB] flex items-center justify-center">
          <Calculator className="w-6 h-6 text-[#1B3F7A]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#1B3F7A]">Онлайн-калькулятор стоимости</h2>
          <p className="text-[#6B7280] text-sm">Рассчитайте ориентировочную стоимость услуг</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Object Type */}
          <div>
            <label className="block text-sm font-bold text-[#1F2937] mb-3">Что нужно защитить?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {objectTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                    selectedType.id === type.id 
                      ? "border-[#3B82F6] bg-[#EEF3FB] shadow-[0_4px_15px_rgba(59,130,246,0.1)]" 
                      : "border-[#E5E7EB] bg-white hover:border-[#1B3F7A]/30"
                  )}
                >
                  <span className={cn(
                    "font-bold",
                    selectedType.id === type.id ? "text-[#1B3F7A]" : "text-[#475569]"
                  )}>{type.label}</span>
                  {selectedType.id === type.id && <Check className="w-5 h-5 text-[#3B82F6]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          {(selectedType.id === 'tm' || selectedType.id === 'patent') && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-[#1F2937] mb-3">Регион регистрации</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {regions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl border text-left transition-all",
                      selectedRegion.id === region.id 
                        ? "border-[#3B82F6] bg-[#EEF3FB] shadow-[0_4px_15px_rgba(59,130,246,0.1)]" 
                        : "border-[#E5E7EB] bg-white hover:border-[#1B3F7A]/30"
                    )}
                  >
                    <span className={cn(
                      "font-bold",
                      selectedRegion.id === region.id ? "text-[#1B3F7A]" : "text-[#475569]"
                    )}>{region.label}</span>
                    {selectedRegion.id === region.id && <Check className="w-5 h-5 text-[#3B82F6]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MKTU Classes */}
          {selectedType.id === 'tm' && (
            <div className="animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-bold text-[#1F2937] mb-3">Количество классов МКТУ: {classesCount}</label>
              <input 
                type="range" 
                min="1" 
                max="45" 
                value={classesCount}
                onChange={(e) => setClassesCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3B82F6]"
              />
              <div className="flex justify-between text-xs text-[#6B7280] mt-2">
                <span>1 класс</span>
                <span>45 классов</span>
              </div>
            </div>
          )}
        </div>

        {/* Total Summary Box */}
        <div className="bg-[#1B3F7A] text-white rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          
          <h3 className="text-lg font-medium text-white/80 mb-2">Итоговая стоимость от</h3>
          <div className="text-4xl sm:text-5xl font-black mb-6">
            {total.toLocaleString('ru-RU')} ₽
          </div>
          
          <div className="text-sm text-white/60 mb-8 space-y-2">
            <p>* Не является публичной офертой.</p>
            <p>* В стоимость включены услуги специалиста.</p>
            <p>* Государственные пошлины оплачиваются отдельно.</p>
          </div>
          
          <button 
            onClick={() => {
              const el = (sessionStorage.setItem('returnPos', window.scrollY.toString()), document.getElementById('contact'));
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full bg-[#C8A028] hover:bg-[#E8C050] text-white py-4 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(200,160,40,0.3)] hover:-translate-y-1 hover:shadow-[0_4px_25px_rgba(200,160,40,0.5)]"
          >
            Получить точный расчет
          </button>
        </div>
      </div>
    </div>
  );
}
