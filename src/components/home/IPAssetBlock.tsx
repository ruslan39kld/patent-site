import { Briefcase, Package, Palette, Cpu, Code, PenTool } from 'lucide-react';

export default function IPAssetBlock() {
  const assets = [
    { title: "Бренд", desc: "Название, логотип, слоган", icon: <Briefcase className="w-5 h-5 text-[#1B3F7A]" /> },
    { title: "Продукт", desc: "Конструкция, принцип работы", icon: <Package className="w-5 h-5 text-[#1B3F7A]" /> },
    { title: "Дизайн", desc: "Внешний вид, интерфейс", icon: <Palette className="w-5 h-5 text-[#1B3F7A]" /> },
    { title: "Технология", desc: "Способ производства", icon: <Cpu className="w-5 h-5 text-[#1B3F7A]" /> },
    { title: "Программный код", desc: "ПО, базы данных, алгоритмы", icon: <Code className="w-5 h-5 text-[#1B3F7A]" /> },
    { title: "Контент", desc: "Методики, курсы, тексты", icon: <PenTool className="w-5 h-5 text-[#1B3F7A]" /> },
  ];

  return (
    <section className="py-24 bg-white border-t border-[#F3F4F6] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-[12px] text-[#C8A028] uppercase tracking-widest font-bold mb-2">Объекты права</div>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B3F7A] mb-6 tracking-tight">Что можно защитить?</h2>
          <p className="text-lg text-[#6B7280] font-medium">Ваш бизнес состоит не только из офиса и оборудования. Самое ценное часто нематериально.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <div 
              className="photo-placeholder w-full max-w-[500px] mx-auto h-[350px] md:h-[450px] bg-[#F8F9FA] border border-[#E5E7EB] rounded-[24px] flex items-center justify-center"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #E8EEF8 0%, #FFFFFF 100%)'
              }}
            >
              <div className="text-center text-[#6B7280]">
                <div className="text-[48px] mb-2">💡</div>
                <div className="text-[14px] font-bold uppercase tracking-widest text-[#1B3F7A]">Иллюстрация схемы</div>
                <div className="text-[12px] text-[#9CA3AF] mt-1">Ожидается изображение 500x350</div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
             <div className="flex flex-col gap-6">
                {assets.map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-[#F8F9FA] transition-colors border border-transparent hover:border-[#E5E7EB]">
                    <div className="w-12 h-12 rounded-full bg-[#EEF3FB] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#1B3F7A] mb-1">{item.title}</h3>
                      <p className="text-[#6B7280] text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
