import { ShieldCheck, Award, FileText, Zap } from 'lucide-react';

export default function ExpertPanel() {
  const stats = [
    { label: "Лет практики", value: "20+", icon: <Award className="w-6 h-6 text-accent mb-2" /> },
    { label: "Патентный поверенный", value: "№1558", icon: <ShieldCheck className="w-6 h-6 text-accent mb-2" /> },
    { label: "Специализация", value: "IT и Бренды", icon: <Zap className="w-6 h-6 text-accent mb-2" /> },
    { label: "Документы", value: "Патенты и ТЗ", icon: <FileText className="w-6 h-6 text-accent mb-2" /> },
  ];

  return (
    <section className="bg-white border-y border-gray/10 relative z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-gray/10">
          {stats.map((stat, i) => (
            <div key={i} className={`flex flex-col items-center text-center ${i === 0 ? '' : 'pl-6'}`}>
              {stat.icon}
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1 tracking-tight">{stat.value}</div>
              <div className="text-xs md:text-sm font-bold text-gray uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
