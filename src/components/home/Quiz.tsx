import { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, FileBadge } from 'lucide-react';

import { useData } from '../../store/DataContext';

export default function Quiz() {
  const { state } = useData();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    {
      id: 1,
      title: 'Что именно вы хотите защитить?',
      options: [
        { id: 'brand', label: 'Название или логотип' },
        { id: 'product', label: 'Техническое устройство / механизм' },
        { id: 'design', label: 'Дизайн или упаковку' },
        { id: 'it', label: 'Программу, приложение, сайт' },
        { id: 'content', label: 'Курс, методику, текст' },
        { id: 'dispute', label: 'Уже есть конфликт / нарушены права' },
      ]
    },
    {
      id: 2,
      title: 'На каком этапе находится ваш проект?',
      options: [
        { id: 'idea', label: 'Только планирую запуск' },
        { id: 'active', label: 'Уже продаю товар / оказываю услуги' },
        { id: 'scale', label: 'Планирую выход на маркетплейсы или экспорт' },
        { id: 'invest', label: 'Привлекаю инвестиции' },
      ]
    }
  ];

  const handleSelect = (questionId: number, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({});
  };

  const getRecommendation = () => {
    if (answers[1] === 'brand') return { title: 'Регистрация товарного знака', desc: 'Вам необходимо зарегистрировать обозначение в Роспатенте. Это обезопасит вас от копирования названия и даст возможность уверенно выйти на маркетплейсы.' };
    if (answers[1] === 'it') return { title: 'Регистрация программы ЭВМ', desc: 'Мы проведем аудит договоров с разработчиками и официально задепонируем исходный код в Роспатенте. Это защитит актив и поможет с вхождением в Реестр ПО.' };
    if (answers[1] === 'product') return { title: 'Патентование', desc: 'В зависимости от уровня технического решения, вам подойдет патент на изобретение или полезную модель. Необходимо провести предварительный поиск на мировую новизну.' };
    if (answers[1] === 'dispute') return { title: 'Оспаривание и защита', desc: 'Медлить нельзя. Необходим срочный аудит вашей ситуации для подготовки мотивированного ответа, претензии или обращения в суд (ФАС).' };
    return { title: 'Индивидуальная консультация', desc: 'Чтобы подобрать правильный юридический инструмент, необходимо уточнить детали вашей задачи. Оставьте заявку, и мы найдем решение.' };
  };

  return (
    <section id="quiz" className="py-24 bg-[#FFF8E8] relative overflow-hidden border-t border-[#F3F4F6]">
      {/* Decorative Blur Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3B82F6]/10 rounded-full blur-[150px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[150px] pointer-events-none transform -translate-x-1/3 translate-y-1/3"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 text-[#3B82F6] font-bold tracking-widest uppercase text-xs mb-6 bg-[#3B82F6]/5 px-4 py-2 rounded-xl border border-[#3B82F6]/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
             <span>{state.content?.quizTag || 'Подбор решения'}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-6 tracking-tight">{state.content?.quizTitle || 'Какой вид защиты вам нужен?'}</h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto font-medium">
            {state.content?.quizSubtitle || 'Ответьте на 2 вопроса и получите профессиональную рекомендацию юриста по защите интеллектуальной собственности.'}
          </p>
        </div>

        <div className="bg-white/80 border border-[#3B82F6]/50 rounded-[32px] shadow-[0_0_50px_rgba(59,130,246,0.2),inset_0_0_20px_rgba(59,130,246,0.05)] md:p-14 p-8 relative overflow-hidden backdrop-blur-xl">
          {/* Tech Neon Inner Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15)_0%,transparent_60%)] pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent opacity-50"></div>
          
          {step <= 2 ? (
            <div className="relative z-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-10">
                <div className="flex justify-between items-center text-sm font-bold text-[#1B3F7A] mb-4">
                  <span className="uppercase tracking-widest">Шаг {step} из 2</span>
                  <span className="text-[#3B82F6] text-lg font-black">{Math.round((step / 2) * 100)}%</span>
                </div>
                <div className="w-full bg-[#1B3F7A]/5 h-3 rounded-full overflow-hidden shadow-inner flex">
                  <div 
                    className="bg-gradient-to-r from-[#1B3F7A] via-[#2563EB] to-[#3B82F6] h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)] relative" 
                    style={{ width: `${(step / 2) * 100}%` }}
                  >
                     <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-[#1F2937] mb-10 tracking-tight">{questions[step - 1].title}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
                {questions[step - 1].options.map((opt) => {
                  const isSelected = answers[questions[step - 1].id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(questions[step - 1].id, opt.id)}
                      className={`flex text-left items-center p-6 rounded-2xl transition-all duration-300 group relative overflow-hidden outline-none ${
                        isSelected 
                          ? 'bg-[#3B82F6]/5 border-2 border-[#3B82F6] shadow-[0_0_25px_rgba(59,130,246,0.2)] scale-[1.02]' 
                          : 'bg-white border-2 border-[#E5E7EB] hover:border-[#3B82F6]/50 hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)] hover:-translate-y-1'
                      }`}
                    >
                      {isSelected && (
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)] pointer-events-none"></div>
                      )}
                      <div className={`w-7 h-7 rounded-full border-[2.5px] flex items-center justify-center mr-5 shrink-0 transition-all duration-300 relative ${
                        isSelected ? 'border-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.4)]' : 'border-[#D1D5DB] group-hover:border-[#3B82F6]/50'
                      }`}>
                         <div className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${
                           isSelected ? 'bg-[#3B82F6] scale-100 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-[#3B82F6] scale-0'
                         }`}></div>
                      </div>
                      <span className={`text-[17px] leading-snug transition-colors ${isSelected ? 'text-[#1B3F7A] font-black' : 'text-[#4B5563] font-semibold'}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-8 border-t border-[#1B3F7A]/10">
                <button
                  onClick={handlePrev}
                  disabled={step === 1}
                  className={`flex items-center px-6 py-4 font-bold rounded-xl transition-all outline-none ${
                    step === 1 
                      ? 'text-[#9CA3AF] cursor-not-allowed opacity-50' 
                      : 'text-[#1B3F7A] bg-[#1B3F7A]/5 hover:bg-[#1B3F7A]/10'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5 mr-no font-bold -ml-1 mr-2" />
                  Назад
                </button>

                <button
                  onClick={handleNext}
                  disabled={!answers[questions[step - 1].id]}
                  className={`flex items-center px-10 py-4 font-bold rounded-xl transition-all shadow-md outline-none ${
                    !answers[questions[step - 1].id]
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : 'bg-gradient-to-r from-[#1B3F7A] to-[#3B82F6] hover:from-[#1e40af] hover:to-[#2563EB] text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:-translate-y-1'
                  }`}
                >
                  {step === 2 ? 'Показать результат' : 'Далее'}
                  {step !== 2 && <ArrowRight className="w-5 h-5 ml-2 -mr-1" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-500 relative z-10 w-full flex flex-col items-center">
              {/* Neon Result Icon */}
              <div className="w-28 h-28 bg-gradient-to-br from-[#1B3F7A] to-[#3B82F6] rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(59,130,246,0.4)] relative">
                 <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
                 <CheckCircle2 className="w-14 h-14 text-white" />
              </div>
              
              <div className="inline-flex items-center space-x-2 text-[#3B82F6] font-bold tracking-widest uppercase text-xs mb-4 bg-[#3B82F6]/5 px-4 py-2 rounded-xl border border-[#3B82F6]/30">
                 <span>Рекомендуемое решение</span>
              </div>
              
              <h4 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-8 relative">
                 {getRecommendation().title}
                 {/* Underline neon glow */}
                 <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent blur-[2px]"></div>
                 <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-white"></div>
              </h4>
              
              <div className="bg-[#1B3F7A]/5 border border-[#3B82F6]/20 rounded-2xl p-8 mb-12 max-w-2xl mx-auto shadow-inner">
                <p className="text-[#1F2937] leading-relaxed font-semibold text-lg">
                  {getRecommendation().desc}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 w-full max-w-xl mx-auto">
                <button 
                  onClick={() => {
                     const taskTitle = getRecommendation().title;
                     window.dispatchEvent(new CustomEvent('fill-contact-form', { detail: { task: `Нужна помощь по: ${taskTitle}\nОбращение по итогам квиза.` } }));
                     document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  type="button"
                  className="bg-gradient-to-r from-[#3B82F6] to-[#1B3F7A] hover:from-[#2563EB] hover:to-[#1e40af] text-white font-bold px-10 py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] flex items-center justify-center text-lg w-full sm:w-auto relative overflow-hidden group outline-none"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] opacity-0 group-hover:opacity-100 group-hover:animate-[shimmer_3s_infinite] transition-opacity"></div>
                  <span className="relative z-10">Оставить заявку</span>
                  <ChevronRight className="w-6 h-6 ml-2 relative z-10" />
                </button>
                <button 
                  onClick={resetQuiz}
                  type="button"
                  className="text-[#1B3F7A] hover:bg-[#1B3F7A]/10 font-bold px-8 py-5 transition-colors flex items-center bg-[#1B3F7A]/5 border border-[#1B3F7A]/10 rounded-xl w-full sm:w-auto justify-center text-lg outline-none"
                >
                  Начать заново
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

