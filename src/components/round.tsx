import { useEffect, useMemo, useRef, useState } from 'react';
import type { Listing } from '../lib/listings.generated';
import { SLIDER_BOUNDS } from '../lib/listings.generated';
import { defaultGuess } from '../lib/game';
import {
  commentByError,
  directionText,
  formatPercent,
  formatRub,
  makeRoundResult,
} from '../lib/scoring';
import { Gallery } from './gallery';
import {
  IconApple,
  IconBolt,
  IconBrick,
  IconCheck,
  IconDrop,
  IconFlame,
  IconHouse,
  IconLeaf,
  IconPin,
  IconRoad,
  IconSprout,
  IconStar,
  IconSteam,
  IconSun,
  IconTree,
  IconWater,
} from './icons';

const HINT_KEY = 'pochem-dacha:slider-hint-shown:v1';

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  );
}

/** Компактная плашка характеристики с иконкой. */
function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-xl border border-ink/12 bg-white/70 px-2.5 py-1.5 text-[13px] leading-tight">
      <span className="text-leaf">{icon}</span>
      {label}
    </span>
  );
}

/**
 * Характеристики берутся только из данных объявления. «Баня», «теплица» и т.п.
 * показываются лишь когда действительно упомянуты в описании — мы не
 * придумываем сведения об объектах.
 */
function featureChips(l: Listing) {
  const chips: { icon: React.ReactNode; label: string }[] = [];
  if (l.location) chips.push({ icon: <IconPin size={15} />, label: l.location });
  if (l.houseArea) chips.push({ icon: <IconHouse size={15} />, label: `Дом ${l.houseArea} м²` });
  if (l.landArea) chips.push({ icon: <IconLeaf size={15} />, label: `${l.landArea} соток` });
  if (l.distance) chips.push({ icon: <IconRoad size={15} />, label: `${l.distance} км до города` });
  if (l.material) chips.push({ icon: <IconBrick size={15} />, label: l.material });
  if (l.electricity) chips.push({ icon: <IconBolt size={15} />, label: `Электричество: ${l.electricity.toLowerCase()}` });
  if (l.water) chips.push({ icon: <IconDrop size={15} />, label: `Вода: ${l.water.toLowerCase()}` });
  if (l.heating) chips.push({ icon: <IconFlame size={15} />, label: `Отопление: ${l.heating.toLowerCase()}` });
  const d = (l.description ?? '').toLowerCase();
  if (d.includes('бан')) chips.push({ icon: <IconSteam size={15} />, label: 'Баня' });
  if (d.includes('теплиц')) chips.push({ icon: <IconSprout size={15} />, label: 'Теплица' });
  if (d.includes('веранд') || d.includes('террас'))
    chips.push({ icon: <IconSun size={15} />, label: d.includes('веранд') ? 'Веранда' : 'Терраса' });
  if (d.includes('лес') || d.includes('опушк')) chips.push({ icon: <IconTree size={15} />, label: 'Рядом лес' });
  if (d.includes('пруд') || d.includes('озер') || d.includes('водоём') || d.includes('река'))
    chips.push({ icon: <IconWater size={15} />, label: 'Рядом водоём' });
  if (d.includes('сад') || d.includes('яблон') || d.includes('плодов'))
    chips.push({ icon: <IconApple size={15} />, label: 'Плодовый сад' });
  return chips;
}

interface RoundScreenProps {
  listing: Listing;
  roundNumber: number; // 1..total
  totalRounds: number;
  totalScore: number;
  /** уже отвеченный раунд? (восстановлено из localStorage) */
  answeredGuess: number | null;
  onAnswer: (guess: number) => void;
  onNext: () => void;
  isLast: boolean;
}

export function RoundScreen({
  listing,
  roundNumber,
  totalRounds,
  totalScore,
  answeredGuess,
  onAnswer,
  onNext,
  isLast,
}: RoundScreenProps) {
  const [draft, setDraft] = useState<number>(() => answeredGuess ?? defaultGuess());
  const [inputText, setInputText] = useState<string>(() => String(draft));
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const locked = answeredGuess !== null;
  const result = useMemo(
    () => (locked ? makeRoundResult(listing.id, answeredGuess, listing.price) : null),
    [locked, answeredGuess, listing],
  );

  // Подсказка-анимация бегунка при первом открытии игры (один раз, не меняет значение).
  useEffect(() => {
    if (locked) return;
    let shown = false;
    try {
      shown = localStorage.getItem(HINT_KEY) === '1';
    } catch {
      shown = false;
    }
    if (!shown && !prefersReducedMotion()) {
      setShowHint(true);
      try {
        localStorage.setItem(HINT_KEY, '1');
      } catch {
        /* noop */
      }
      const t = setTimeout(() => setShowHint(false), 3200);
      return () => clearTimeout(t);
    }
  }, [locked]);

  // Синхронизация поля ввода при смене раунда
  useEffect(() => {
    const v = answeredGuess ?? defaultGuess();
    setDraft(v);
    setInputText(String(v));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing.id]);

  const { min, max } = SLIDER_BOUNDS;
  const step = Math.max(10000, Math.round((max - min) / 400 / 10000) * 10000);

  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v)));

  const setFromSlider = (v: number) => {
    const c = clamp(v);
    setDraft(c);
    setInputText(String(c));
  };

  const onInputChange = (raw: string) => {
    setInputText(raw);
    const n = Number(raw.replace(/\s/g, ''));
    if (Number.isFinite(n) && n > 0) setDraft(clamp(n));
  };

  const commitInput = () => {
    setDraft((d) => {
      setInputText(String(d));
      return d;
    });
  };

  const fillPct = ((draft - min) / (max - min)) * 100;

  const chips = featureChips(listing);
  const progressPct = ((roundNumber - (locked ? 0 : 0.5)) / totalRounds) * 100;

  return (
    <div className="anim-fade-up" key={listing.id}>
      {/* Верхняя панель */}
      <header className="sticky top-0 z-10 -mx-4 mb-4 border-b border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur-sm safe-top">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3">
          <span className="font-display text-lg font-bold text-leaf">Почём дача?</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium" aria-label={`Дача ${roundNumber} из ${totalRounds}`}>
              Дача <strong>{roundNumber}</strong> из <strong>{totalRounds}</strong>
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-sun/40 border border-sun/60 px-2.5 py-1 font-semibold tabular-nums">
              <IconStar size={14} />
              {totalScore}
            </span>
          </div>
        </div>
        <div
          className="mx-auto mt-2 h-2 max-w-4xl overflow-hidden rounded-full bg-ink/10"
          role="progressbar"
          aria-valuenow={roundNumber}
          aria-valuemin={1}
          aria-valuemax={totalRounds}
          aria-label="Прогресс игры"
        >
          <div
            className="h-full rounded-full bg-leaf transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(4, progressPct))}%` }}
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-4xl gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        {/* Карточка объявления */}
        <article className="rounded-3xl border-2 border-ink/12 bg-white/80 p-4 shadow-card">
          <Gallery photos={listing.photos} altBase={`Дача: ${listing.title}`} />
          <h2 className="font-display mt-3.5 text-xl font-bold leading-snug">{listing.title}</h2>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {chips.map((c, i) => (
              <Feature key={i} icon={c.icon} label={c.label} />
            ))}
          </div>
          {listing.description && (
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink/75">{listing.description}</p>
          )}
        </article>

        {/* Блок ответа */}
        <section
          className="rounded-3xl border-2 border-ink/12 bg-white/80 p-4 shadow-card"
          aria-label="Ваша оценка"
        >
          {!locked && (
            <>
              <h3 className="font-display text-lg font-bold">Сколько стоит эта дача?</h3>
              <p
                className="mt-2 text-[clamp(1.6rem,7vw,2.2rem)] font-bold tabular-nums text-leaf"
                aria-live="polite"
              >
                {formatRub(draft)}
              </p>

              <label htmlFor="price-slider" className="sr-only">
                Предпологаемая цена, ₽
              </label>
              <input
                id="price-slider"
                type="range"
                min={min}
                max={max}
                step={step}
                value={draft}
                disabled={locked}
                onChange={(e) => setFromSlider(Number(e.target.value))}
                className={`dacha-slider mt-2 ${showHint ? 'slider-hint-thumb' : ''}`}
                style={{ ['--fill' as string]: `${fillPct}%` }}
                aria-valuetext={formatRub(draft)}
              />
              <div className="flex justify-between text-xs text-ink/60 tabular-nums">
                <span>{formatRub(min)}</span>
                <span>{formatRub(max)}</span>
              </div>
              {showHint && (
                <p className="mt-1 text-xs text-terra" aria-hidden="true">
                  ← подвигайте бегунок или введите цену →
                </p>
              )}

              <div className="mt-3 flex items-end gap-2">
                <div className="flex-1">
                  <label htmlFor="price-input" className="block text-xs font-medium text-ink/70">
                    Ввести цену вручную, ₽
                  </label>
                  <input
                    id="price-input"
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9\s]*"
                    autoComplete="off"
                    value={inputText}
                    onChange={(e) => onInputChange(e.target.value)}
                    onBlur={commitInput}
                    className="mt-1 w-full rounded-xl border-2 border-ink/15 bg-cream px-3 py-2.5 text-base tabular-nums focus:border-leaf"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setFromSlider(draft + 100000)}
                  className="rounded-xl border-2 border-ink/15 bg-cream px-3 py-2.5 text-sm font-semibold hover:bg-sun/40"
                  aria-label="Добавить 100 000 рублей"
                >
                  +100 тыс.
                </button>
              </div>

              <button
                type="button"
                onClick={() => onAnswer(clamp(draft))}
                className="mt-4 w-full rounded-2xl bg-terra px-5 py-4 text-lg font-semibold text-white shadow-card transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Назвать цену
              </button>
            </>
          )}

          {locked && result && (
            <div className="relative">
              {/* штамп */}
              <div className="anim-stamp absolute -right-1 top-0 rotate-[-8deg] rounded-lg border-[3px] border-leaf/70 px-3 py-1 font-display text-sm font-bold uppercase tracking-wide text-leaf/80">
                Оценка принята
              </div>

              <div className="anim-fade-up pt-10">
                <dl className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-ink/12 bg-cream p-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-ink/60">
                      Твоя оценка
                    </dt>
                    <dd className="mt-1 text-lg font-bold tabular-nums">{formatRub(result.guess)}</dd>
                  </div>
                  <div className="anim-reveal rounded-2xl border-2 border-leaf/40 bg-leaf/10 p-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-leaf">
                      Цена в объявлении
                    </dt>
                    <dd className="mt-1 text-lg font-bold tabular-nums text-leaf">
                      {formatRub(result.actualPrice)}
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 text-[15px] font-medium">
                  {result.difference === 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-leaf">
                      <IconCheck size={17} /> Точное попадание!
                    </span>
                  ) : (
                    directionText(result, formatRub)
                  )}
                </p>
                <p className="mt-1 text-sm text-ink/70">
                  Отклонение: <strong className="tabular-nums">{formatPercent(result.errorPercent)}</strong>
                </p>
                <p className="mt-2 text-[15px] italic text-terra">{commentByError(result.errorPercent)}</p>

                <div className="mt-4 flex items-center justify-between rounded-2xl bg-sun/30 border border-sun/60 px-4 py-3">
                  <span className="font-semibold">Баллы за раунд</span>
                  <span className="text-2xl font-bold tabular-nums">{result.roundScore} / 100</span>
                </div>

                <button
                  type="button"
                  onClick={onNext}
                  className="mt-4 w-full rounded-2xl bg-leaf px-5 py-4 text-lg font-semibold text-cream shadow-card transition-transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isLast ? 'Посмотреть результат' : 'Следующая дача'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
