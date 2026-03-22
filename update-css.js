const fs = require('fs');
const path = require('path');

function walk(dir) {
  let entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    let res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      walk(res);
    } else if (res.endsWith('.css')) {
      let content = fs.readFileSync(res, 'utf8');
      if (content.includes('@media (prefers-color-scheme: dark)')) {
        let updated = content.replace(/@media \(prefers-color-scheme: dark\)/g, ':global(html.dark)');
        fs.writeFileSync(res, updated);
        console.log('Updated', res);
      }
    }
  }
}

walk(path.join(process.cwd(), 'app'));
