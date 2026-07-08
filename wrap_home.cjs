const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(/return \(\n    <>\n/g, 'return (\n    <div className="home-page overflow-x-hidden">\n');
code = code.replace(/    <\/>\n  \);\n\}/g, '    </div>\n  );\n}');

fs.writeFileSync('src/pages/Home.tsx', code);
