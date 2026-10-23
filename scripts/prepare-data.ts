/**
 * prepare-data.ts — этап сборки.
 *
 * Читает data/dacha.csv, нормализует столбцы, выбрасывает объявления без
 * корректной положительной цены, вычищает цены из текстовых полей и пишет
 * src/lib/listings.generated.ts.
 *
 * Формат CSV (заголовки могут быть в любом порядке; распознаются синонимы):
 *   id, title, price, location, house_area_m2, land_area_sotka,
 *   distance_to_city_km, wall_material, electricity, water_supply, heating,
 *   description, photos (ссылки через ';'), is_demo
 *
 * Чтобы подключить новый CSV: замените data/dacha.csv и запустите
 * `npm run prepare:data` (или просто `npm run build`).
 */
import fs from 'node:fs';
import path from 'node:path';

// ---------- разбор CSV ----------
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((f) => f.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== '')) rows.push(row);
  return rows;
}

// ---------- сопоставление столбцов ----------
const SYNONYMS: Record<string, string[]> = {
  id: ['id', 'identifier', 'код'],
  title: ['title', 'name', 'название', 'заголовок'],
  price: ['price', 'цена', 'стоимость', 'price_rub'],
  location: ['location', 'место', 'локация', 'адрес', 'населённый пункт', 'район', 'снт'],
  houseArea: ['house_area_m2', 'house_area', 'площадь дома', 'дом_м2'],
  landArea: ['land_area_sotka', 'land_area', 'участок_сотки', 'сотки', 'площадь участка'],
  distance: ['distance_to_city_km', 'distance', 'расстояние', 'км до города', 'до города'],
  material: ['wall_material', 'material', 'материал', 'материал стен'],
  electricity: ['electricity', 'электричество', 'свет'],
  water: ['water_supply', 'water', 'вода', 'водоснабжение'],
  heating: ['heating', 'отопление'],
  description: ['description', 'описание', 'desc', 'текст'],
  photos: ['photos', 'photo', 'фото', 'фотографии', 'ссылки на фото'],
  isDemo: ['is_demo', 'demo', 'демо'],
};

function findIndex(headers: string[], key: string): number {
  const syns = SYNONYMS[key] ?? [key];
  return headers.findIndex((h) => {
    const n = h.trim().toLowerCase().replace(/[_\-.]/g, ' ');
    const compact = h.trim().toLowerCase();
    return syns.some((s) => compact === s || n === s.replace(/_/g, ' '));
  });
}

// ---------- очистка текста от цен ----------
const PRICE_TEXT_RE =
  /(?:\d[\d\s\u00a0]*(?:[.,]\d{1,3})?\s*(?:₽|руб\.?|рублей|рублей\s*россии|р\.?(?=\s|$)))|(?:цена[:\s]*\d[\d\s\u00a0]*)/giu;

export function scrubPrices(text: string): string {
  return text
    .replace(PRICE_TEXT_RE, '…')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .trim();
}

// ---------- числа ----------
function toNumber(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d.,-]/g, '').replace(',', '.').trim();
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

interface ListingOut {
  id: string;
  title: string;
  price: number;
  location: string | null;
  houseArea: number | null;
  landArea: number | null;
  distance: number | null;
  material: string | null;
  electricity: string | null;
  water: string | null;
  heating: string | null;
  description: string | null;
  photos: string[];
  isDemo: boolean;
}

function main() {
  const csvPath = path.resolve('data/dacha.csv');
  if (!fs.existsSync(csvPath)) {
    console.error(`Не найден файл ${csvPath}. Положите туда CSV с объявлениями.`);
    process.exit(1);
  }
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
  if (rows.length < 2) {
    console.error('CSV пуст или содержит только заголовки.');
    process.exit(1);
  }
  const headers = rows[0];
  const idx = Object.fromEntries(
    Object.keys(SYNONYMS).map((k) => [k, findIndex(headers, k)]),
  ) as Record<string, number>;
  const cell = (r: string[], k: string) => (idx[k] >= 0 ? r[idx[k]]?.trim() ?? '' : '');

  const listings: ListingOut[] = [];
  let skipped = 0;
  for (const r of rows.slice(1)) {
    const price = toNumber(cell(r, 'price'));
    if (price === null || price <= 0) {
      skipped++;
      continue;
    }
    const id = cell(r, 'id') || `l${listings.length + 1}`;
    const photosRaw = cell(r, 'photos');
    // Если в CSV указаны внешние или локальные ссылки — используем их.
    // Иначе ожидаем локально подготовленные иллюстрации /images/<id>-N.svg
    // (см. scripts/make-images.mjs). Недостающие файлы UI заменит заглушкой.
    let photos = photosRaw
      ? photosRaw
          .split(';')
          .map((p) => p.trim())
          .filter(Boolean)
      : [1, 2, 3].map((k) => `/images/${id}-${k}.svg`);
    const desc = scrubPrices(cell(r, 'description'));
    const title = scrubPrices(cell(r, 'title')) || 'Дача без названия';
    listings.push({
      id,
      title,
      price: Math.round(price),
      location: cell(r, 'location') || null,
      houseArea: toNumber(cell(r, 'houseArea')),
      landArea: toNumber(cell(r, 'landArea')),
      distance: toNumber(cell(r, 'distance')),
      material: cell(r, 'material') || null,
      electricity: cell(r, 'electricity') || null,
      water: cell(r, 'water') || null,
      heating: cell(r, 'heating') || null,
      description: desc ? scrubPrices(desc) : null,
      photos,
      isDemo: /^(true|1|да|yes)$/i.test(cell(r, 'isDemo')),
    });
  }

  if (listings.length === 0) {
    console.error('В CSV нет ни одного объявления с корректной положительной ценой.');
    process.exit(1);
  }

  // Диапазон бегунка — единый для всей игры, считается по всему набору.
  const prices = listings.map((l) => l.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const pad = Math.max(50000, Math.round(maxP * 0.1));
  const sliderMin = Math.max(0, Math.floor((minP - pad) / 10000) * 10000);
  const sliderMax = Math.ceil((maxP + pad) / 10000) * 10000;

  const out = `/**
 * ФАЙЛ СОЗДАЁТСЯ АВТОМАТИЧЕСКИ: npm run prepare:data (scripts/prepare-data.ts).
 * Источник данных: data/dacha.csv. Не редактируйте вручную.
 * Настоящие цены скрыты в UI до подтверждения ответа; цены из текстов вычищены.
 */
export interface Listing {
  id: string;
  title: string;
  /** Настоящая цена, ₽. НЕ показывать до ответа пользователя. */
  price: number;
  location: string | null;
  houseArea: number | null;
  landArea: number | null;
  distance: number | null;
  material: string | null;
  electricity: string | null;
  water: string | null;
  heating: string | null;
  description: string | null;
  /** Локальные пути /images/... (подготовлены scripts/make-images.mjs) */
  photos: string[];
  isDemo: boolean;
}

export const LISTINGS: Listing[] = ${JSON.stringify(listings, null, 2)};

/** Единый диапазон бегунка для всей игры (рассчитан по всему набору данных). */
export const SLIDER_BOUNDS = { min: ${sliderMin}, max: ${sliderMax} };

export const DATA_IS_DEMO = ${listings.every((l) => l.isDemo)};
`;

  fs.writeFileSync(path.resolve('src/lib/listings.generated.ts'), out);
  console.log(
    `Подготовлено объявлений: ${listings.length}, пропущено без цены: ${skipped}. ` +
      `Диапазон бегунка: ${sliderMin}–${sliderMax} ₽.`,
  );
}

main();
