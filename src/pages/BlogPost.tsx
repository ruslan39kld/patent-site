import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useData } from '../store/DataContext';
import { ArrowLeft, ArrowRight, Share2, Lightbulb } from 'lucide-react';
import React, { useMemo } from 'react';

const extractTextLines = (html: string) => {
  let text = html
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<p>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/?ul>/gi, '')
    .replace(/<blockquote>/gi, '💡 ')
    .replace(/<\/blockquote>/gi, '\n\n')
    .replace(/<\/?h[1-6]>/gi, '\n\n')
    // Remove other tags but keep content
    .replace(/<[^>]+>/g, '');
  
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ').replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').replace(/&mdash;/g, '—').replace(/&quot;/g, '"');

  return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
};

const SmartContentRenderer = ({ contentHtml }: { contentHtml: string }) => {
  const lines = useMemo(() => extractTextLines(contentHtml), [contentHtml]);
  
  const blocks: React.ReactNode[] = [];
  let currentList: string[] = [];
  let currentTable: string[][] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="my-6 space-y-3">
          {currentList.map((item, i) => (
            <li key={i} className="flex items-start text-[#1F2937] text-[16px] leading-[1.8]">
              <span className="text-[#C8A028] mr-3 mt-1 text-xs">■</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const flushTable = () => {
    if (currentTable.length > 0) {
      blocks.push(
        <div key={`table-${blocks.length}`} className="my-8 overflow-x-auto rounded-xl border border-[#E5E7EB]">
          <table className="w-full text-left border-collapse">
            <thead>
              {currentTable.length > 0 && (
                <tr className="bg-[#EEF3FB]">
                  {currentTable[0].map((cell, i) => (
                    <th key={i} className="px-6 py-4 font-bold text-[#1B3F7A] border-b border-[#E5E7EB]">{cell}</th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {currentTable.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 text-[#1F2937] border-b border-[#E5E7EB] last:border-b-0">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if table row
    if (line.includes('|')) {
      flushList();
      const cells = line.split('|').map(c => c.trim()).filter(c => c.length > 0);
      if (cells.length > 0) {
        currentTable.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // Check if list item
    if (line.startsWith('•') || line.startsWith('-')) {
      currentList.push(line.replace(/^[•-]\s*/, ''));
      continue;
    } else {
      flushList();
    }

    // Rule 1: Step / Phase
    const stepMatch = line.match(/^(Шаг \d+|Этап \d+)[.:]\s*(.*)$/i);
    if (stepMatch) {
      blocks.push(
        <div 
          key={`step-${i}`} 
          className="flex flex-col md:flex-row gap-6 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#E5E7EB] border-l-4 border-l-[#C8A028] my-8 animate-in slide-in-from-bottom-5 fade-in duration-500 fill-mode-both"
          style={{ animationDelay: `${(i % 5) * 100}ms` }}
        >
          <div className="w-14 h-14 rounded-full bg-[#1B3F7A] text-white flex flex-col items-center justify-center font-bold shrink-0">
             <span className="text-[10px] uppercase opacity-80 leading-none mb-0.5">{stepMatch[1].split(' ')[0]}</span>
             <span className="text-xl leading-none">{stepMatch[1].split(' ')[1]}</span>
          </div>
          <div>
            {stepMatch[2] && <h3 className="text-xl font-bold text-[#1B3F7A] mb-3">{stepMatch[2]}</h3>}
            {i + 1 < lines.length && !lines[i+1].match(/^(Шаг|Этап|💡|•|-)/i) && lines[i+1].length > 80 && (
              <p className="text-[#1F2937] leading-[1.8]">{lines[++i]}</p>
            )}
          </div>
        </div>
      );
      continue;
    }
    
    // Rule 3: Tip blocks (💡)
    if (line.startsWith('💡')) {
      blocks.push(
        <div key={`tip-${i}`} className="bg-[#FBF3DC] border-l-4 border-[#C8A028] p-5 md:p-6 rounded-lg my-8 flex gap-4 shadow-sm">
           <Lightbulb className="w-6 h-6 text-[#C8A028] shrink-0 mt-0.5" />
           <p className="text-[#1F2937] italic leading-relaxed text-[16px]">{line.replace(/^💡\s*/, '')}</p>
        </div>
      );
      continue;
    }

    // Rule 2: Header (short, no punctuation at end, next is long or a list)
    if (line.length > 0 && line.length <= 80 && !/[.!?:]$/.test(line)) {
      blocks.push(
        <h2 key={`h2-${i}`} className="text-[20px] font-bold text-[#1B3F7A] border-b-2 border-[#C8A028] pb-2 w-max mt-10 mb-6">
          {line}
        </h2>
      );
      continue;
    }

    // Fallback: regular paragraph
    blocks.push(
       <p key={`p-${i}`} className="text-[16px] leading-[1.8] text-[#1F2937] mb-5">
         {line}
       </p>
    );
  }

  flushList();
  flushTable();

  return <div className="smart-content-wrapper">{blocks}</div>;
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useData();
  const navigate = useNavigate();

  const post = state.blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

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

  const catColor = getCategoryColor(post.category);

  const relatedPosts = state.blogPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2);

  if (relatedPosts.length < 2) {
    const extra = state.blogPosts.filter(p => p.slug !== post.slug && !relatedPosts.find(rp => rp.slug === p.slug)).slice(0, 2 - relatedPosts.length);
    relatedPosts.push(...extra);
  }

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/blog');
    setTimeout(() => {
      const savedY = sessionStorage.getItem('blogScrollY');
      if (savedY) window.scrollTo({ top: parseInt(savedY), behavior: 'instant' });
    }, 50);
  };

  return (
    <div className="bg-white min-h-screen">
      <article className="pb-24 pt-8">
        <div className="max-w-[780px] mx-auto px-6">
          <div className="flex flex-col mb-10">
            <button onClick={handleBack} className="inline-flex items-center text-[#1B3F7A] font-medium hover:text-[#C8A028] transition-colors self-start mb-8">
              <ArrowLeft className="w-5 h-5 mr-2" /> Назад
            </button>
            <div className="text-sm text-[#6B7280] font-medium flex items-center gap-2 mb-8 hidden md:flex">
              <Link to="/" className="hover:text-[#1B3F7A] transition-colors">Главная</Link>
              <span>/</span>
              <button onClick={handleBack} className="hover:text-[#1B3F7A] transition-colors">Блог</button>
              <span>/</span>
              <span className="text-[#1F2937] truncate">{post.title}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div 
                className="px-3 py-1 text-[12px] font-bold rounded uppercase tracking-wider"
                style={{ color: catColor, backgroundColor: `${catColor}15` }}
              >
                {post.category}
              </div>
              <div className="text-sm text-[#6B7280] font-medium">
                {new Date(post.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            
            <h1 className="text-[32px] md:text-[40px] font-bold text-[#1B3F7A] mb-8 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
               <div className="text-[18px] text-[#1F2937] leading-relaxed font-medium border-l-4 pl-5 italic mb-10" style={{ borderColor: '#C8A028' }}>
                 {post.excerpt}
               </div>
            )}
          </div>

          <SmartContentRenderer contentHtml={post.content} />
          
          <div className="mt-16 pt-8 border-t border-[#E5E7EB]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
               <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-[#1B3F7A] flex items-center justify-center text-white text-lg font-bold mr-4 shrink-0 shadow-sm">
                     ВТ
                  </div>
                  <div>
                     <div className="font-bold text-[#1B3F7A] text-lg">Виктория Тарасова</div>
                     <div className="text-[#6B7280] text-sm font-medium tracking-wide">Патентный поверенный РФ №1558</div>
                  </div>
               </div>
               
               <a 
                 href={state.content.telegram} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="flex items-center text-sm font-bold text-[#1B3F7A] border border-[#1B3F7A]/20 bg-[#F8F9FA] hover:bg-[#EEF3FB] px-5 py-2.5 rounded-xl transition-colors shrink-0"
               >
                 <Share2 className="w-4 h-4 mr-2" /> Поделиться в Telegram
               </a>
            </div>

            <div className="bg-[#EEF3FB] rounded-2xl p-8 sm:p-10 text-center flex flex-col items-center border border-[#1B3F7A]/10 shadow-sm mb-16">
              <h3 className="text-2xl font-black text-[#1B3F7A] mb-3">Нужна консультация по этой теме?</h3>
              <p className="text-[#6B7280] mb-8 max-w-lg">
                 Задайте вопрос AI-консультанту прямо сейчас или оставьте заявку, и мы свяжемся с вами.
              </p>
              <button 
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-ai-bot', { 
                    detail: { 
                      initialMessage: `Здравствуйте! Вы читали статью «${post.title}». Какие вопросы у вас остались? Чем я могу помочь?`
                    } 
                  }));
                }}
                className="bg-[#1B3F7A] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#2960B0] transition-transform hover:-translate-y-1 shadow-md inline-flex items-center"
              >
                Обсудить мою задачу <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            
            <div className="pt-8 border-t border-[#E5E7EB]">
              <h3 className="text-2xl font-bold text-[#1B3F7A] mb-8">Читайте также</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map(rp => (
                  <Link 
                    key={rp.slug} 
                    to={`/blog/${rp.slug}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="group bg-[#F8F9FA] border border-[#E5E7EB] p-6 rounded-2xl hover:border-[#1B3F7A] hover:bg-white transition-all hover:shadow-md"
                  >
                    <div className="text-xs font-bold text-[#C8A028] uppercase tracking-wider mb-2">{rp.category}</div>
                    <h4 className="font-bold text-[#1F2937] group-hover:text-[#1B3F7A] transition-colors leading-snug">{rp.title}</h4>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
