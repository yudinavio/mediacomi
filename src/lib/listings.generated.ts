/**
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

export const LISTINGS: Listing[] = [
  {
    "id": "d01",
    "title": "Летний домик среди берёз",
    "price": 1250000,
    "location": "СНТ Берёзка",
    "houseArea": 36,
    "landArea": 6,
    "distance": 65,
    "material": "Дерево",
    "electricity": "Есть",
    "water": "Летний водопровод",
    "heating": "Нет",
    "description": "Небольшой летний дом, участок с ягодными кустами и место для отдыха.",
    "photos": [
      "/images/d01-1.svg",
      "/images/d01-2.svg",
      "/images/d01-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d02",
    "title": "Дача с верандой и яблонями",
    "price": 2450000,
    "location": "СНТ Яблоневый сад",
    "houseArea": 58,
    "landArea": 8,
    "distance": 42,
    "material": "Дерево",
    "electricity": "Есть",
    "water": "Колодец",
    "heating": "Печное",
    "description": "Две комнаты, крытая веранда и плодовый сад.",
    "photos": [
      "/images/d02-1.svg",
      "/images/d02-2.svg",
      "/images/d02-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d03",
    "title": "Кирпичная дача у леса",
    "price": 3900000,
    "location": "Посёлок Лесной",
    "houseArea": 85,
    "landArea": 10,
    "distance": 55,
    "material": "Кирпич",
    "electricity": "Есть",
    "water": "Скважина",
    "heating": "Печное",
    "description": "Двухэтажный дом рядом с лесом, теплица и хозяйственный блок.",
    "photos": [
      "/images/d03-1.svg",
      "/images/d03-2.svg",
      "/images/d03-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d04",
    "title": "Небольшая дача под ремонт",
    "price": 680000,
    "location": "СНТ Ручеёк",
    "houseArea": 24,
    "landArea": 4,
    "distance": 90,
    "material": "Дерево",
    "electricity": "Есть",
    "water": "Нет",
    "heating": "Нет",
    "description": "Компактный домик под ремонт. Участок огорожен, есть взрослые деревья.",
    "photos": [
      "/images/d04-1.svg",
      "/images/d04-2.svg",
      "/images/d04-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d05",
    "title": "Дом с баней и просторным участком",
    "price": 5750000,
    "location": "Деревня Сосновка",
    "houseArea": 96,
    "landArea": 15,
    "distance": 70,
    "material": "Брус",
    "electricity": "Есть",
    "water": "Скважина",
    "heating": "Электрическое",
    "description": "Дом с террасой, отдельная баня и большой участок.",
    "photos": [
      "/images/d05-1.svg",
      "/images/d05-2.svg",
      "/images/d05-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d06",
    "title": "Современная дача с панорамными окнами",
    "price": 8900000,
    "location": "Посёлок Солнечный",
    "houseArea": 110,
    "landArea": 9,
    "distance": 35,
    "material": "Каркас",
    "electricity": "Есть",
    "water": "Скважина",
    "heating": "Электрическое",
    "description": "Светлая кухня-гостиная, две спальни и открытая терраса.",
    "photos": [
      "/images/d06-1.svg",
      "/images/d06-2.svg",
      "/images/d06-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d07",
    "title": "Садовый домик рядом с прудом",
    "price": 1650000,
    "location": "СНТ Тихий пруд",
    "houseArea": 40,
    "landArea": 7,
    "distance": 75,
    "material": "Дерево",
    "electricity": "Есть",
    "water": "Летний водопровод",
    "heating": "Печное",
    "description": "Уютный дом с мансардой. На участке смородина и небольшой огород.",
    "photos": [
      "/images/d07-1.svg",
      "/images/d07-2.svg",
      "/images/d07-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d08",
    "title": "Дача с большой теплицей",
    "price": 2100000,
    "location": "СНТ Урожай",
    "houseArea": 48,
    "landArea": 12,
    "distance": 60,
    "material": "Дерево",
    "electricity": "Есть",
    "water": "Колодец",
    "heating": "Печное",
    "description": "Дом для сезонного отдыха, большая теплица и оборудованные грядки.",
    "photos": [
      "/images/d08-1.svg",
      "/images/d08-2.svg",
      "/images/d08-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d09",
    "title": "Двухэтажный дом для большой семьи",
    "price": 6400000,
    "location": "Деревня Луговая",
    "houseArea": 140,
    "landArea": 14,
    "distance": 80,
    "material": "Газобетон",
    "electricity": "Есть",
    "water": "Скважина",
    "heating": "Электрическое",
    "description": "Четыре спальни, просторная гостиная и крытая парковка.",
    "photos": [
      "/images/d09-1.svg",
      "/images/d09-2.svg",
      "/images/d09-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d10",
    "title": "Участок с простым летним домом",
    "price": 950000,
    "location": "СНТ Полянка",
    "houseArea": 30,
    "landArea": 5,
    "distance": 100,
    "material": "Дерево",
    "electricity": "Есть",
    "water": "Колодец",
    "heating": "Нет",
    "description": "Простой летний дом и ровный участок с местом под огород.",
    "photos": [
      "/images/d10-1.svg",
      "/images/d10-2.svg",
      "/images/d10-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d11",
    "title": "Дача с камином и террасой",
    "price": 4600000,
    "location": "Посёлок Вереск",
    "houseArea": 78,
    "landArea": 8,
    "distance": 48,
    "material": "Брус",
    "electricity": "Есть",
    "water": "Скважина",
    "heating": "Печное",
    "description": "Две спальни, гостиная с камином и терраса с видом на сад.",
    "photos": [
      "/images/d11-1.svg",
      "/images/d11-2.svg",
      "/images/d11-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d12",
    "title": "Дом у опушки с гостевым домиком",
    "price": 7200000,
    "location": "Деревня Зелёный бор",
    "houseArea": 120,
    "landArea": 18,
    "distance": 62,
    "material": "Брус",
    "electricity": "Есть",
    "water": "Скважина",
    "heating": "Электрическое",
    "description": "Основной дом, небольшой гостевой домик и участок у опушки.",
    "photos": [
      "/images/d12-1.svg",
      "/images/d12-2.svg",
      "/images/d12-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d13",
    "title": "Дача с винтажной верандой",
    "price": 1850000,
    "location": "СНТ Сирень",
    "houseArea": 45,
    "landArea": 6,
    "distance": 58,
    "material": "Дерево",
    "electricity": "Есть",
    "water": "Летний водопровод",
    "heating": "Печное",
    "description": "Старый дачный дом с застеклённой верандой и кустами сирени.",
    "photos": [
      "/images/d13-1.svg",
      "/images/d13-2.svg",
      "/images/d13-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d14",
    "title": "Компактная новая дача",
    "price": 3350000,
    "location": "СНТ Новый сад",
    "houseArea": 54,
    "landArea": 7,
    "distance": 45,
    "material": "Каркас",
    "electricity": "Есть",
    "water": "Скважина",
    "heating": "Электрическое",
    "description": "Одноэтажный дом с двумя спальнями и небольшой террасой.",
    "photos": [
      "/images/d14-1.svg",
      "/images/d14-2.svg",
      "/images/d14-3.svg"
    ],
    "isDemo": true
  },
  {
    "id": "d15",
    "title": "Просторная дача с мастерской",
    "price": 5100000,
    "location": "Деревня Малиновка",
    "houseArea": 92,
    "landArea": 16,
    "distance": 85,
    "material": "Кирпич",
    "electricity": "Есть",
    "water": "Колодец",
    "heating": "Печное",
    "description": "Дом с мансардой, отдельная мастерская и большой плодовый сад.",
    "photos": [
      "/images/d15-1.svg",
      "/images/d15-2.svg",
      "/images/d15-3.svg"
    ],
    "isDemo": true
  }
];

/** Единый диапазон бегунка для всей игры (рассчитан по всему набору данных). */
export const SLIDER_BOUNDS = { min: 0, max: 9790000 };

export const DATA_IS_DEMO = true;
