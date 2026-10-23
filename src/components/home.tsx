import { DATA_IS_DEMO } from '../lib/listings.generated';
import { IconLeaf, IconSun } from './icons';

/** Декоративная SVG-композиция: дачный домик, солнце, яблоня, грядки. */
function DachaIllustration() {
  return (
    <svg viewBox="0 0 340 240" className="w-full max-w-md mx-auto drop-shadow-sm" role="img" aria-label="Иллюстрация: дачный домик среди яблонь">
      <circle cx="285" cy="48" r="30" fill="#F4C95D" />
      <g stroke="#F4C95D" strokeWidth="4" strokeLinecap="round">
        <path d="M285 6v10M285 80v10M247 48h10M313 48h10M258 21l7 7M305 68l7 7M312 21l-7 7M265 68l-7 7" />
      </g>
      <path d="M0 190 Q85 165 170 185 T340 178 V240 H0 Z" fill="#CFE3B8" />
      {/* деревья */}
      <rect x="34" y="120" width="10" height="52" rx="4" fill="#8a5a3b" />
      <circle cx="39" cy="102" r="30" fill="#287A50" opacity="0.9" />
      <circle cx="30" cy="118" r="6" fill="#c94f4f" />
      <circle cx="50" cy="110" r="5" fill="#c94f4f" />
      <rect x="296" y="128" width="9" height="46" rx="4" fill="#8a5a3b" />
      <circle cx="300" cy="112" r="24" fill="#3c8a5e" opacity="0.85" />
      <circle cx="310" cy="122" r="5" fill="#c94f4f" />
      {/* дом */}
      <g>
        <rect x="110" y="118" width="120" height="72" rx="6" fill="#F7F3E8" stroke="#287A50" strokeWidth="4" />
        <path d="M98 122 L170 66 L242 122 Z" fill="#D98262" stroke="#24382C" strokeWidth="3" strokeLinejoin="round" />
        <rect x="158" y="146" width="26" height="44" rx="4" fill="#287A50" />
        <rect x="122" y="132" width="24" height="22" rx="3" fill="#bcd8e8" stroke="#287A50" strokeWidth="3" />
        <rect x="196" y="132" width="24" height="22" rx="3" fill="#bcd8e8" stroke="#287A50" strokeWidth="3" />
        <rect x="232" y="150" width="46" height="40" rx="5" fill="none" stroke="#287A50" strokeWidth="4" />
        <path d="M232 170 h46 M255 150 v40" stroke="#287A50" strokeWidth="3" />
      </g>
      {/* лейка и яблоки */}
      <g transform="translate(64 196)">
        <path d="M0 10 h26 v16 a4 4 0 0 1 -4 4 H4 a4 4 0 0 1 -4 -4 Z" fill="#D98262" />
        <path d="M26 16 l12 -8 v6 l-12 4 Z" fill="#D98262" />
        <path d="M6 10 a8 8 0 0 1 14 0" fill="none" stroke="#B96A4E" strokeWidth="3" />
      </g>
      <circle cx="150" cy="212" r="8" fill="#c94f4f" />
      <circle cx="172" cy="218" r="7" fill="#d95f5f" />
      <circle cx="192" cy="210" r="8" fill="#c94f4f" />
      <path d="M150 204 q2 -6 6 -6" stroke="#287A50" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="anim-fade-up text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/10 px-3.5 py-1.5 text-[13px] font-medium text-leaf">
        <IconLeaf size={15} />
        Игра для будущих дачников
      </span>

      <h1 className="font-display mt-5 text-[clamp(1.9rem,8vw,3rem)] font-bold leading-tight">
        Шесть соток.
        <br />
        <span className="text-terra">Тысяча догадок.</span>
      </h1>

      <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink/75">
        Угадай стоимость 10 дач по фото и описанию. Узнай, насколько хорошо ты чувствуешь
        загородный рынок.
      </p>

      <div className="mt-7">
        <DachaIllustration />
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-7 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-leaf px-6 py-4 text-lg font-semibold text-cream shadow-card transition-transform hover:-translate-y-0.5 active:translate-y-0 active:bg-[#1f6440]"
      >
        <IconSun size={20} />
        Начать охоту за дачей
      </button>

      <p className="mt-4 text-sm text-ink/60">
        Смотри фото → называй цену → проверяй чутьё
      </p>

      {DATA_IS_DEMO && (
        <p className="mx-auto mt-4 max-w-sm rounded-xl border border-sun/60 bg-sun/20 px-3 py-2 text-xs text-ink/70">
          Деморежим: используются вымышленные объявления из демонстрационного набора данных.
        </p>
      )}
    </section>
  );
}
