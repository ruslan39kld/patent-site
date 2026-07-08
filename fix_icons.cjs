const fs = require('fs');
let code = fs.readFileSync('src/components/home/ServicesGrid.tsx', 'utf8');
code = code.replace(
  /<div className="w-10 h-10 rounded-lg bg-\[\#F8F9FA\]\/10 backdrop-blur-md border border-white\/20 flex items-center justify-center text-white mr-4 shadow-lg">/g,
  '<div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-lg ${i % 2 === 0 ? "bg-[#EEF3FB] text-[#1B3F7A]" : "bg-[#FBF3DC] text-[#C8A028]"}`}>'
);
fs.writeFileSync('src/components/home/ServicesGrid.tsx', code);
