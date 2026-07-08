import { useEffect } from 'react';
import Hero from '../components/home/Hero';
import Problems from '../components/home/Problems';
import Risks from '../components/home/Risks';
import ServicesGrid from '../components/home/ServicesGrid';
import Process from '../components/home/Process';
import CasesHomeBlock from '../components/home/CasesHomeBlock';
import Quiz from '../components/home/Quiz';
import AboutBrief from '../components/home/AboutBrief';
import PricingHomeBlock from '../components/home/PricingHomeBlock';
import ReviewsBlock from '../components/home/ReviewsBlock';
import FAQ from '../components/home/FAQ';
import BlogHomeBlock from '../components/home/BlogHomeBlock';
import CustomBlocksRenderer from '../components/home/CustomBlocksRenderer';
import FinalCTA from '../components/home/FinalCTA';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          if (entry.target.id === 'process') {
            const timeline = document.querySelector('.timeline-line');
            if (timeline) timeline.classList.add('visible');
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
      });
            document.querySelectorAll('section').forEach(el => {
        observer.observe(el);
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page overflow-x-hidden">
      <CustomBlocksRenderer insertAfter="top" />
      <Hero />
      <CustomBlocksRenderer insertAfter="hero" />
      <Problems />
      <CustomBlocksRenderer insertAfter="problems" />
      <Risks />
      <CustomBlocksRenderer insertAfter="risks" />
      <ServicesGrid />
      <CustomBlocksRenderer insertAfter="services" />
      <Process />
      <CustomBlocksRenderer insertAfter="process" />
      <CasesHomeBlock />
      <CustomBlocksRenderer insertAfter="cases" />
      <PricingHomeBlock />
      <CustomBlocksRenderer insertAfter="pricing" />
      <ReviewsBlock />
      <CustomBlocksRenderer insertAfter="reviews" />
      <Quiz />
      <CustomBlocksRenderer insertAfter="quiz" />
      <AboutBrief />
      <CustomBlocksRenderer insertAfter="about" />
      <BlogHomeBlock />
      <CustomBlocksRenderer insertAfter="blog" />
      <FAQ />
      <CustomBlocksRenderer insertAfter="faq" />
      <CustomBlocksRenderer />
      <FinalCTA />
      <CustomBlocksRenderer insertAfter="cta" />
    </div>
  );
}
