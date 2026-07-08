const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('src/components/home');
files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  // Match <section id="..." className="..."
  code = code.replace(/<section([^>]*?)className="/g, '<section$1className="animate-on-scroll ');
  fs.writeFileSync(file, code);
});
