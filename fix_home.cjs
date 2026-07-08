const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(/document\.querySelectorAll\('section'\)\.forEach\(el => \{\n        if \(!el\.classList\.contains\('animate-on-scroll'\)\) \{\n          el\.classList\.add\('animate-on-scroll'\);\n        \}\n        observer\.observe\(el\);\n      \}\);/g, `      document.querySelectorAll('section').forEach(el => {
        observer.observe(el);
      });`);

fs.writeFileSync('src/pages/Home.tsx', code);
