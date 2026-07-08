import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Lock, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Privacy() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'privacy' | 'processing' | 'consent'>('privacy');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden pb-24">
      {/* Abstract dark blue & neon patterns for background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#3B82F6]/15 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-1/2 left-0 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[120px] pointer-events-none transform -translate-x-1/3"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-[#3B82F6] font-medium hover:text-[#1B3F7A] transition-colors mb-8 bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm border border-[#3B82F6]/20 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]">
          <ArrowLeft className="w-5 h-5 mr-2" /> Назад
        </button>

        {/* Header Title with Neon Glow */}
        <div className="mb-8 relative">
           <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-32 bg-[#3B82F6]/20 blur-[120px] rounded-full pointer-events-none"></div>
           <h1 className="text-4xl md:text-5xl font-black text-[#1B3F7A] relative z-10 tracking-tight uppercase flex items-center">
             <div className="w-12 h-12 mr-4 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-[#3B82F6]/30">
               <Shield className="w-7 h-7 text-[#3B82F6]" />
             </div>
             ПОЛИТИКА БЕЗОПАСНОСТИ
           </h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-col md:flex-row gap-2 mb-12 bg-white/50 p-2 rounded-2xl border border-[#3B82F6]/20 shadow-[0_0_20px_rgba(59,130,246,0.05)] backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('privacy')}
            className={cn(
              "flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300",
              activeTab === 'privacy' 
                ? "bg-white text-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.15)] border border-[#3B82F6]/20" 
                : "text-[#6B7280] hover:text-[#1B3F7A] hover:bg-white/50"
            )}
          >
            <Lock className="w-4 h-4 mr-2" />
            Политика конфиденциальности
          </button>
          <button
            onClick={() => setActiveTab('processing')}
            className={cn(
              "flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300",
              activeTab === 'processing' 
                ? "bg-white text-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.15)] border border-[#3B82F6]/20" 
                : "text-[#6B7280] hover:text-[#1B3F7A] hover:bg-white/50"
            )}
          >
            <FileText className="w-4 h-4 mr-2" />
            Обработка данных
          </button>
          <button
            onClick={() => setActiveTab('consent')}
            className={cn(
              "flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300",
              activeTab === 'consent' 
                ? "bg-white text-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.15)] border border-[#3B82F6]/20" 
                : "text-[#6B7280] hover:text-[#1B3F7A] hover:bg-white/50"
            )}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Согласие
          </button>
        </div>

        <div className="space-y-12 min-h-[60vh]">
          {/* Section 1 */}
          <div className={cn(
            "bg-white/80 border border-[#3B82F6]/20 rounded-[24px] p-8 md:p-12 shadow-[0_0_40px_rgba(59,130,246,0.05)] backdrop-blur-xl relative overflow-hidden group transition-all duration-500",
            activeTab === 'privacy' ? "opacity-100 translate-y-0" : "opacity-0 hidden translate-y-4"
          )}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05)_0%,transparent_60%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h2 className="text-2xl font-bold text-[#1B3F7A] mb-8 pb-4 border-b border-[#3B82F6]/20 relative">
              <span className="relative z-10">ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</span>
              <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#3B82F6] to-transparent"></div>
            </h2>
            
            <div className="space-y-6 text-[#4B5563] leading-relaxed relative z-10 markdown-body">
              <h3 className="text-lg font-bold text-[#1F2937]">1. Общие положения</h3>
              <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты информации о физических и юридических лицах, использующих сайт патентного поверенного Российской Федерации №1558 Тарасовой Виктории Николаевны (далее — «Оператор»).</p>
              <p>Использование сайта означает согласие пользователя с условиями настоящей Политики конфиденциальности.</p>
              <p>Если пользователь не согласен с условиями настоящей Политики, он должен прекратить использование сайта.</p>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">2. Информация, которую получает Оператор</h3>
              <p>Оператор может получать следующую информацию о пользователях:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>фамилия, имя, отчество;</li>
                <li>номер телефона;</li>
                <li>адрес электронной почты;</li>
                <li>сведения, содержащиеся в обращениях и сообщениях;</li>
                <li>сведения, предоставляемые через формы обратной связи;</li>
                <li>IP-адрес;</li>
                <li>данные браузера и устройства;</li>
                <li>файлы cookie;</li>
                <li>технические данные о посещении сайта.</li>
              </ul>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">3. Цели сбора информации</h3>
              <p>Информация пользователя используется в целях:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>предоставления консультаций;</li>
                <li>обработки обращений и заявок;</li>
                <li>связи с пользователем;</li>
                <li>оказания юридических услуг;</li>
                <li>подготовки документов;</li>
                <li>улучшения качества работы сайта;</li>
                <li>обеспечения безопасности сайта;</li>
                <li>соблюдения требований законодательства Российской Федерации.</li>
              </ul>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">4. Конфиденциальность информации</h3>
              <p>Оператор принимает необходимые организационные и технические меры для защиты персональных данных и иной конфиденциальной информации пользователей.</p>
              <p>Информация пользователей не подлежит разглашению третьим лицам, за исключением случаев:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>предусмотренных законодательством Российской Федерации;</li>
                <li>необходимых для исполнения договора;</li>
                <li>осуществляемых с согласия пользователя.</li>
              </ul>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">5. Использование файлов cookie</h3>
              <p>Сайт может использовать файлы cookie для:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>корректной работы сайта;</li>
                <li>анализа посещаемости;</li>
                <li>улучшения пользовательского опыта;</li>
                <li>сохранения пользовательских настроек.</li>
              </ul>
              <p>Пользователь вправе ограничить или отключить использование cookie в настройках своего браузера.</p>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">6. Передача информации третьим лицам</h3>
              <p>Оператор не продает и не передает персональные данные пользователей третьим лицам, кроме случаев, предусмотренных законодательством Российской Федерации или необходимых для функционирования сайта и оказания услуг.</p>
              
              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>
              
              <h3 className="text-lg font-bold text-[#1F2937]">7. Ссылки на сторонние ресурсы</h3>
              <p>Сайт может содержать ссылки на сторонние интернет-ресурсы. Оператор не несет ответственности за содержание и политику конфиденциальности таких ресурсов.</p>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">8. Защита информации</h3>
              <p>Оператор принимает разумные меры для защиты информации пользователей от:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>неправомерного доступа;</li>
                <li>уничтожения;</li>
                <li>изменения;</li>
                <li>блокирования;</li>
                <li>распространения;</li>
                <li>иных неправомерных действий.</li>
              </ul>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">9. Права пользователя</h3>
              <p>Пользователь вправе:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>получать информацию об обработке своих данных;</li>
                <li>требовать уточнения или удаления данных;</li>
                <li>отозвать согласие на обработку персональных данных;</li>
                <li>обратиться к Оператору по вопросам обработки информации.</li>
              </ul>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">10. Изменение Политики конфиденциальности</h3>
              <p>Оператор вправе изменять настоящую Политику конфиденциальности без предварительного уведомления пользователей.</p>
              <p>Актуальная редакция Политики размещается на сайте.</p>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">11. Контактная информация</h3>
              <p>Патентный поверенный Российской Федерации №1558 Тарасова Виктория Николаевна</p>
              <p>Контактная информация размещается на официальном сайте.</p>
            </div>
          </div>

          {/* Section 2 */}
          <div className={cn(
            "bg-white/80 border border-[#3B82F6]/20 rounded-[24px] p-8 md:p-12 shadow-[0_0_40px_rgba(59,130,246,0.05)] backdrop-blur-xl relative overflow-hidden group transition-all duration-500",
            activeTab === 'processing' ? "opacity-100 translate-y-0" : "opacity-0 hidden translate-y-4"
          )}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05)_0%,transparent_60%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <h2 className="text-2xl font-bold text-[#1B3F7A] mb-8 pb-4 border-b border-[#3B82F6]/20 relative">
              <span className="relative z-10">ПОЛИТИКА ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ</span>
              <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#3B82F6] to-transparent"></div>
            </h2>
            
            <div className="space-y-6 text-[#4B5563] leading-relaxed relative z-10 markdown-body">
              <h3 className="text-lg font-bold text-[#1F2937]">1. Общие положения</h3>
              <p>Настоящая Политика обработки персональных данных разработана в соответствии с требованиями Федерального закона от 27.07.2006 №152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, осуществляемые патентным поверенным Российской Федерации №1558 Тарасовой Викторией Николаевной (далее — «Оператор»).</p>
              <p>Настоящая Политика применяется ко всей информации, которую Оператор может получить о пользователях сайта при использовании сайта, сервисов, форм обратной связи, мессенджеров и иных способов взаимодействия.</p>
              <p>Использование сайта означает согласие пользователя с настоящей Политикой и условиями обработки его персональных данных.</p>
              
              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">2. Основные понятия</h3>
              <p>В настоящей Политике используются следующие понятия:</p>
              <p><strong>Персональные данные</strong> — любая информация, относящаяся прямо или косвенно к определенному или определяемому физическому лицу.</p>
              <p><strong>Обработка персональных данных</strong> — любое действие или совокупность действий, совершаемых с использованием средств автоматизации или без их использования с персональными данными.</p>
              <p><strong>Оператор</strong> — лицо, организующее и осуществляющее обработку персональных данных.</p>
              <p><strong>Пользователь</strong> — любое лицо, посетившее сайт Оператора.</p>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">3. Персональные данные, обрабатываемые Оператором</h3>
              <p>Оператор может обрабатывать следующие персональные данные пользователей:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>фамилия, имя, отчество;</li>
                <li>номер телефона;</li>
                <li>адрес электронной почты;</li>
                <li>сведения, содержащиеся в обращениях пользователя;</li>
                <li>данные, предоставленные пользователем при заполнении форм на сайте;</li>
                <li>IP-адрес;</li>
                <li>сведения о браузере и устройстве пользователя;</li>
                <li>файлы cookie;</li>
                <li>иные данные, добровольно предоставленные пользователем.</li>
              </ul>
              <p>Оператор не осуществляет обработку специальных категорий персональных данных, касающихся расовой принадлежности, политических взглядов, религиозных убеждений, состояния здоровья и иных данных, обработка которых ограничена законодательством РФ.</p>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">4. Цели обработки персональных данных</h3>
              <p>Персональные данные пользователей обрабатываются в следующих целях:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>предоставление консультаций;</li>
                <li>обработка обращений и заявок;</li>
                <li>заключение и исполнение договоров;</li>
                <li>связь с пользователем;</li>
                <li>предоставление информации об услугах;</li>
                <li>направление ответов на запросы;</li>
                <li>выполнение требований законодательства Российской Федерации;</li>
                <li>улучшение качества работы сайта;</li>
                <li>обеспечение безопасности сайта.</li>
              </ul>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">5. Правовые основания обработки персональных данных</h3>
              <p>Правовыми основаниями обработки персональных данных являются:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>согласие субъекта персональных данных;</li>
                <li>положения Федерального закона №152-ФЗ «О персональных данных»;</li>
                <li>иные нормативные правовые акты Российской Федерации;</li>
                <li>заключение и исполнение договоров;</li>
                <li>законные интересы Оператора.</li>
              </ul>

              <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

              <h3 className="text-lg font-bold text-[#1F2937]">6. Порядок обработки персональных данных</h3>
              <p>Обработка персональных данных осуществляется с соблюдением принципов и правил, предусмотренных законодательством Российской Федерации.</p>
              <p>Оператор осуществляет следующие действия с персональными данными:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>сбор;</li>
                <li>запись;</li>
                <li>систематизация;</li>
                <li>накопление;</li>
                <li>хранение;</li>
                <li>уточнение;</li>
                <li>использование;</li>
                <li>передача в случаях, предусмотренных законодательством;</li>
                <li>обезличивание;</li>
                <li>блокирование;</li>
                <li>удаление;</li>
                <li>уничтожение.</li>
              </ul>
              <p>Обработка персональных данных может осуществляться как с использованием средств автоматизации, так и без их использования.</p>

               <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

               <h3 className="text-lg font-bold text-[#1F2937]">7. Срок хранения персональных данных</h3>
               <p>Персональные данные хранятся не дольше, чем этого требуют цели обработки персональных данных, если иной срок хранения не установлен законодательством Российской Федерации.</p>
               <p>После достижения целей обработки либо в случае отзыва согласия субъектом персональных данных персональные данные подлежат удалению или уничтожению, если иное не предусмотрено законодательством РФ.</p>

               <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

               <h3 className="text-lg font-bold text-[#1F2937]">8. Передача персональных данных третьим лицам</h3>
               <p>Оператор не передает персональные данные третьим лицам, за исключением следующих случаев:</p>
               <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                 <li>наличие согласия субъекта персональных данных;</li>
                 <li>необходимость исполнения договора;</li>
                 <li>требования законодательства Российской Федерации;</li>
                 <li>передача сервисам, обеспечивающим работу сайта, при соблюдении требований законодательства о персональных данных.</li>
               </ul>

               <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

               <h3 className="text-lg font-bold text-[#1F2937]">9. Права субъекта персональных данных</h3>
               <p>Пользователь имеет право:</p>
               <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                 <li>получать сведения об обработке своих персональных данных;</li>
                 <li>требовать уточнения персональных данных;</li>
                 <li>требовать блокирования или уничтожения персональных данных;</li>
                 <li>отозвать согласие на обработку персональных данных;</li>
                 <li>обжаловать действия Оператора в уполномоченные органы или в судебном порядке.</li>
               </ul>

               <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

               <h3 className="text-lg font-bold text-[#1F2937]">10. Меры по защите персональных данных</h3>
               <p>Оператор принимает необходимые правовые, организационные и технические меры для защиты персональных данных от неправомерного доступа, изменения, раскрытия, уничтожения и иных неправомерных действий.</p>

               <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

               <h3 className="text-lg font-bold text-[#1F2937]">11. Использование файлов cookie</h3>
               <p>Сайт может использовать файлы cookie и иные технологии сбора информации для обеспечения корректной работы сайта, анализа пользовательской активности и повышения качества сервиса.</p>
               <p>Пользователь может изменить настройки использования cookie в своем браузере.</p>

               <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

               <h3 className="text-lg font-bold text-[#1F2937]">12. Заключительные положения</h3>
               <p>Оператор вправе вносить изменения в настоящую Политику без предварительного уведомления пользователей.</p>
               <p>Актуальная версия Политики размещается на сайте Оператора.</p>
               <p>По вопросам, связанным с обработкой персональных данных, пользователь может обратиться к Оператору через контактные данные, указанные на сайте.</p>

               <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/20 to-transparent"></div>

               <h3 className="text-lg font-bold text-[#1F2937]">13. Сведения об Операторе</h3>
               <p>Патентный поверенный Российской Федерации №1558 Тарасова Виктория Николаевна</p>
               <p>Контактные данные размещаются на сайте Оператора.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className={cn(
            "bg-white/80 border border-[#3B82F6]/20 rounded-[24px] p-8 md:p-12 shadow-[0_0_40px_rgba(59,130,246,0.05)] backdrop-blur-xl relative overflow-hidden group transition-all duration-500",
            activeTab === 'consent' ? "opacity-100 translate-y-0" : "opacity-0 hidden translate-y-4"
          )}>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.05)_0%,transparent_60%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <h2 className="text-2xl font-bold text-[#1B3F7A] mb-8 pb-4 border-b border-[#3B82F6]/20 relative">
              <span className="relative z-10">СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ</span>
              <div className="absolute bottom-0 left-0 w-1/4 h-[2px] bg-gradient-to-r from-[#3B82F6] to-transparent"></div>
            </h2>

            <div className="space-y-6 text-[#4B5563] leading-relaxed relative z-10 markdown-body">
              <p>Настоящим, оставляя заявку, направляя сообщение, заполняя форму обратной связи на сайте либо иным образом предоставляя свои персональные данные, пользователь свободно, своей волей и в своем интересе выражает согласие патентному поверенному Российской Федерации №1558 Тарасовой Виктории Николаевне (далее — «Оператор») на обработку своих персональных данных в соответствии с Федеральным законом от 27.07.2006 №152-ФЗ «О персональных данных».</p>
              
              <p>Пользователь подтверждает свое согласие на обработку следующих персональных данных:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>фамилия, имя, отчество;</li>
                <li>номер телефона;</li>
                <li>адрес электронной почты;</li>
                <li>сведения, содержащиеся в обращении;</li>
                <li>иные данные, добровольно предоставленные пользователем.</li>
              </ul>
              
              <p>Обработка персональных данных осуществляется в целях:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>предоставления консультаций;</li>
                <li>обработки обращений и заявок;</li>
                <li>связи с пользователем;</li>
                <li>оказания юридических услуг;</li>
                <li>подготовки и исполнения договоров;</li>
                <li>направления ответов на запросы;</li>
                <li>соблюдения требований законодательства Российской Федерации.</li>
              </ul>

              <p>Пользователь предоставляет согласие на совершение следующих действий с персональными данными:</p>
              <ul className="list-disc pl-6 space-y-2 marker:text-[#3B82F6]">
                <li>сбор;</li>
                <li>запись;</li>
                <li>систематизация;</li>
                <li>накопление;</li>
                <li>хранение;</li>
                <li>уточнение;</li>
                <li>использование;</li>
                <li>передача в случаях, предусмотренных законодательством;</li>
                <li>обезличивание;</li>
                <li>блокирование;</li>
                <li>удаление;</li>
                <li>уничтожение.</li>
              </ul>

              <p>Обработка персональных данных может осуществляться как с использованием средств автоматизации, так и без их использования.</p>
              <p>Настоящее согласие действует бессрочно до момента его отзыва пользователем.</p>
              <p>Пользователь вправе отозвать настоящее согласие путем направления соответствующего уведомления Оператору по контактным данным, указанным на сайте.</p>
              <p>В случае отзыва согласия Оператор вправе продолжить обработку персональных данных без согласия пользователя при наличии оснований, предусмотренных законодательством Российской Федерации.</p>
              <p>Пользователь подтверждает, что ознакомлен с Политикой обработки персональных данных и Политикой конфиденциальности, размещенными на сайте.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
