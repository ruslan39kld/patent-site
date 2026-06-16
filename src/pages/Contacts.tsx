import { useData } from '../store/DataContext';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function Contacts() {
  const { state } = useData();

  return (
    <div className="bg-cream min-h-screen">
      <section className="pt-20 pb-16 bg-white border-b border-gray/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/10 -skew-x-12 transform translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Контакты</h1>
          <p className="text-xl text-ink/80 leading-relaxed max-w-2xl">
            Свяжитесь со мной напрямую удобным для вас способом или оставьте заявку через форму — я отвечу в течение рабочего дня.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-primary text-white rounded-2xl p-8 lg:p-10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-bl-full opacity-50"></div>

                <div className="space-y-8 relative z-10">
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-accent mt-1 mr-4 shrink-0" />
                    <div>
                      <div className="text-sm text-white/70 mb-1">Телефон</div>
                      <a href={`tel:${state.content.phone.replace(/[^+\d]/g, '')}`} className="text-2xl font-bold hover:text-accent transition-colors">{state.content.phone}</a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="w-6 h-6 text-accent mt-1 mr-4 shrink-0" />
                    <div>
                      <div className="text-sm text-white/70 mb-1">Email</div>
                      <a href={`mailto:${state.content.email}`} className="text-xl font-bold hover:text-accent transition-colors">{state.content.email}</a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-accent mt-1 mr-4 shrink-0" />
                    <div>
                      <div className="text-sm text-white/70 mb-1">Время ответа</div>
                      <div className="text-lg font-bold">Пн-Пт: 10:00 - 19:00 (МСК)</div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex gap-4 relative z-10">
                  <a href={state.content.whatsapp} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-opacity">
                    <MessageCircle className="w-5 h-5 mr-2" /> WhatsApp
                  </a>
                  <a href={state.content.telegram} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#2AABEE] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-opacity">
                    <Send className="w-5 h-5 mr-2" /> Telegram
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray/10 shadow-sm">
                <div className="flex items-start mb-4">
                  <MapPin className="w-6 h-6 text-primary mt-1 mr-4 shrink-0" />
                  <div>
                    <h3 className="font-bold text-primary text-xl mb-2">Работаю по всей РФ</h3>
                    <p className="text-ink/80 leading-relaxed">
                      Для оказания услуг патентного поверенного личная встреча не требуется. Всё взаимодействие с клиентами и Роспатентом происходит через защищенные электронные каналы связи.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-2xl p-8 lg:p-12 border border-gray/10 shadow-lg">
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
