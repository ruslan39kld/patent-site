export default function Trust() {
  const stats = [
    { value: '20+', label: 'Лет практического опыта' },
    { value: '№1558', label: 'Патентный поверенный РФ' },
    { value: '100%', label: 'Конфиденциальность по закону' },
    { value: 'РФ/Мир', label: 'География защиты' }
  ];

  return (
    <section className="py-16 bg-blue-bg relative border-y border-gray/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray/10">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-3 font-mono tracking-tight">{stat.value}</div>
              <div className="text-sm md:text-base font-bold text-gray uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
