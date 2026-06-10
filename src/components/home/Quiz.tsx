import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Quiz() {
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
    if (step < 3) {
      setTimeout(() => setStep(step + 1), 300);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({});
  };

  const getRecommendation = () => {
    if (answers[1] === 'brand') return { title: 'Регистрация товарного знака', desc: 'Вам необходимо зарегистрировать обозначение в Роспатенте. Это обезопасит вас от копирования названия и даст возможность уверенно выйти на маркетплейсы.', link: '/services/tovarnye-znaki' };
    if (answers[1] === 'it') return { title: 'Регистрация программы ЭВМ', desc: 'Мы проведем аудит договоров с разработчиками и официально задепонируем исходный код в Роспатенте. Это защитит актив и поможет с вхождением в Реестр ПО.', link: '/services/programmy-evm' };
    if (answers[1] === 'product') return { title: 'Патентование', desc: 'В зависимости от уровня технического решения, вам подойдет патент на изобретение или полезную модель. Необходимо провести предварительный поиск на мировую новизну.', link: '/services/izobreteniya' };
    if (answers[1] === 'dispute') return { title: 'Оспаривание и защита', desc: 'Медлить нельзя. Необходим срочный аудит вашей ситуации для подготовки мотивированного ответа, претензии или обращения в суд (ФАС).', link: '/services/osparivanie' };
    return { title: 'Индивидуальная консультация', desc: 'Чтобы подобрать правильный юридический инструмент, необходимо уточнить детали вашей задачи. Оставьте заявку, и мы найдем решение.', link: '/contacts' };
  };

  return (
    <section className="py-24 bg-primary text-white relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] border border-white/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] border border-white/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Узнайте, что именно вам нужно защитить</h2>
          <p className="text-lg text-white/80">
            Ответьте на 2 вопроса и получите профессиональную рекомендацию юриста.
          </p>
        </div>

        <div className="bg-white text-ink rounded-2xl shadow-2xl p-8 md:p-12">
          {step <= 2 ? (
            <div>
              <div className="mb-8">
                <div className="flex justify-between text-sm font-bold text-[#6B7280] mb-2">
                  <span>Шаг {step} из 2</span>
                </div>
                <div className="w-full bg-[#F8F9FA] h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#C8A028] h-full transition-all duration-500 ease-out" 
                    style={{ width: `${(step / 2) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-primary mb-8">{questions[step - 1].title}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[step - 1].options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(questions[step - 1].id, opt.id)}
                    className="flex text-left items-center p-4 rounded-xl border-2 border-gray/10 hover:border-accent hover:bg-gold-bg/30 transition-all group"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-gray/30 group-hover:border-accent flex items-center justify-center mr-4 shrink-0 transition-colors">
                       <div className="w-3 h-3 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="font-medium text-primary group-hover:text-primary">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-gold-bg rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-10 h-10 text-accent" />
              </div>
              
              <h3 className="text-2xl font-bold text-primary mb-2">Рекомендуемое решение</h3>
              <h4 className="text-xl font-bold text-accent mb-6">{getRecommendation().title}</h4>
              
              <p className="text-ink/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                {getRecommendation().desc}
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => {
                    const recommendation = getRecommendation().title;
                    let initialMessage = '';
                    if (recommendation.includes('товарного знака')) {
                      initialMessage = "Вижу, что вам подходит регистрация товарного знака. Расскажите подробнее о вашем бренде — я помогу разобраться, что именно нужно защитить и с чего начать.";
                    } else if (recommendation.includes('изобретение') || recommendation.includes('Патент')) {
                      initialMessage = "Судя по вашим ответам, вам нужна патентная защита разработки. Опишите, что именно вы придумали — я помогу понять, подходит ли патент на изобретение или полезная модель.";
                    } else {
                      initialMessage = `Вижу, что вам подходит: ${recommendation}. Расскажите подробнее о вашей ситуации — я подскажу, какие документы нужны и с чего начать.`;
                    }
                    window.dispatchEvent(new CustomEvent('open-ai-bot', { detail: { initialMessage } }));
                  }}
                  type="button"
                  className="bg-[#1B3F7A] hover:bg-[#2960B0] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md group inline-flex items-center justify-center outline-none"
                >
                  Изучить решение
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={resetQuiz}
                  type="button"
                  className="text-[#6B7280] hover:text-[#1B3F7A] font-medium px-8 py-4 transition-colors outline-none"
                >
                  Пройти заново
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
