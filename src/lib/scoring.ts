/**
 * Чистые функции подсчёта баллов, формулировок и титулов.
 * Используются игрой и тестами (tests/scoring.test.ts).
 */

export interface RoundResult {
  listingId: string;
  guess: number;
  actualPrice: number;
  /** guess - actualPrice */
  difference: number;
  /** |difference| / actualPrice * 100 */
  errorPercent: number;
  roundScore: number;
}

/** Баллы за раунд: 100 при точном попадании, 0 при ошибке ≥ 50%. */
export function calcRoundScore(guess: number, actualPrice: number): number {
  if (actualPrice <= 0) return 0;
  const errorPercent = Math.abs(guess - actualPrice) / actualPrice * 100;
  return Math.round(100 * Math.max(0, 1 - errorPercent / 50));
}

export function calcErrorPercent(guess: number, actualPrice: number): number {
  if (actualPrice <= 0) return 0;
  return (Math.abs(guess - actualPrice) / actualPrice) * 100;
}

export function makeRoundResult(listingId: string, guess: number, actualPrice: number): RoundResult {
  return {
    listingId,
    guess,
    actualPrice,
    difference: guess - actualPrice,
    errorPercent: calcErrorPercent(guess, actualPrice),
    roundScore: calcRoundScore(guess, actualPrice),
  };
}

/** «Точное попадание!» / «Твоя оценка выше цены объявления на … ₽» */
export function directionText(r: RoundResult, fmtRub: (n: number) => string): string {
  if (r.difference === 0) return 'Точное попадание!';
  const abs = fmtRub(Math.abs(r.difference));
  return r.difference > 0
    ? `Твоя оценка выше цены объявления на ${abs}`
    : `Твоя оценка ниже цены объявления на ${abs}`;
}

/** Игровой комментарий по величине ошибки. */
export function commentByError(errorPercent: number): string {
  if (errorPercent <= 5) return 'Вот это дачное чутьё!';
  if (errorPercent <= 15) return 'Почти договорились';
  if (errorPercent <= 30) return 'Есть повод поторговаться с интуицией';
  return 'Кажется, грядки сбили тебя с толку';
}

export interface GameSummary {
  totalScore: number;
  maxScore: number;
  roundsPlayed: number;
  avgAbsErrorPercent: number;
  /** сумма только положительных difference */
  overpay: number;
  /** сумма модулей только отрицательных difference */
  underprice: number;
  bestRound: RoundResult | null;
  titleKey: TitleKey;
}

export type TitleKey = 'expert' | 'generous' | 'bargainer' | 'optimist';

export const TITLES: Record<TitleKey, { name: string; description: string }> = {
  expert: {
    name: 'Дачный эксперт',
    description: 'Ты уверенно отличаешь скромный домик от дачи с ценником за мечту',
  },
  generous: {
    name: 'Щедрый дачник',
    description: 'За уютную веранду ты готов доплатить. Иногда — слишком щедро',
  },
  bargainer: {
    name: 'Мастер торга',
    description: 'Ты ищешь выгодную сделку даже там, где продавец уже всё посчитал',
  },
  optimist: {
    name: 'Дачный оптимист',
    description: 'Сегодня оценки разошлись в разные стороны. Следующая попытка поможет настроить чутьё',
  },
};

/** Титул по средней абсолютной ошибке и направлению оценок. */
export function pickTitle(results: RoundResult[]): TitleKey {
  if (results.length === 0) return 'optimist';
  const avg = results.reduce((s, r) => s + r.errorPercent, 0) / results.length;
  if (avg <= 15) return 'expert';
  const sumDiff = results.reduce((s, r) => s + r.difference, 0);
  if (sumDiff > 0) return 'generous';
  if (sumDiff < 0) return 'bargainer';
  return 'optimist';
}

export function summarize(results: RoundResult[]): GameSummary {
  const totalScore = results.reduce((s, r) => s + r.roundScore, 0);
  const avgAbsErrorPercent =
    results.length === 0
      ? 0
      : results.reduce((s, r) => s + r.errorPercent, 0) / results.length;
  const overpay = results
    .filter((r) => r.difference > 0)
    .reduce((s, r) => s + r.difference, 0);
  const underprice = results
    .filter((r) => r.difference < 0)
    .reduce((s, r) => s + Math.abs(r.difference), 0);
  const bestRound =
    results.length === 0
      ? null
      : results.reduce((best, r) => (r.roundScore > best.roundScore ? r : best), results[0]);
  return {
    totalScore,
    maxScore: results.length * 100,
    roundsPlayed: results.length,
    avgAbsErrorPercent,
    overpay,
    underprice,
    bestRound,
    titleKey: pickTitle(results),
  };
}

// ---------- форматирование ----------
const nf = new Intl.NumberFormat('ru-RU');

/** «3 450 000 ₽» (неразрывные пробелы) */
export function formatRub(n: number): string {
  return `${nf.format(Math.round(n))}\u00a0₽`;
}

/** «12,5%» */
export function formatPercent(p: number): string {
  const rounded = Math.round(p * 10) / 10;
  return `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }).format(rounded)}%`;
}
