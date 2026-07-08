const fs = require('fs');

let code = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');

code = code.replace(
  /className="w-10 h-10 rounded-full bg-\[\#2960B0\] border border-\[\#2960B0\]\/30 text-white flex items-center justify-center hover:bg-\[\#2960B0\] hover:text-white transition-all shadow-\[0_0_15px_rgba\(59,130,246,0\.15\)\] hover:shadow-\[0_0_20px_rgba\(59,130,246,0\.5\)\]"/g,
  'className="w-10 h-10 rounded-full bg-[#C8A028] border border-[#C8A028]/30 text-white flex items-center justify-center hover:bg-[#E8C050] transition-all shadow-[0_0_15px_rgba(200,160,40,0.3)] hover:shadow-[0_0_25px_rgba(200,160,40,0.6)]"'
);

fs.writeFileSync('src/components/layout/Footer.tsx', code);
