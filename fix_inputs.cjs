const fs = require('fs');

let code = fs.readFileSync('src/components/home/FinalCTA.tsx', 'utf8');

// Replace messy classes with clean white inputs
code = code.replace(/className="w-full px-5 bg-white\/10 text-white placeholder:text-blue-200\/50 py-4 bg-white\/10 border border-\[\#3B82F6\]\/20 rounded-xl focus:ring-2 focus:ring-\[\#3B82F6\]\/50 focus:border-\[\#3B82F6\]\/50 outline-none transition-all shadow-inner text-white font-medium"/g, 
  'className="w-full px-5 py-4 bg-white text-[#1F2937] placeholder:text-gray-400 border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 outline-none transition-all shadow-inner font-medium"');

code = code.replace(/className="w-full px-5 bg-white\/10 text-white placeholder:text-blue-200\/50 py-4 bg-white\/10 border border-\[\#3B82F6\]\/20 rounded-xl focus:ring-2 focus:ring-\[\#3B82F6\]\/50 focus:border-\[\#3B82F6\]\/50 outline-none transition-all placeholder:text-blue-200\/50 shadow-inner"/g, 
  'className="w-full px-5 py-4 bg-white text-[#1F2937] placeholder:text-gray-400 border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 outline-none transition-all shadow-inner"');

code = code.replace(/className="w-full px-5 bg-white\/10 text-white placeholder:text-blue-200\/50 py-3 border border-\[\#3B82F6\]\/20 rounded-xl focus:ring-2 focus:ring-\[\#3B82F6\]\/50 outline-none shadow-inner"/g, 
  'className="w-full px-5 py-3 bg-white text-[#1F2937] placeholder:text-gray-400 border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none shadow-inner"');

code = code.replace(/className="w-full px-5 bg-white\/10 text-white placeholder:text-blue-200\/50 py-3 border border-\[\#3B82F6\]\/20 rounded-xl focus:ring-2 focus:ring-\[\#3B82F6\]\/50 outline-none shadow-inner text-white"/g, 
  'className="w-full px-5 py-3 bg-white text-[#1F2937] border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none shadow-inner"');

code = code.replace(/className="w-full px-5 bg-white\/10 text-white placeholder:text-blue-200\/50 py-3 border border-\[\#3B82F6\]\/20 rounded-xl focus:ring-2 focus:ring-\[\#3B82F6\]\/50 outline-none resize-none shadow-inner"/g, 
  'className="w-full px-5 py-3 bg-white text-[#1F2937] placeholder:text-gray-400 border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 outline-none resize-none shadow-inner"');

code = code.replace(/className="w-full px-5 bg-white\/10 text-white placeholder:text-blue-200\/50 py-4 bg-white\/10 border border-\[\#3B82F6\]\/20 rounded-xl focus:ring-2 focus:ring-\[\#3B82F6\]\/50 focus:border-\[\#3B82F6\]\/50 outline-none transition-all resize-none placeholder:text-blue-200\/50 shadow-inner"/g, 
  'className="w-full px-5 py-4 bg-white text-[#1F2937] placeholder:text-gray-400 border border-[#3B82F6]/20 rounded-xl focus:ring-2 focus:ring-[#3B82F6]/50 focus:border-[#3B82F6]/50 outline-none transition-all resize-none shadow-inner"');

// Fix the labels in FinalCTA.tsx to not be white if the section is supposed to be somewhat light? No, FinalCTA is #1B3F7A (dark blue), so text-white is correct for labels.

fs.writeFileSync('src/components/home/FinalCTA.tsx', code);
