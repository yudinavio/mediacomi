import { useState } from 'react';
import type { Listing } from '../lib/listings.generated';
import type { GameState } from '../lib/game';
import { getListingById } from '../lib/game';
import { makeRoundResult } from '../lib/scoring';
import { formatPercent, formatRub, summarize, TITLES } from '../lib/scoring';
import { IconChevronRight, IconShare, IconStar } from './icons';

interface Props {
  state: GameState;
  onReplay: () => void;
}

export function SummaryScreen({ state, onReplay }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [copyNote, setCopyNote] = useState<string | null>(null);

  const results = state.listingIds
    .map((id, i) => {
      const guess = state.answers[i];
      const l = getListingById(id);
      if (guess === null || !l) return null;
      const r = makeRoundResult(id, guess, l.price);
      return { r, l };
    })
    .filter((x): x is { r: ReturnType<typeof makeRoundResult>; l: Listing } => x !== null);

  const s = summarize(results.map((x) => x.r));
  const title = TITLES[s.titleKey];

  const shareText = `Почём дача?: ${s.totalScore}/${s.maxScore} баллов, титул — «${title.name}». Средняя ошибка ${formatPercent(s.avgAbsErrorPercent)}. А вы угадали бы цену своей дачи?`;

  async function copyResult() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        // Фолбэк для старых браузеров без Clipboard API
        const ta = document.createElement('textarea');
        ta.value = shareText;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('execCommand failed');
      }
      setCopyNote('Результат скопирован в буфер обмена');
    } catch {
      setCopyNote('Не удалось скопировать. Текст результата выделен ниже — скопируйте его вручную.');
    }
    setTimeout(() => setCopyNote(null), 4000);
  }

  const best = s.bestRound
    ? results.find((x) => x.r === s.bestRound) ?? null
    : null;

  return (
    <section className="anim-fade-up mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-sun/60 bg-sun/30 px-3.5 py-1.5 text-[13px] font-medium">
        <IconStar size={15} /> Игра завершена
      </span>

      <h1 className="font-display mt-4 text-[clamp(1.8rem,7vw,2.6rem)] font-bold leading-tight text-leaf">
        {title.name}
      </h1>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-ink/75">{title.description}</p>

      <div className="mt-6 rounded-3xl border-2 border-ink/12 bg-white/80 p-5 shadow-card">
        <p className="text-sm font-medium uppercase tracking-wide text-ink/60">Общий счёт</p>
        <p className="mt-1 text-[clamp(2.2rem,9vw,3.2rem)] font-bold tabular-nums leading-none">
          {s.totalScore}
          <span className="text-xl text-ink/50"> / {s.maxScore}</span>
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-left sm:grid-cols-3">
          <Stat label="Средняя ошибка" value={formatPercent(s.avgAbsErrorPercent)} />
          <Stat label="Пройдено дач" value={`${s.roundsPlayed}`} />
          <Stat label="Условная переплата" value={formatRub(s.overpay)} hint="сумма оценок выше цены" />
          <Stat label="Условная недооценка" value={formatRub(s.underprice)} hint="сумма оценок ниже цены" />
          <Stat
            label="Лучший раунд"
            value={best ? `${best.r.roundScore} баллов` : '—'}
            hint={best ? `«${best.l.title}»` : undefined}
          />
        </dl>
      </div>

      {/* раскрываемый список раундов */}
      <div className="mt-5 rounded-3xl border-2 border-ink/12 bg-white/80 text-left shadow-card">
        <button
          type="button"
          onClick={() => setDetailsOpen((o) => !o)}
          aria-expanded={detailsOpen}
          className="flex w-full items-center justify-between gap-2 px-5 py-4 font-semibold"
        >
          Все раунды
          <IconChevronRight
            size={20}
            className={`transition-transform ${detailsOpen ? 'rotate-90' : ''}`}
          />
        </button>
        {detailsOpen && (
          <ol className="border-t border-ink/10 px-5 py-3 text-sm">
            {results.map(({ r, l }, i) => (
              <li key={l.id} className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-dashed border-ink/10 py-2.5 last:border-0">
                <span className="w-full text-ink/70 sm:w-auto">
                  <strong>{i + 1}.</strong> {l.title}
                </span>
                <span className="tabular-nums">
                  Оценка: <strong>{formatRub(r.guess)}</strong> · Цена: <strong>{formatRub(r.actualPrice)}</strong> ·{' '}
                  <span className="rounded-full bg-sun/40 px-2 py-0.5 font-bold">{r.roundScore} б.</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onReplay}
          className="rounded-2xl bg-leaf px-6 py-4 text-lg font-semibold text-cream shadow-card transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Сыграть ещё
        </button>
        <button
          type="button"
          onClick={copyResult}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-leaf/50 bg-white/70 px-6 py-4 text-lg font-semibold text-leaf transition-colors hover:bg-sun/30"
        >
          <IconShare size={19} />
          Поделиться результатом
        </button>
      </div>

      {copyNote && (
        <p role="status" className="anim-fade-up mt-4 rounded-xl border border-leaf/40 bg-leaf/10 px-4 py-2.5 text-sm">
          {copyNote}
        </p>
      )}
      {copyNote?.startsWith('Не удалось') && (
        <p className="mt-2 select-all rounded-xl border border-ink/15 bg-white/80 px-4 py-2.5 text-sm">
          {shareText}
        </p>
      )}
    </section>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="col-span-2 rounded-2xl border border-ink/10 bg-cream px-3.5 py-2.5 sm:col-span-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-ink/60">{label}</dt>
      <dd className="mt-0.5 text-lg font-bold tabular-nums leading-tight">{value}</dd>
      {hint && <dd className="mt-0.5 text-[11px] text-ink/55">{hint}</dd>}
    </div>
  );
}
