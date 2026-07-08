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
      case 'Товарные знаки': return '#C8A028';
      case 'Патенты': return '#2960B0';
      case 'IT и ПО': return '#0F6E56';
      case 'Маркетплейсы': return '#E11D48';
      case 'Промышленные образцы': return '#7C3AED';
      case 'Авторские права': return '#D97706';
      default: return '#1B3F7A';
    }
  };

  return (
    <section  id="blog" className="animate-on-scroll py-24 bg-white relative rounded-[40px] mx-4 my-12 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 animate-on-scroll gap-6 md:gap-0">
          <div className="max-w-2xl">
            <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Блог и экспертиза</div>
            <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-4">Полезные материалы</h2>
            <p className="text-lg md:text-xl text-[#6B7280]">
              Разбираем сложные кейсы, изменения в законах и даем понятные инструкции бизнесу.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {recentPosts.map((post, i) => (
            <Link 
              to={`/blog/${post.slug}`} 
              key={post.slug}
              className={cn("bg-[#F8F9FA] border border-[#3B82F6]/15 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:-translate-y-1 hover:border-[#3B82F6]/40 transition-all duration-500 flex flex-col group animate-on-scroll relative", `stagger-${Math.min(i + 1, 6)}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
              <div className="p-8 flex flex-col flex-grow relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div 
                    className="px-3 py-1 text-[11px] font-bold rounded uppercase tracking-wider relative group-hover:bg-[#3B82F6] group-hover:text-white transition-colors duration-500"
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
                
                <h3 className="text-xl font-bold text-[#1F2937] mb-4 group-hover:text-[#3B82F6] transition-colors leading-snug">
                  {post.title}
                </h3>
                
                <p className="text-[#6B7280] line-clamp-3 mb-8 flex-grow leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto flex items-center text-[#1B3F7A] font-bold text-sm px-6 py-3.5 rounded-xl group-hover:bg-[#3B82F6] group-hover:text-white transition-all duration-500 w-max shadow-[0_0_0_rgba(59,130,246,0)] group-hover:shadow-[0_4px_15px_rgba(59,130,246,0.3)]">
                  Читать <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="flex justify-end mt-8 animate-on-scroll">
          <Link to="/blog" className="inline-flex items-center text-[#1B3F7A] font-bold hover:text-[#C8A028] transition-colors group pb-2 shrink-0 md:text-lg">
            Все статьи
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
