/**
 * Проверки чистых функций подсчёта и граничных случаев.
 * Запуск: npm test (tsx). Без внешних тестовых библиотек.
 */
import {
  calcRoundScore,
  directionText,
  formatRub,
  makeRoundResult,
  pickTitle,
  summarize,
} from '../src/lib/scoring';
import { createNewGame, isValidState, roundsCount } from '../src/lib/game';
import { LISTINGS } from '../src/lib/listings.generated';

let failed = 0;
function check(name: string, cond: boolean) {
  if (!cond) {
    failed++;
    console.error(`FAIL: ${name}`);
  } else {
    console.log(`ok:   ${name}`);
  }
}

// ---- формулы баллов ----
check('точное попадание = 100', calcRoundScore(1000000, 1000000) === 100);
check('ошибка 5% = 90', calcRoundScore(1050000, 1000000) === 90);
check('ошибка -5% = 90', calcRoundScore(950000, 1000000) === 90);
check('ошибка 10% = 80', calcRoundScore(1100000, 1000000) === 80);
check('ошибка 25% = 50', calcRoundScore(1250000, 1000000) === 50);
check('ошибка 50% = 0', calcRoundScore(1500000, 1000000) === 0);
check('ошибка >50% = 0', calcRoundScore(3000000, 1000000) === 0);
check('сильное занижение = 0', calcRoundScore(100000, 1000000) === 0);

// ---- направление разницы ----
const up = makeRoundResult('x', 1200000, 1000000);
const down = makeRoundResult('x', 800000, 1000000);
const eq = makeRoundResult('x', 1000000, 1000000);
check('difference выше > 0', up.difference === 200000);
check('difference ниже < 0', down.difference === -200000);
check('формулировка «выше»', directionText(up, formatRub).includes('выше цены объявления на 200\u00a0000'));
check('формулировка «ниже»', directionText(down, formatRub).includes('ниже цены объявления на 200\u00a0000'));
check('равенство — точное попадание', directionText(eq, formatRub) === 'Точное попадание!');

// ---- переплата/недооценка считаются отдельно ----
const s = summarize([up, down, eq]);
check('условная переплата = сумма положительных', s.overpay === 200000);
check('условная недооценка = сумма модулей отрицательных', s.underprice === 200000);
check('максимум = раунды × 100', s.maxScore === 300);
check('лучший раунд = 100', s.bestRound?.roundScore === 100);

// ---- титулы ----
const mk = (guesses: number[], prices: number[]) =>
  guesses.map((g, i) => makeRoundResult('r', g, prices[i]));

const expert = mk([1000000, 1050000], [1000000, 1000000]); // avg 2.5%
check('avg<=15% → эксперт', pickTitle(expert) === 'expert');
const generous = mk([1400000, 1500000], [1000000, 1000000]); // avg 45%, sumDiff>0
check('sumDiff>0 → щедрый', pickTitle(generous) === 'generous');
const bargainer = mk([600000, 500000], [1000000, 1000000]); // sumDiff<0
check('sumDiff<0 → мастер торга', pickTitle(bargainer) === 'bargainer');
const balanced = mk([1400000, 600000], [1000000, 1000000]); // sumDiff=0, avg=40%
check('sumDiff=0 → оптимист', pickTitle(balanced) === 'optimist');

// ---- формат ----
check('формат цены', formatRub(3450000).replace(/\u00a0| /g, ' ') === '3 450 000 ₽');

// ---- неполный набор объявлений ----
check('roundsCount(4) = 4', roundsCount(4) === 4);
check('roundsCount(15) = 10', roundsCount(15) === 10);
const smallPool = LISTINGS.slice(0, 4);
const g = createNewGame(smallPool);
check('игра из 4 раундов', g.answers.length === 4 && g.listingIds.length === 4);
check('объявления не повторяются', new Set(g.listingIds).size === g.listingIds.length);
check('все id существуют', g.listingIds.every((id) => LISTINGS.some((l) => l.id === id)));

// maxScore для неполной игры
const partial = summarize([makeRoundResult('a', 1000000, 1000000), makeRoundResult('b', 1100000, 1000000)]);
check('maxScore при 2 раундах = 200', partial.maxScore === 200);

// ---- валидация сохранённых данных ----
check('валидное состояние проходит', isValidState(g));
check('мусор отклоняется', !isValidState(null) && !isValidState({}) && !isValidState('str'));
check('повторы id отклоняются', !isValidState({ ...g, listingIds: [g.listingIds[0], g.listingIds[0]], answers: [null, null] }));
check('несуществующий id отклоняется', !isValidState({ ...g, listingIds: ['nope'], answers: [null] }));
check('finished без всех ответов отклоняется', !isValidState({ ...g, phase: 'finished' }));
check('answer не-число отклоняется', !isValidState({ ...g, answers: ['x', ...g.answers.slice(1)] }));

process.exit(failed === 0 ? 0 : 1);
