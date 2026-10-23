import { useEffect, useRef } from 'react';
import { IconClose } from './icons';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

/** Доступное модальное окно: Esc, закрытие по фону, ловушка фокуса. */
export function Modal({ open, title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const focusables = ref.current.querySelectorAll<HTMLElement>(
          'button, a[href], input, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const btn = ref.current?.querySelector<HTMLElement>('button');
    btn?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 p-0 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="anim-fade-up w-full max-w-lg rounded-t-3xl sm:rounded-3xl border-2 border-ink/15 bg-cream shadow-card max-h-[85vh] overflow-y-auto safe-bottom"
      >
        <div className="sticky top-0 flex items-center justify-between gap-3 bg-cream/95 px-5 py-4 border-b border-ink/10 backdrop-blur-sm">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-full border border-ink/15 p-2 hover:bg-sun/40 transition-colors"
          >
            <IconClose size={18} />
          </button>
        </div>
        <div className="px-5 py-4 text-[15px] leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export function AboutModal({ open, onClose, isDemoData }: { open: boolean; onClose: () => void; isDemoData: boolean }) {
  return (
    <Modal open={open} title="Об игре" onClose={onClose}>
      <p>
        «Почём дача?» — развлекательная игра для будущих дачников. Вы смотрите фотографии и
        характеристики объявления о продаже дачи и пытаетесь угадать его цену.
      </p>
      <p className="mt-3">
        За каждый раунд начисляется до 100 баллов: чем ближе ваша оценка к цене в объявлении, тем
        выше результат. После 10 дач игра подводит итог и выдаёт титул — от «Мастера торга» до
        «Дачного эксперта».
      </p>
      <p className="mt-3">
        Это frontend-only прототип: прогресс хранится только в вашем браузере (localStorage), без
        регистрации и серверов. Настоящие цены скрыты в интерфейсе до подтверждения ответа, но
        защита от просмотра данных через инструменты разработчика не гарантируется — это
        развлекательная игра, а не викторина на призы.
      </p>
      {isDemoData && (
        <p className="mt-3 rounded-xl border border-terra/40 bg-terra/10 px-3 py-2 text-sm">
          Сейчас приложение работает на демонстрационном наборе вымышленных объявлений.
        </p>
      )}
    </Modal>
  );
}

export function ScoringModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} title="Как считаются баллы" onClose={onClose}>
      <p>Обозначим вашу оценку как «догадку», а цену объявления — как «настоящую цену».</p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5">
        <li>Разница = догадка − настоящая цена;</li>
        <li>Ошибка = |разница| ÷ настоящая цена × 100%;</li>
        <li>Баллы за раунд = 100 × max(0, 1 − ошибка ÷ 50), округлённо.</li>
      </ul>
      <div className="mt-4 overflow-hidden rounded-xl border border-ink/15">
        <table className="w-full text-sm">
          <thead className="bg-leaf/10 text-left">
            <tr>
              <th className="px-3 py-2">Ошибка</th>
              <th className="px-3 py-2">Баллы</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['точное попадание', '100'],
              ['5%', '90'],
              ['10%', '80'],
              ['25%', '50'],
              ['50% и более', '0'],
            ].map(([a, b]) => (
              <tr key={a} className="border-t border-ink/10">
                <td className="px-3 py-2">{a}</td>
                <td className="px-3 py-2 font-semibold">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3">
        Максимум за 10 раундов — 1000 баллов. Если объявлений в наборе меньше десяти, раундов и
        максимальный счёт будет меньше.
      </p>
      <p className="mt-3">
        Титулы: «Дачный эксперт» — средняя ошибка до 15%; «Щедрый дачник» — в среднем оцениваете
        дороже; «Мастер торга» — дешевле; «Дачный оптимист» — оценки разошлись в разные стороны.
      </p>
    </Modal>
  );
}
