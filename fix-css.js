const fs = require('fs');
const path = require('path');

function run(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      run(fullPath);
    } else if (fullPath.endsWith('.css')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // We look for @media (prefers-color-scheme: dark) { .className { ... } }
      // The regex needs to capture the className and its content
      const regex = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*\.([a-zA-Z0-9_-]+)\s*\{([\s\S]*?)\}\s*\}/g;
      const updated = content.replace(regex, ':global(html.dark) .$1 {$2}');
      
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated);
        console.log('Fixed syntax in', fullPath);
      }
    }
  }
}

run('app');
console.log('Done fixing css modules.');
