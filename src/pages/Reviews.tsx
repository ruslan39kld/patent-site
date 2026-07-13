import { useEffect } from 'react';
import { useData } from '../store/DataContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReviewCard from '../components/ReviewCard';

export default function Reviews() {
  const { state } = useData();
  const rawReviews = state.reviews || [];
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const reviews = rawReviews.filter(r => r.published !== false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] relative overflow-hidden text-[#1F2937] pt-24 pb-20">
      {/* Light tech backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3B82F6]/30 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[50%] h-[500px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-12">
          {/* Back button */}
          <button 
            onClick={() => {
              navigate('/#reviews');
              setTimeout(() => {
                const element = document.getElementById('reviews');
                if (element) {
                   element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            }} 
            className="inline-flex items-center text-[#1B3F7A] hover:text-[#3B82F6] font-bold transition-colors group mb-8"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
            Назад к главной
          </button>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1B3F7A] tracking-tight mb-4">
             Все <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B3F7A] to-[#3B82F6]">отзывы</span>
          </h1>
          <p className="text-xl text-[#6B7280] font-medium">Что говорят клиенты о нашей работе</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id ?? i} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
