import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useData } from '../store/DataContext';

const ALL = "Все";

export default function FAQ() {
  const { state } = useData();
  const [activeTab, setActiveTab] = useState(ALL);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [ALL, ...Array.from(new Set(state.faqItems.map(f => f.category)))];

  const filtered = state.faqItems
    .filter(f => activeTab === ALL || f.category === activeTab)
    .sort((a, b) => a.order - b.order);

  const grouped = categories.slice(1).reduce<Record<string, typeof state.faqItems>>((acc, cat) => {
    const items = filtered.filter(f => f.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  const handleQuestionClick = (question: string) => {
    window.dispatchEvent(
      new CustomEvent('open-ai-bot', {
        detail: { initialMessage: question }
      })
    );
  };

  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <div className="max-w-[900px] mx-auto px-4 lg:px-8 py-8">

        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-[#1B3F7A] font-medium hover:text-[#C8A028] transition-colors mb-6">
            <ArrowLeft className="w-5 h-5 mr-2" /> Назад на главную
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-2">Все вопросы и ответы</h1>
          <p className="text-[#6B7280]">Нажмите на вопрос — получите ответ от AI-консультанта</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "px-4 py-2 rounded-full font-bold text-[13px] whitespace-nowrap transition-colors border",
                activeTab === cat
                  ? "bg-[#1B3F7A] text-white border-[#1B3F7A]"
                  : "bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#EEF3FB] hover:text-[#1B3F7A] hover:border-[#1B3F7A]/30"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {(activeTab === ALL ? Object.entries(grouped) : [[activeTab, filtered] as const]).map(([cat, items]) => (
            <div key={cat} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
              <div className="bg-[#F8F9FA] px-6 py-3 border-b border-[#E5E7EB] font-bold text-[#1B3F7A] uppercase tracking-wider text-[11px]">
                {cat}
              </div>
              <div className="divide-y divide-[#E5E7EB]">
                {(items as typeof state.faqItems).map(faq => (
                  <button
                    key={faq.id}
                    onClick={() => handleQuestionClick(faq.q)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center transition-colors group hover:bg-[#F8FAFC]"
                  >
                    <span className="font-medium pr-4 leading-snug text-[#1F2937] group-hover:text-[#1B3F7A]">
                      {faq.q}
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0 text-[#9CA3AF] group-hover:text-[#1B3F7A] group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
