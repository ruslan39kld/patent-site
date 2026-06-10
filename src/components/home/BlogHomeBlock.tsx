import { Link } from 'react-router-dom';
import { useData } from '../../store/DataContext';
import { ArrowRight, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function BlogHomeBlock() {
  const { state } = useData();
  const recentPosts = state.blogPosts.slice(0, 3); // Show only top 3

  if (recentPosts.length === 0) return null;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Кейсы': return '#C8A028';
      case 'Статьи': return '#2960B0';
      case 'Новости': return '#0F6E56';
      default: return '#1B3F7A';
    }
  };

  return (
    <section id="blog" className="py-24 bg-[#F8F9FA] border-t border-[#F3F4F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 animate-on-scroll">
          <div className="max-w-2xl">
            <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Блог и экспертиза</div>
            <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-4">Полезные материалы</h2>
            <p className="text-xl text-[#6B7280]">
              Разбираем сложные кейсы, изменения в законах и даем понятные инструкции бизнесу.
            </p>
          </div>
          
          <Link to="/blog" className="hidden md:flex items-center text-[#1B3F7A] font-bold hover:text-[#C8A028] transition-colors group pb-2">
            Все статьи
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {recentPosts.map((post, i) => (
            <Link 
              to={`/blog/${post.slug}`} 
              key={post.slug}
              className={cn("bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_rgba(27,63,122,0.1)] transition-all flex flex-col group animate-on-scroll", `stagger-${Math.min(i + 1, 6)}`)}
            >
              <div 
                className="w-full h-[180px] bg-[#E8EEF8] flex items-center justify-center text-[#9CA3AF] border-b-[3px] transition-colors group-hover:border-b-[5px]"
                style={{ borderBottomColor: getCategoryColor(post.category) }}
              >
                 <div className="text-center">
                    <div className="text-3xl mb-1">🖼️</div>
                    <div className="text-xs uppercase font-bold tracking-widest">Обложка 800x400</div>
                 </div>
              </div>
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
                
                <h3 className="text-xl font-bold text-[#1F2937] mb-3 group-hover:text-[#1B3F7A] transition-colors line-clamp-2 leading-snug">
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
        
        <div className="md:hidden flex justify-center mt-8 animate-on-scroll">
          <Link to="/blog" className="inline-flex items-center justify-center w-full bg-white border border-[#E5E7EB] text-[#1B3F7A] font-bold py-4 rounded-xl shadow-sm hover:border-[#1B3F7A] transition-colors">
            Все статьи <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
