const fs = require('fs');
let code = fs.readFileSync('src/components/layout/Layout.tsx', 'utf8');
code = code.replace("import CookieConsent from './CookieConsent';", "import CookieConsent from './CookieConsent';\nimport CanvasParticles from '../home/CanvasParticles';");
code = code.replace('<div className="relative z-10 flex flex-col min-h-screen">', '<div className="fixed inset-0 z-0 pointer-events-none">\n        <CanvasParticles />\n      </div>\n      <div className="relative z-10 flex flex-col min-h-screen">');
fs.writeFileSync('src/components/layout/Layout.tsx', code);
