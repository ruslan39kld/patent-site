const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(/\.animate-section \{/g, 'section {');
css = css.replace(/section \{\n  opacity: 0;\n  transform: translateY\(40px\);\n  transition: opacity 0\.8s ease-out, transform 0\.8s ease-out;\n\}\nsection\.visible \{\n  opacity: 1;\n  transform: translateY\(0\);\n\}/g, '');

// add back .home-page section
css += `
.home-page section {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}
.home-page section.visible {
  opacity: 1;
  transform: translateY(0);
}
`;

fs.writeFileSync('src/index.css', css);
