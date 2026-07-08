const fs = require('fs');
let code = fs.readFileSync('src/components/home/AboutBrief.tsx', 'utf8');

const target = `<div id="certificates-section" className="mt-12 animate-on-scroll stagger-3 scroll-mt-32">
          <div className="text-[12px] text-[#3B82F6] uppercase tracking-widest font-bold mb-2">Квалификация</div>
          <h3 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-10">
            Свидетельства и документы
          </h3>`;

const replacement = `<div className="mt-16 animate-on-scroll stagger-3">
          <div className="text-[12px] text-[#3B82F6] uppercase tracking-widest font-bold mb-2">Квалификация</div>
          <h3 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-6">
            Официальный статус
          </h3>
          <p className="text-lg text-gray-700 mb-6 max-w-3xl">
            Я являюсь действующим патентным поверенным РФ. Мой регистрационный номер — №1558.
          </p>
          <a
            href="https://rospatent.gov.ru/ru/patent-attorneys/1558"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-[#F8F9FA] border border-[#E5E7EB] text-[#1B3F7A] hover:bg-white hover:border-[#3B82F6]/50 hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)] px-8 py-4 font-bold transition-all rounded-xl text-lg hover:-translate-y-1 mb-16 group"
          >
            Проверить в реестре Роспатента 
            <ExternalLink className="w-5 h-5 ml-3 text-[#3B82F6] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>

        <div id="certificates-section" className="animate-on-scroll stagger-4 scroll-mt-32">
          <div className="text-[12px] text-[#3B82F6] uppercase tracking-widest font-bold mb-2">Портфолио</div>
          <h3 className="text-3xl md:text-4xl font-black text-[#1B3F7A] mb-10">
            Примеры моей работы
          </h3>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/home/AboutBrief.tsx', code);
