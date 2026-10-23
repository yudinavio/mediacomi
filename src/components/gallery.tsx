import { useCallback, useEffect, useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight } from './icons';

const PLACEHOLDER = '/images/placeholder.svg';

interface GalleryProps {
  photos: string[];
  /** alt НЕ должен содержать цену — только нейтральное описание */
  altBase: string;
}

/** Фотогалерея: свайп + кнопки + точки + клавиатура. Загружаются только текущий и соседние кадры. */
export function Gallery({ photos, altBase }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const touchStartX = useRef<number | null>(null);
  const count = Math.max(photos.length, 1);

  useEffect(() => {
    setIndex(0);
    setFailed({});
  }, [photos]);

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  const near = (i: number) =>
    i === index || i === (index + 1) % count || i === (index - 1 + count) % count;

  return (
    <div className="relative select-none">
      <div
        className="overflow-x-auto no-scrollbar snap-x snap-mandatory rounded-2xl border-2 border-ink/10 bg-white"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(index + 1);
          if (e.key === 'ArrowLeft') go(index - 1);
        }}
        role="group"
        aria-roledescription="карусель"
        aria-label={`Фотографии: ${altBase}`}
        tabIndex={0}
      >
        <div className="flex">
          {Array.from({ length: count }).map((_, i) => {
            const real = photos[i];
            // Полноразмерные фото всех объявлений сразу не грузим: src ставим
            // только для текущего и соседних кадров.
            const loadImg = real && near(i) && !failed[i];
            return (
              <div key={i} className="relative w-full shrink-0 snap-center aspect-[4/3] bg-[#EFE9DB]">
                {loadImg ? (
                  <img
                    src={real}
                    onError={() => setFailed((f) => ({ ...f, [i]: true }))}
                    loading={i === index ? 'eager' : 'lazy'}
                    decoding="async"
                    alt={`${altBase}, фото ${i + 1} из ${count}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <img
                    src={PLACEHOLDER}
                    alt={`${altBase}, фото ${i + 1} из ${count}`}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Предыдущее фото"
            className="absolute left-2 top-[31%] rounded-full bg-cream/90 border border-ink/15 p-2 shadow-sm hover:bg-sun/60 transition-colors"
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Следующее фото"
            className="absolute right-2 top-[31%] rounded-full bg-cream/90 border border-ink/15 p-2 shadow-sm hover:bg-sun/60 transition-colors"
          >
            <IconChevronRight size={20} />
          </button>
        </>
      )}

      <div className="absolute left-2 top-2 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-cream">
        {index + 1} / {count}
      </div>

      {count > 1 && (
        <div className="mt-2.5 flex items-center justify-center gap-2" aria-label="Выбор фото">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-current={i === index}
              aria-label={`Показать фото ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-leaf' : 'w-2.5 bg-ink/25 hover:bg-ink/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
