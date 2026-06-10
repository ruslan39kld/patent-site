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
    <>
      <Hero />
      <Problems />
      <Risks />
      <ServicesGrid />
      <Process />
      <CasesHomeBlock />
      <PricingHomeBlock />
      <ReviewsBlock />
      <Quiz />
      <AboutBrief />
      <BlogHomeBlock />
      <FAQ />
      <CustomBlocksRenderer />
      <FinalCTA />
    </>
  );
}
