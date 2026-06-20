const fs = require('fs');
const path = require('path');

const manuals = [
  'manual-aluno.html',
  'manual-candidato.html',
  'manual-professor.html',
  'manual-secretaria.html'
];

const docsDir = __dirname;
const imgRegex = /src="(printscreens\/[^"]+)"/g;

manuals.forEach(file => {
  const filePath = path.join(docsDir, file);
  let html = fs.readFileSync(filePath, 'utf-8');
  let totalBytes = 0;
  let count = 0;

  html = html.replace(imgRegex, (match, p1) => {
    const absPath = path.join(docsDir, p1);
    if (!fs.existsSync(absPath)) {
      console.warn(`  NOT FOUND: ${p1}`);
      return match;
    }
    const ext = path.extname(absPath).slice(1);
    const mime = ext === 'png' ? 'image/png' : 'image/jpeg';
    const data = fs.readFileSync(absPath);
    const b64 = data.toString('base64');
    totalBytes += data.length;
    count++;
    return `src="data:${mime};base64,${b64}"`;
  });

  const sizeMb = (totalBytes / (1024 * 1024)).toFixed(1);
  console.log(`${file}: ${count} imagens inline, ${sizeMb}MB adicionados`);
  fs.writeFileSync(filePath, html, 'utf-8');
});
