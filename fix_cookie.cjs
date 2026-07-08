const fs = require('fs');
let code = fs.readFileSync('src/components/layout/CookieConsent.tsx', 'utf8');

code = code.replace(/const consent = localStorage.getItem\('cookie_consent'\);/g, `
    let consent = null;
    try {
      consent = localStorage.getItem('cookie_consent');
    } catch (e) {
      console.warn("localStorage not available");
    }
`);

code = code.replace(/localStorage.setItem\('cookie_consent', 'true'\);/g, `
    try {
      localStorage.setItem('cookie_consent', 'true');
    } catch (e) {
      console.warn("localStorage not available");
    }
`);

fs.writeFileSync('src/components/layout/CookieConsent.tsx', code);
