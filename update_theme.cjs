const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'pages', 'admin');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Exclude AdminLayout and Login if needed, but let's do safe replacements
  if (filePath.endsWith('Login.tsx') || filePath.endsWith('AdminLayout.tsx')) return;

  // Typical replacements:
  // "bg-white" -> "bg-[#1A1D27]"
  // "bg-gray-50" -> "bg-[#0F1117]"
  // "border-gray-100", "border-gray-200", "border-gray/20" -> "border-white/10"
  // "text-gray-700", "text-gray-800", "text-gray-900" -> "text-white"
  // "text-gray-500", "text-gray-400" -> "text-[#94A3B8]"
  // "text-primary" -> "text-white"
  // "bg-primary" -> "bg-[#6366F1]"
  // "ring-accent" -> "ring-[#6366F1]"
  // "text-accent" -> "text-[#22D3EE]"
  // "shadow-sm", "shadow-md", "shadow-xl" -> we can leave them or change to custom glow

  let newContent = content
    .replace(/bg-white/g, 'bg-[#1A1D27]')
    .replace(/bg-gray-50/g, 'bg-[#0F1117]')
    .replace(/bg-gray-100/g, 'bg-white/5')
    .replace(/border-gray-100/g, 'border-white/10')
    .replace(/border-gray-200/g, 'border-white/10')
    .replace(/border-gray\/20/g, 'border-white/10')
    .replace(/border /g, 'border border-white/10 ')
    .replace(/text-gray-900/g, 'text-white')
    .replace(/text-gray-800/g, 'text-white')
    .replace(/text-gray-700/g, 'text-[#F1F5F9]')
    .replace(/text-gray-600/g, 'text-[#94A3B8]')
    .replace(/text-gray-500/g, 'text-[#94A3B8]')
    .replace(/text-gray-400/g, 'text-[#94A3B8]')
    .replace(/text-primary/g, 'text-white')
    .replace(/bg-primary/g, 'bg-[#6366F1]')
    .replace(/hover:bg-gray-50/g, 'hover:bg-white/5')
    .replace(/hover:bg-gray-100/g, 'hover:bg-white/10')
    .replace(/hover:bg-gray-200/g, 'hover:bg-white/10')
    .replace(/text-accent/g, 'text-[#22D3EE]')
    .replace(/ring-accent/g, 'ring-[#6366F1]')
    .replace(/ring-primary/g, 'ring-[#6366F1]')
    .replace(/focus:border-accent/g, 'focus:border-[#6366F1]')
    .replace(/focus:border-primary/g, 'focus:border-[#6366F1]');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated', path.basename(filePath));
  }
}

const files = fs.readdirSync(adminDir);
files.forEach(f => {
  if (f.endsWith('.tsx')) {
    updateFile(path.join(adminDir, f));
  }
});
