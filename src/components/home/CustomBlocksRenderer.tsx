import { useData } from '../../store/DataContext';
import { CustomBlock } from '../../types';
import { cn } from '../../lib/utils';
import { ArrowRight } from 'lucide-react';
import React from 'react';

export default function CustomBlocksRenderer({ insertAfter }: { insertAfter?: string }) {
  const { state } = useData();
  const blocks = state.customBlocks || [];
  
  // If insertAfter is specified, get only those blocks.
  // If insertAfter is NOT specified, get blocks that don't have an insertAfter (or equal to 'bottom').
  const activeBlocks = blocks.filter(b => 
    b.active && 
    (insertAfter ? b.insertAfter === insertAfter : (!b.insertAfter || b.insertAfter === 'bottom'))
  );

  if (activeBlocks.length === 0) return null;

  return (
    <>
      {activeBlocks.map((block: CustomBlock, index: number) => {
        // Evaluate dynamic classes
        const bgClass = block.bgColor || 'bg-white';
        let animClass = '';
        if (block.animation === 'animate-fade-in') animClass = 'opacity-0 group-[.visible]:opacity-100 transition-opacity duration-1000';
        else if (block.animation === 'animate-slide-left') animClass = 'opacity-0 -translate-x-12 group-[.visible]:opacity-100 group-[.visible]:translate-x-0 transition-all duration-1000';
        else if (block.animation === 'animate-slide-right') animClass = 'opacity-0 translate-x-12 group-[.visible]:opacity-100 group-[.visible]:translate-x-0 transition-all duration-1000';
        else if (block.animation === 'none') animClass = '';
        else animClass = 'opacity-0 translate-y-8 group-[.visible]:opacity-100 group-[.visible]:translate-y-0 transition-all duration-700'; // default "bottom to top"

        return (
          <section key={block.id} className={cn("py-16 relative overflow-hidden group", bgClass)}>
            <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", animClass)}>
              
              {/* Image Layout */}
              {block.type === 'image' && block.image ? (
                <div className={cn(
                  "flex flex-col gap-8 items-center", 
                  block.imagePosition === 'left' ? "md:flex-row-reverse" : 
                  block.imagePosition === 'right' ? "md:flex-row" : 
                  block.imagePosition === 'top' ? "flex-col-reverse" : "flex-col"
                )}>
                  <div className="flex-1 space-y-6">
                    {block.subtitle && <p className="text-[#C8A028] font-bold text-sm uppercase tracking-widest">{block.subtitle}</p>}
                    <h2 className="text-3xl font-black font-sans tracking-tight text-[#1B3F7A] sm:text-4xl">{block.title}</h2>
                    {block.text && <p className="text-[#6B7280] text-lg leading-relaxed whitespace-pre-wrap">{block.text}</p>}
                    {block.buttonText && block.buttonLink && (
                       <a href={block.buttonLink} className="inline-flex items-center bg-[#1B3F7A] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#2960B0] transition-colors shadow-lg shadow-[#1B3F7A]/20 hover:-translate-y-1">
                          {block.buttonText}
                          <ArrowRight className="ml-2 w-5 h-5" />
                       </a>
                    )}
                  </div>
                  <div className="flex-1 w-full max-w-lg relative rounded-2xl overflow-hidden group/img">
                    <div 
                      className="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-70 group-hover/img:scale-125 transition-transform duration-700"
                      style={{ backgroundImage: `url("${block.image}")` }}
                    />
                    <img src={block.image} alt={block.title} className="relative z-10 w-full h-[300px] md:h-[400px] rounded-2xl shadow-xl object-contain drop-shadow-lg" />
                  </div>
                </div>
              ) : block.type === 'text' ? (
                <div className="max-w-4xl mx-auto text-center space-y-6">
                   {block.subtitle && <p className="text-[#C8A028] font-bold text-sm uppercase tracking-widest">{block.subtitle}</p>}
                   <h2 className="text-3xl font-black font-sans tracking-tight text-[#1B3F7A] sm:text-5xl">{block.title}</h2>
                   {block.text && <p className="text-[#6B7280] text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">{block.text}</p>}
                   {block.buttonText && block.buttonLink && (
                      <div className="pt-4">
                         <a href={block.buttonLink} className="inline-flex items-center bg-[#1B3F7A] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#2960B0] transition-colors shadow-lg shadow-[#1B3F7A]/20 hover:-translate-y-1">
                            {block.buttonText}
                            <ArrowRight className="ml-2 w-5 h-5" />
                         </a>
                      </div>
                   )}
                </div>
              ) : block.type === 'cta' ? (
                <div className="bg-gradient-to-br from-[#1B3F7A] to-[#3B82F6] text-white rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden max-w-5xl mx-auto">
                   <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-10 rounded-full blur-[120px] pointer-events-none"></div>
                   <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-[#C8A028] opacity-10 rounded-full blur-[120px] pointer-events-none"></div>
                   <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                      {block.subtitle && <p className="text-white/80 font-bold text-sm uppercase tracking-widest">{block.subtitle}</p>}
                      <h2 className="text-3xl font-black sm:text-5xl">{block.title}</h2>
                      {block.text && <p className="text-white/90 text-xl leading-relaxed">{block.text}</p>}
                      {block.buttonText && block.buttonLink && (
                         <a href={block.buttonLink} className="inline-flex items-center bg-white text-[#1B3F7A] font-bold py-4 px-10 rounded-xl hover:bg-gray-50 transition-transform shadow-lg hover:-translate-y-1 text-lg">
                            {block.buttonText}
                         </a>
                      )}
                   </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto py-8 text-center space-y-6">
                   {block.subtitle && <p className="text-[#C8A028] font-bold text-sm uppercase tracking-widest">{block.subtitle}</p>}
                   <h2 className="text-3xl font-black font-sans tracking-tight text-[#1B3F7A] sm:text-4xl">{block.title}</h2>
                   {block.text && <p className="text-[#6B7280] text-lg leading-relaxed whitespace-pre-wrap max-w-3xl mx-auto">{block.text}</p>}
                   {block.buttonText && block.buttonLink && (
                      <div className="pt-6">
                         <a href={block.buttonLink} className="inline-flex items-center bg-[#1B3F7A] text-white font-bold py-4 px-8 rounded-xl hover:bg-[#2960B0] transition-colors shadow-lg shadow-[#1B3F7A]/20 hover:-translate-y-1">
                            {block.buttonText}
                         </a>
                      </div>
                   )}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
