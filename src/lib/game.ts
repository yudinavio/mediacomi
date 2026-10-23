/**
 * Модель игры и сохранение прогресса в localStorage.
 * Сохраняются только id объявлений и ставки — без настоящих цен:
 * цены берутся из данных при восстановлении.
 */
import { LISTINGS, SLIDER_BOUNDS, type Listing } from './listings.generated';
import type { RoundResult } from './scoring';

export const TARGET_ROUNDS = 10;
export const STORAGE_KEY = 'pochem-dacha:game:v1';

export type GamePhase = 'playing' | 'finished';

export interface GameState {
  version: 1;
  seed: number;
  /** id объявлений в порядке раундов */
  listingIds: string[];
  /** ставка, если раунд уже отвечен (индекс = номер раунда) */
  answers: (number | null)[];
  phase: GamePhase;
}

/** Перемешивание Фишера–Йетса с детерминированным ГПСЧ (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rnd: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Подходящие объявления: корректная положительная цена (фильтр уже на этапе сборки). */
export function eligibleListings(): Listing[] {
  return LISTINGS.filter((l) => Number.isFinite(l.price) && l.price > 0);
}

/** Сколько раундов будет в игре при текущем наборе данных. */
export function roundsCount(poolSize: number): number {
  return Math.min(TARGET_ROUNDS, poolSize);
}

export function createNewGame(pool: Listing[] = eligibleListings()): GameState {
  if (pool.length === 0) throw new Error('Нет объявлений с корректной ценой');
  const seed = (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
  const count = roundsCount(pool.length);
  const picked = shuffle(pool, mulberry32(seed)).slice(0, count);
  return {
    version: 1,
    seed,
    listingIds: picked.map((l) => l.id),
    answers: Array(count).fill(null),
    phase: 'playing',
  };
}

export function getListingById(id: string): Listing | undefined {
  return LISTINGS.find((l) => l.id === id);
}

export function listingsOfGame(state: GameState): Listing[] {
  return state.listingIds.map((id) => getListingById(id)).filter((l): l is Listing => !!l);
}

/** Индекс текущего раунда (первого без ответа). */
export function currentRoundIndex(state: GameState): number {
  const i = state.answers.findIndex((a) => a === null);
  return i === -1 ? state.answers.length : i;
}

export function totalScoreOf(state: GameState): number {
  let sum = 0;
  state.answers.forEach((guess, i) => {
    if (guess === null) return;
    const l = getListingById(state.listingIds[i]);
    if (!l) return;
    sum += scoreForGuess(guess, l.price);
  });
  return sum;
}

import { calcRoundScore } from './scoring';
function scoreForGuess(guess: number, price: number): number {
  return calcRoundScore(guess, price);
}

export function resultsOfGame(state: GameState): RoundResult[] {
  const out: RoundResult[] = [];
  state.answers.forEach((guess, i) => {
    if (guess === null) return;
    const l = getListingById(state.listingIds[i]);
    if (!l) return;
    out.push({
      listingId: l.id,
      guess,
      actualPrice: l.price,
      difference: guess - l.price,
      errorPercent: (Math.abs(guess - l.price) / l.price) * 100,
      roundScore: calcRoundScore(guess, l.price),
    });
  });
  return out;
}

// ---------- проверка сохранённых данных ----------
export function isValidState(x: unknown): x is GameState {
  if (!x || typeof x !== 'object') return false;
  const s = x as Record<string, unknown>;
  if (s.version !== 1) return false;
  if (typeof s.seed !== 'number' || !Number.isFinite(s.seed)) return false;
  if (s.phase !== 'playing' && s.phase !== 'finished') return false;
  if (!Array.isArray(s.listingIds) || s.listingIds.length === 0) return false;
  if (!Array.isArray(s.answers) || s.answers.length !== (s.listingIds as unknown[]).length)
    return false;
  if (new Set(s.listingIds).size !== s.listingIds.length) return false; // без повторов
  for (const id of s.listingIds) {
    if (typeof id !== 'string' || !getListingById(id)) return false;
  }
  for (const a of s.answers) {
    if (a !== null && (typeof a !== 'number' || !Number.isInteger(a) || a < 0)) return false;
  }
  const answered = (s.answers as (number | null)[]).filter((a) => a !== null).length;
  if (s.phase === 'finished' && answered !== s.listingIds.length) return false;
  if (s.phase === 'playing' && answered === s.listingIds.length) return false;
  return true;
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* приватный режим — игра продолжается без сохранения */
  }
}

export function clearGame(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* noop */
  }
}

/** Стартовая позиция бегунка: середина общего диапазона, не зависит от цены дачи. */
export function defaultGuess(): number {
  const mid = Math.round((SLIDER_BOUNDS.min + SLIDER_BOUNDS.max) / 2);
  return Math.round(mid / 10000) * 10000;
}
