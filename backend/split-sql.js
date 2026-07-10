const fs = require('fs');
const sql = fs.readFileSync('database/dados-50k.sql', 'utf8');

// Remove the initial BEGIN; from the file, we'll add per-part
const clean = sql.replace(/^BEGIN;\n\n/, '');

// Split by '-- <tablename>:' sections
const sections = clean.split(/\n(?=-- \w+:)/);

let part = 1;
let current = '';
let size = 0;
const maxSize = 850 * 1024;

function flush() {
  if (!current) return;
  const out = 'database/dados-part' + part + '.sql';
  fs.writeFileSync(out, 'BEGIN;\n\n' + current + '\n\nCOMMIT;\n');
  console.log(out + ' - ' + (fs.statSync(out).size / 1024).toFixed(0) + ' KB');
  part++;
  current = '';
  size = 0;
}

for (const s of sections) {
  if (size + s.length > maxSize) {
    flush();
  }
  // If single section is huge, split by INSERT INTO
  if (s.length > maxSize) {
    const inserts = s.split(/\n(?=INSERT INTO)/);
    for (const ins of inserts) {
      if (size + ins.length > maxSize) flush();
      current += (current ? '\n' : '') + ins;
      size += ins.length;
    }
  } else {
    current += (current ? '\n' : '') + s;
    size += s.length;
  }
}
flush();

console.log('Total: ' + (part - 1) + ' partes');
