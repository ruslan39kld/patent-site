import { useData } from '../../store/DataContext';
import { CustomBlock } from '../../types';

export default function CustomBlocksRenderer() {
  const { state } = useData();
  const blocks = state.customBlocks || [];
  const activeBlocks = blocks.filter(b => b.active);

  if (activeBlocks.length === 0) return null;

  return (
    <div className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
         {activeBlocks.map((block: CustomBlock) => (
            <div key={block.id} className="relative">
               {block.type === 'text' && (
                  <div className="max-w-3xl mx-auto text-center space-y-4">
                     {block.subtitle && <p className="text-accent font-mono text-sm uppercase tracking-wider">{block.subtitle}</p>}
                     <h2 className="text-3xl font-bold font-sans tracking-tight text-primary sm:text-4xl">{block.title}</h2>
                     {block.text && <p className="text-gray-600 text-lg leading-relaxed">{block.text}</p>}
                     {block.buttonText && block.buttonLink && (
                        <div className="mt-8">
                           <a href={block.buttonLink} className="inline-block bg-primary text-white font-bold py-3 px-8 rounded hover:bg-secondary transition-colors">
                              {block.buttonText}
                           </a>
                        </div>
                     )}
                  </div>
               )}
               {/* A generic card block renderer */}
               {block.type === 'cards' && (
                  <div>
                     <div className="text-center mb-12">
                        {block.subtitle && <p className="text-accent font-mono text-sm uppercase tracking-wider">{block.subtitle}</p>}
                        <h2 className="text-3xl font-bold font-sans tracking-tight text-primary sm:text-4xl">{block.title}</h2>
                        {block.text && <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">{block.text}</p>}
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* We don't have dynamic children for blocks yet, but let's just show standard placeholders or something */}
                        <div className="bg-gray-50 border p-6 rounded-lg text-center shadow-sm">
                           <div className="text-xl font-bold text-primary mb-2">Пример карточки 1</div>
                           <p className="text-gray-600">Описание карточки в этом блоке будет добавлено позже.</p>
                        </div>
                     </div>
                  </div>
               )}
               {/* CTA block renderer */}
               {block.type === 'cta' && (
                  <div className="bg-primary text-white rounded-2xl p-12 text-center shadow-lg relative overflow-hidden">
                     <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
                     <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        {block.subtitle && <p className="text-white/80 font-mono text-sm uppercase tracking-wider">{block.subtitle}</p>}
                        <h2 className="text-3xl font-bold sm:text-4xl">{block.title}</h2>
                        {block.text && <p className="text-white/90 text-lg">{block.text}</p>}
                        {block.buttonText && block.buttonLink && (
                           <a href={block.buttonLink} className="inline-block bg-white text-primary font-bold py-3 px-8 rounded mt-6 hover:bg-gray-50 transition-colors">
                              {block.buttonText}
                           </a>
                        )}
                     </div>
                  </div>
               )}
               {/* Generic for others */}
               {['faq', 'image', 'advantages'].includes(block.type) && (
                  <div className="max-w-4xl mx-auto py-8">
                     <h2 className="text-3xl font-bold font-sans tracking-tight text-primary mb-6">{block.title}</h2>
                     {block.subtitle && <p className="text-gray-500 font-mono text-sm uppercase mb-4">{block.subtitle}</p>}
                     {block.text && <p className="text-gray-700 whitespace-pre-wrap">{block.text}</p>}
                     {block.buttonText && block.buttonLink && (
                        <div className="mt-8">
                           <a href={block.buttonLink} className="inline-block border-2 border-primary text-primary font-bold py-2 px-6 rounded hover:bg-primary hover:text-white transition-colors">
                              {block.buttonText}
                           </a>
                        </div>
                     )}
                  </div>
               )}
            </div>
         ))}
      </div>
    </div>
  );
}
