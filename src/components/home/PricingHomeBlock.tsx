import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Image as ImageIcon } from 'lucide-react';

export default function PricingHomeBlock() {
  return (
    <section id="pricing" className="py-32 bg-white relative overflow-hidden">
      {/* Ambient glowing backgrounds */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#1B3F7A]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 group">
          
          {/* Image Placeholder */}
          <div className="w-full lg:w-[55%] shrink-0">
             <div className="w-full aspect-[4/3] bg-[#F8F9FA] border border-[#E5E7EB] rounded-[32px] flex flex-col items-center justify-center text-[#6B7280] shadow-[0_20px_50px_rgba(0,0,0,0.05)] group-hover:shadow-[0_0_50px_rgba(59,130,246,0.15)] group-hover:border-[#3B82F6]/30 transition-all duration-700 relative overflow-hidden group/image">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#3B82F6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -inset-[100%] bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_3s_infinite] transition-opacity"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-24 h-24 bg-white rounded-3xl shadow-[0_10px_30px_rgba(27,63,122,0.08)] flex items-center justify-center mb-8 transition-transform group-hover/image:scale-110 group-hover/image:-rotate-3 duration-500">
                    <ImageIcon className="w-12 h-12 text-[#3B82F6]" />
                  </div>
                  <div className="text-lg font-black uppercase tracking-[0.2em] text-[#1B3F7A]">Иллюстрация процесса</div>
                  <div className="text-base mt-4 text-[#3B82F6] font-bold bg-white px-6 py-2.5 rounded-full shadow-sm border border-[#3B82F6]/20">Место для фото</div>
                </div>
             </div>
          </div>

          <div className="w-full lg:w-[45%] flex flex-col flex-1">
            <div className="inline-flex items-center space-x-2 text-[#C8A028] font-bold tracking-widest uppercase text-[13px] md:text-sm mb-8 bg-[#C8A028]/10 px-5 py-2.5 rounded-xl self-start border border-[#C8A028]/20 shadow-[0_0_20px_rgba(200,160,40,0.1)]">
               <Calculator className="w-5 h-5" />
               <span>Прозрачные условия</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl whitespace-nowrap font-black text-[#1B3F7A] mb-6 tracking-tight leading-tight shrink-0">Сколько стоят услуги?</h2>
            
            <p className="text-lg sm:text-xl text-[#6B7280] font-medium mb-10 leading-relaxed max-w-2xl">
              Мои гонорары фиксируются прозрачно до начала работ. Итоговая сумма зависит от:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
               <div className="flex items-center font-bold text-[#1F2937] bg-white px-5 py-4 rounded-xl border border-[#3B82F6]/60 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group/card">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3B82F6]/10 to-transparent -translate-x-full group-hover/card:animate-[shimmer_2s_infinite]"></div>
                 <div className="w-3 h-3 rounded-full bg-[#3B82F6] mr-4 shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
                 <span className="relative z-10 text-sm xl:text-base">Сложности объекта</span>
               </div>
               <div className="flex items-center font-bold text-[#1F2937] bg-white px-5 py-4 rounded-xl border border-[#3B82F6]/60 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group/card">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3B82F6]/10 to-transparent -translate-x-full group-hover/card:animate-[shimmer_2s_infinite]"></div>
                 <div className="w-3 h-3 rounded-full bg-[#3B82F6] mr-4 shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
                 <span className="relative z-10 text-sm xl:text-base">Количества классов</span>
               </div>
               <div className="flex items-center font-bold text-[#1F2937] bg-white px-5 py-4 rounded-xl border border-[#3B82F6]/60 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group/card">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3B82F6]/10 to-transparent -translate-x-full group-hover/card:animate-[shimmer_2s_infinite]"></div>
                 <div className="w-3 h-3 rounded-full bg-[#3B82F6] mr-4 shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
                 <span className="relative z-10 text-sm xl:text-base">Региона регистрации</span>
               </div>
               <div className="flex items-center font-bold text-[#1F2937] bg-white px-5 py-4 rounded-xl border border-[#3B82F6]/60 shadow-[0_0_20px_rgba(59,130,246,0.25)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] hover:border-[#3B82F6] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group/card">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3B82F6]/10 to-transparent -translate-x-full group-hover/card:animate-[shimmer_2s_infinite]"></div>
                 <div className="w-3 h-3 rounded-full bg-[#3B82F6] mr-4 shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
                 <span className="relative z-10 text-sm xl:text-base">Наличия препятствий</span>
               </div>
            </div>
            
            <div className="flex justify-center w-full mt-2">
              <Link 
                to="/pricing"
                className="inline-flex items-center justify-center bg-[#1B3F7A] hover:bg-[#3B82F6] text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-[0_10px_30px_rgba(27,63,122,0.2)] hover:shadow-[0_10px_40px_rgba(59,130,246,0.4)] hover:-translate-y-1 focus:outline-none w-full sm:w-auto group/btn relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                Подробнее о стоимости <ArrowRight className="w-6 h-6 ml-3 group-hover/btn:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
