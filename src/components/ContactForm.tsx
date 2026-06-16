import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useData } from '../store/DataContext';

const formTypes = [
  { id: 'general', label: 'Общий вопрос' },
  { id: 'tm', label: 'Защита бренда' },
  { id: 'it', label: 'IT и программы' },
  { id: 'dispute', label: 'Спор / Претензия' },
];

const emptyForm = {
  name: '', contact: '', task: '', brand: '', business: '',
  sales: '', geo: '', product: '', dev: '', contracts: '',
  disputeType: '', deadline: '',
};

const inputCls = "w-full px-4 py-3 bg-cream border border-gray/20 rounded-lg focus:ring-2 focus:ring-accent outline-none transition-all";
const labelCls = "block text-sm font-bold text-ink mb-1";

export default function ContactForm() {
  const { addLead } = useData();
  const [activeForm, setActiveForm] = useState<'general' | 'tm' | 'it' | 'dispute'>('general');
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const set = (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let taskDesc = formData.task;
    if (activeForm === 'tm') {
      taskDesc = `ТЗ: Бренд "${formData.brand}", Бизнес: ${formData.business}, Продажи: ${formData.sales}, Гео: ${formData.geo}`;
    } else if (activeForm === 'it') {
      taskDesc = `IT: Продукт "${formData.product}", Разработчик: ${formData.dev}, Договоры: ${formData.contracts}, Задача: ${formData.task}`;
    } else if (activeForm === 'dispute') {
      taskDesc = `Спор: Ситуация "${formData.disputeType}", Дедлайн: ${formData.deadline}`;
    }
    addLead({
      name: formData.name || 'Без имени',
      contact: formData.contact,
      task: taskDesc,
      source: `Страница контактов / Форма: ${activeForm}`,
      status: 'new',
      comment: '',
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gold-bg rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-10 h-10 text-accent" />
        </div>
        <h3 className="text-3xl font-bold text-primary mb-4">Заявка успешно отправлена</h3>
        <p className="text-ink/80 text-lg mb-8 max-w-md mx-auto">
          Спасибо за обращение. Я внимательно изучу вашу задачу и свяжусь с вами в ближайшее время по указанным контактам.
        </p>
        <button
          onClick={() => { setIsSubmitted(false); setFormData(emptyForm); }}
          className="text-primary font-bold hover:text-accent underline underline-offset-4 transition-colors"
        >
          Отправить еще одно сообщение
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-primary mb-6">Описать задачу подробно</h2>

      <div className="flex flex-wrap gap-2 mb-8 bg-cream p-1 rounded-xl w-fit">
        {formTypes.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveForm(t.id as typeof activeForm)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-bold transition-all",
              activeForm === t.id ? "bg-white text-primary shadow-sm" : "text-gray hover:text-primary"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Ваше имя</label>
            <input type="text" required value={formData.name} onChange={set('name')} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Телефон / Telegram</label>
            <input type="text" required value={formData.contact} onChange={set('contact')} className={inputCls} />
          </div>
        </div>

        {activeForm === 'general' && (
          <div>
            <label className={labelCls}>Описание задачи</label>
            <textarea required rows={4} value={formData.task} onChange={set('task')} className={`${inputCls} resize-none`} />
          </div>
        )}

        {activeForm === 'tm' && (
          <>
            <div>
              <label className={labelCls}>Название бренда / Логотип</label>
              <input type="text" required value={formData.brand} onChange={set('brand')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Чем занимается бизнес (что продаете)?</label>
              <input type="text" required value={formData.business} onChange={set('business')} className={inputCls} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Продажи уже идут?</label>
                <select required value={formData.sales} onChange={set('sales')} className={inputCls}>
                  <option value="">Выберите...</option>
                  <option value="Да">Да</option>
                  <option value="Выходим на маркетплейс">Выходим на маркетплейс</option>
                  <option value="Только планируем">Только планируем</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Где планируется регистрация?</label>
                <select required value={formData.geo} onChange={set('geo')} className={inputCls}>
                  <option value="">Выберите...</option>
                  <option value="Только РФ">Только РФ</option>
                  <option value="РФ + СНГ (экспорт)">РФ + СНГ (экспорт)</option>
                  <option value="Международная">Международная</option>
                </select>
              </div>
            </div>
          </>
        )}

        {activeForm === 'it' && (
          <>
            <div>
              <label className={labelCls}>Название продукта / программы</label>
              <input type="text" required value={formData.product} onChange={set('product')} className={inputCls} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Кто разрабатывал?</label>
                <select required value={formData.dev} onChange={set('dev')} className={inputCls}>
                  <option value="">Выберите...</option>
                  <option value="Штатные сотрудники">Штатные сотрудники</option>
                  <option value="Фрилансеры / Подрядчики">Фрилансеры / Подрядчики</option>
                  <option value="Сам написал">Сам написал</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Есть ли договоры?</label>
                <select required value={formData.contracts} onChange={set('contracts')} className={inputCls}>
                  <option value="">Выберите...</option>
                  <option value="Да, всё оформлено">Да, всё оформлено</option>
                  <option value="Частично">Частично</option>
                  <option value="Нет / Не знаю">Нет / Не знаю</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Что требуется в итоге?</label>
              <textarea required rows={2} value={formData.task} onChange={set('task')} className={`${inputCls} resize-none`} />
            </div>
          </>
        )}

        {activeForm === 'dispute' && (
          <>
            <div>
              <label className={labelCls}>Что случилось (суть претензии)?</label>
              <textarea required rows={3} value={formData.disputeType} onChange={set('disputeType')} className={`${inputCls} resize-none`} placeholder="Укажите, кто кому предъявляет претензию..." />
            </div>
            <div>
              <label className={labelCls}>Когда дедлайн по ответу?</label>
              <input type="text" required value={formData.deadline} onChange={set('deadline')} className={inputCls} placeholder="Например: до 15 мая или 'срочно'" />
            </div>
          </>
        )}

        <div className="pt-4">
          <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition-all text-lg shadow-[0_4px_14px_0_rgba(27,63,122,0.39)] hover:shadow-[0_6px_20px_rgba(27,63,122,0.23)] hover:-translate-y-0.5 mt-2 flex justify-center items-center">
            Отправить запрос
          </button>
          <div className="flex items-start mt-4">
            <input id="privacy2" type="checkbox" required className="mt-1 bg-white border-gray text-accent focus:ring-accent w-4 h-4 rounded shrink-0 cursor-pointer" />
            <label htmlFor="privacy2" className="ml-2 block text-xs text-gray/80 leading-relaxed cursor-pointer">
              Нажимая кнопку, вы даете согласие на обработку персональных данных в соответствии с{' '}
              <Link to="/privacy" className="underline hover:text-primary">Политикой конфиденциальности</Link>.
            </label>
          </div>
        </div>
      </form>
    </>
  );
}
