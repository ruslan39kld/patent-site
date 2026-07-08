const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/\.home-page section \{\n  opacity: 0;\n  transform: translateY\(40px\);\n  transition: opacity 0\.8s cubic-bezier\(0\.16, 1, 0\.3, 1\), transform 0\.8s cubic-bezier\(0\.16, 1, 0\.3, 1\);\n  will-change: opacity, transform;\n\}\n\.home-page section\.visible \{\n  opacity: 1;\n  transform: translateY\(0\);\n\}/g, '');

fs.writeFileSync('src/index.css', css);
