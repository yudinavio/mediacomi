/**
 * make-images.mjs — локальная подготовка «фотографий».
 *
 * В исходном CSV столбец photos пуст, поэтому вместо настоящих снимков
 * генерируются декоративные SVG-иллюстрации дач (по 3 на объявление) и
 * заглушка placeholder.svg. При появлении реальных фото их нужно скачать в
 * public/images/ и указать пути в столбце photos CSV (см. README).
 *
 * Запуск: node scripts/make-images.mjs (вызывается автоматически из prepare:data?
 * нет — запускается отдельно или через `npm run prepare:images`).
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('public/images');
fs.mkdirSync(OUT, { recursive: true });

const PALETTES = [
  { sky: '#EAF3E4', sun: '#F4C95D', ground: '#CFE3B8', house: '#F7F3E8', roof: '#D98262', accent: '#287A50' },
  { sky: '#F2EBDA', sun: '#F4C95D', ground: '#DCE8C4', house: '#F1E4CE', roof: '#287A50', accent: '#D98262' },
  { sky: '#E7EFE9', sun: '#F7DFA0', ground: '#C7DEB4', house: '#FBF6EA', roof: '#B96A4E', accent: '#287A50' },
];

// Варианты сцен: дом, баня у деревьев, теплица/грядка, пруд с домиком
function scene(i, p) {
  const common = `<rect width="800" height="600" fill="${p.sky}"/>
  <circle cx="660" cy="110" r="60" fill="${p.sun}"/>
  ${[0, 1, 2].map((k) => `<path d="M${120 + k * 240} 100 q18 -34 36 0 q18 -34 36 0 z" fill="#ffffff" opacity="0.7"/>`).join('\n')}
  <path d="M0 430 Q200 380 400 425 T800 420 V600 H0 Z" fill="${p.ground}"/>`;

  const trees = `<g>
    <rect x="96" y="330" width="16" height="100" rx="6" fill="#8a5a3b"/>
    <circle cx="104" cy="300" r="58" fill="${p.accent}" opacity="0.9"/>
    <rect x="676" y="350" width="14" height="86" rx="6" fill="#8a5a3b"/>
    <circle cx="683" cy="322" r="46" fill="${p.accent}" opacity="0.75"/>
  </g>`;

  switch (i % 4) {
    case 0: // дом с верандой
      return `${common}${trees}
      <g>
        <rect x="250" y="270" width="300" height="160" rx="8" fill="${p.house}" stroke="${p.accent}" stroke-width="4"/>
        <path d="M230 275 L400 165 L570 275 Z" fill="${p.roof}"/>
        <rect x="370" y="340" width="60" height="90" rx="6" fill="${p.accent}"/>
        <rect x="285" y="305" width="60" height="55" rx="6" fill="#bcd8e8" stroke="${p.accent}" stroke-width="4"/>
        <rect x="455" y="305" width="60" height="55" rx="6" fill="#bcd8e8" stroke="${p.accent}" stroke-width="4"/>
        <rect x="180" y="360" width="70" height="70" rx="6" fill="none" stroke="${p.accent}" stroke-width="5"/>
        <path d="M180 360 h70 M180 395 h70 M203 360 v70 M227 360 v70" stroke="${p.accent}" stroke-width="4"/>
      </g>
      <circle cx="600" cy="455" r="14" fill="#c94f4f"/><circle cx="628" cy="462" r="12" fill="#c94f4f"/>`;
    case 1: // баня у пруда
      return `${common}
      <ellipse cx="400" cy="520" rx="330" ry="55" fill="#a9d3e8"/>
      <g>
        <rect x="180" y="300" width="200" height="130" rx="8" fill="${p.house}" stroke="${p.accent}" stroke-width="4"/>
        <path d="M165 305 L280 220 L395 305 Z" fill="${p.roof}"/>
        <rect x="255" y="360" width="46" height="70" rx="5" fill="${p.accent}"/>
        <rect x="198" y="325" width="40" height="36" rx="5" fill="#bcd8e8" stroke="${p.accent}" stroke-width="3"/>
        <path d="M330 330 q10 -18 0 -36 q-10 -18 0 -36" stroke="#9db8ab" stroke-width="6" fill="none" stroke-linecap="round"/>
      </g>
      ${trees.replace('676', '560').replace('683', '567')}`;
    case 2: // теплица и грядки
      return `${common}
      <g>
        <path d="M160 430 V320 Q280 240 400 320 V430 Z" fill="#dff0f5" stroke="${p.accent}" stroke-width="5"/>
        <path d="M220 430 V310 M280 430 V290 M340 430 V310" stroke="${p.accent}" stroke-width="3" opacity="0.6"/>
      </g>
      <g>${[0, 1, 2].map((k) => `<rect x="450" y="${360 + k * 30}" width="260" height="14" rx="7" fill="#8a5a3b"/>
        ${[0, 1, 2, 3, 4].map((j) => `<circle cx="${475 + j * 55}" cy="${356 + k * 30}" r="9" fill="${p.accent}"/>`).join('')}`).join('')}</g>
      ${trees}`;
    default: // дом у леса на закате
      return `${common.replace(p.sky, '#F6E7C8')}
      <g opacity="0.85">${[0, 1, 2, 3, 4].map((k) => `<path d="M${60 + k * 150} 400 l40 -130 l40 130 z" fill="#3c6b4f"/>`).join('')}</g>
      <g>
        <rect x="300" y="290" width="220" height="140" rx="8" fill="${p.house}" stroke="${p.accent}" stroke-width="4"/>
        <path d="M285 295 L410 200 L535 295 Z" fill="${p.roof}"/>
        <rect x="380" y="355" width="52" height="75" rx="5" fill="${p.accent}"/>
        <rect x="318" y="315" width="44" height="40" rx="5" fill="#f4d97a" stroke="${p.accent}" stroke-width="3"/>
        <rect x="452" y="315" width="44" height="40" rx="5" fill="#f4d97a" stroke="${p.accent}" stroke-width="3"/>
      </g>`;
  }
}

function svg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img">${inner}</svg>`;
}

const ids = Array.from({ length: 15 }, (_, i) => `d${String(i + 1).padStart(2, '0')}`);
for (const id of ids) {
  for (let k = 0; k < 3; k++) {
    const pal = PALETTES[(k + ids.indexOf(id)) % PALETTES.length];
    fs.writeFileSync(path.join(OUT, `${id}-${k + 1}.svg`), svg(scene(k + ids.indexOf(id), pal)));
  }
}

// Заглушка для отсутствующих/повреждённых фото
fs.writeFileSync(
  path.join(OUT, 'placeholder.svg'),
  svg(`<rect width="800" height="600" fill="#EFE9DB"/>
  <path d="M300 340 L400 250 L500 340 V430 H300 Z" fill="none" stroke="#287A50" stroke-width="10" stroke-linejoin="round"/>
  <path d="M270 345 L400 235 L530 345" fill="none" stroke="#D98262" stroke-width="10" stroke-linecap="round"/>
  <text x="400" y="500" font-family="Georgia, serif" font-size="30" fill="#287A50" text-anchor="middle">Фото недоступно</text>`),
);

// favicon
fs.writeFileSync(
  path.join(OUT, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#287A50"/><path d="M14 34 L32 18 L50 34 V50 H14 Z" fill="#F7F3E8"/><path d="M10 36 L32 14 L54 36" fill="none" stroke="#F4C95D" stroke-width="5" stroke-linecap="round"/></svg>`,
);

console.log(`Сгенерировано иллюстраций в ${OUT}`);
