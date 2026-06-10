import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';

const allPosts = [
  { slug: "kak-zaregistrirovat-tovarnyj-znak-v-rospatente-poshagovaya-instrukciya", title: "Как зарегистрировать товарный знак в Роспатенте: пошаговая инструкция 2025", category: "Товарные знаки", date: "15 Марта 2024", excerpt: "Подробное руководство по регистрации бренда: от проверки названия до получения свидетельства. Сроки, этапы, стоимость и подводные камни." },
  { slug: "izobretenie-ili-poleznaya-model-v-chem-raznica", title: "Изобретение или полезная модель: в чём разница и что лучше выбрать", category: "Патенты", date: "22 Февраля 2024", excerpt: "Разбираем отличия двух объектов патентования: требования к новизне, сроки защиты, процедура получения патента и рекомендации по выбору." },
  { slug: "nuzhno-li-registrirovat-programmu-evm-chto-daet", title: "Нужно ли регистрировать программу ЭВМ: всё, что нужно знать разработчику", category: "IT и ПО", date: "10 Января 2024", excerpt: "Почему авторское право на код возникает автоматически, но регистрация в Роспатенте все равно нужна. Риски, если программа не зарегистрирована." },
  { slug: "kak-zashhitit-brend-na-marketplejse", title: "Как защитить бренд на маркетплейсе: что нужно знать каждому продавцу", category: "Маркетплейсы", date: "05 Апреля 2024", excerpt: "Блокировки карточек конкурентами, продажа контрафакта и перехват названия. Как продавцу WB и Ozon защитить свой бизнес." },
  { slug: "registraciya-promyshlennogo-obrazca-kak-zashhitit-vneshnij-vid", title: "Регистрация промышленного образца: как защитить внешний вид вашего продукта", category: "Промышленные образцы", date: "18 Апреля 2024", excerpt: "Дизайн упаковки, интерфейса или изделия: как получить патент на промышленный образец и запретить конкурентам копировать визуал." },
  { slug: "promyshlennyy-obrazec-otvety", title: "Промышленный образец: ответы на 10 частых вопросов", category: "Промышленные образцы", date: "02 Мая 2024", excerpt: "Отвечаем на самые популярные вопросы: что охраняет, сколько стоит, какой срок действия патента и как доказать нарушение дизайна." },
  { slug: "kak-oformit-prava-na-dizajn-kontent", title: "Как оформить права на дизайн, контент и творческие разработки", category: "Авторские права", date: "12 Мая 2024", excerpt: "Служебные произведения, договоры с фрилансерами и депонирование: как компании получить права на всё, что создали дизайнеры и копирайтеры." },
  { slug: "10-oshibok-pri-podache-zayavki", title: "10 ошибок при подаче заявки в Роспатент — и как их избежать", category: "Товарные знаки", date: "20 Мая 2024", excerpt: "Неправильно подобранные классы МКТУ, описательные названия, ошибки в заявителе. Разбор типичных ошибок, которые приводят к отказу Роспатента." }
];

const categories = ["Все", "Товарные знаки", "Патенты", "IT и ПО", "Маркетплейсы", "Промышленные образцы", "Авторские права"];

export default function Blog() {
  const [activeTab, setActiveTab] = useState("Все");
  
  useEffect(() => {
    // Rely on ScrollToTop except when returning from a post
  }, []);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Товарные знаки': return '#C8A028';
      case 'Патенты': return '#2960B0';
      case 'IT и ПО': return '#0F6E56';
      case 'Маркетплейсы': return '#E11D48';
      case 'Промышленные образцы': return '#7C3AED';
      case 'Авторские права': return '#D97706';
      default: return '#1B3F7A';
    }
  };

  const filteredPosts = activeTab === "Все" 
    ? allPosts 
    : allPosts.filter(p => p.category === activeTab);

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-[#1B3F7A] font-medium hover:text-[#C8A028] transition-colors mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" /> Назад
        </Link>
        
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-[#1B3F7A] mb-4">Полезные материалы</h1>
          <p className="text-xl text-[#6B7280] leading-relaxed">
            Разбираем сложные кейсы, изменения в законах и даём понятные инструкции бизнесу.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors ${
                activeTab === cat 
                  ? 'bg-[#1B3F7A] text-white' 
                  : 'bg-[#F8F9FA] text-[#6B7280] hover:bg-[#EEF3FB] hover:text-[#1B3F7A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Link 
              to={`/blog/${post.slug}`} 
              key={post.slug}
              onClick={() => sessionStorage.setItem('blogScrollY', window.scrollY.toString())}
              className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_rgba(27,63,122,0.1)] transition-all flex flex-col group hover:-translate-y-1"
            >
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="px-3 py-1 text-[11px] font-bold rounded uppercase tracking-wider"
                    style={{ 
                      color: getCategoryColor(post.category), 
                      backgroundColor: `${getCategoryColor(post.category)}15` 
                    }}
                  >
                    {post.category}
                  </div>
                  <div className="text-sm text-[#9CA3AF] flex items-center font-medium">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {post.date}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#1F2937] mb-4 group-hover:text-[#1B3F7A] transition-colors leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-[#6B7280] line-clamp-3 mb-6 flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto flex items-center text-[#1B3F7A] font-bold text-sm bg-[#F8F9FA] px-4 py-3 rounded-lg group-hover:bg-[#1B3F7A] group-hover:text-white transition-colors w-max">
                  Читать <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
