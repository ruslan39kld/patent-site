const fs = require('fs');

const files = [
  'src/components/home/CustomBlocksRenderer.tsx',
  'src/components/home/Hero.tsx',
  'src/components/home/FinalCTA.tsx',
  'src/components/home/Problems.tsx',
  'src/components/home/ServicesGrid.tsx',
  'src/components/home/Quiz.tsx',
  'src/components/home/AboutBrief.tsx',
  'src/components/home/PricingHomeBlock.tsx',
  'src/components/home/FAQ.tsx',
  'src/components/pricing/PricingCalculator.tsx'
];

files.forEach(path => {
  if (fs.existsSync(path)) {
    let code = fs.readFileSync(path, 'utf8');
    code = code.replace(/bg-\[\#C8A028\](.*?)text-white/g, 'bg-[#C8A028]$1text-[#1F2937]');
    fs.writeFileSync(path, code);
  }
});
