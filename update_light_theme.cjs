const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'src', 'pages', 'admin');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  let newContent = content
    .replace(/bg-\[#0F1117\]/g, 'bg-[#F8FAFC]')
    .replace(/bg-\[#1A1D27\]/g, 'bg-white')
    .replace(/border-white\/10/g, 'border-[#E2E8F0]')
    .replace(/border-white\/20/g, 'border-[#E2E8F0]')
    .replace(/text-white/g, 'text-[#0F172A]')
    .replace(/text-\[#F1F5F9\]/g, 'text-[#1E293B]')
    .replace(/text-\[#94A3B8\]/g, 'text-[#64748B]')
    .replace(/bg-\[#6366F1\]/g, 'bg-[#1B3F7A]')
    .replace(/text-\[#6366F1\]/g, 'text-[#1B3F7A]')
    .replace(/bg-\[#6366F1\]\/10/g, 'bg-[#EEF3FB]')
    .replace(/bg-\[#6366F1\]\/20/g, 'bg-[#EEF3FB]')
    .replace(/hover:bg-\[#6366F1\]\/90/g, 'hover:bg-[#2960B0]')
    .replace(/ring-\[#6366F1\]/g, 'ring-[#1B3F7A]')
    .replace(/border-\[#6366F1\]/g, 'border-[#1B3F7A]')
    .replace(/hover:bg-white\/5/g, 'hover:bg-[#F8FAFC]')
    .replace(/hover:bg-white\/10/g, 'hover:bg-[#F1F5F9]')
    .replace(/bg-white\/5/g, 'bg-[#F8FAFC]')
    .replace(/bg-white\/10/g, 'bg-[#F1F5F9]');

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
