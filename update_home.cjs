const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(/document.querySelectorAll\('section'\).forEach\(el => \{/g, `document.querySelectorAll('section').forEach(el => {
        if (!el.classList.contains('animate-on-scroll')) {
          el.classList.add('animate-on-scroll');
        }`);

fs.writeFileSync('src/pages/Home.tsx', code);
