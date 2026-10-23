import { useEffect, useState } from 'react';
import { DATA_IS_DEMO } from './lib/listings.generated';
import {
  clearGame,
  createNewGame,
  currentRoundIndex,
  eligibleListings,
  getListingById,
  loadGame,
  saveGame,
  totalScoreOf,
  type GameState,
} from './lib/game';
import { HomeScreen } from './components/home';
import { RoundScreen } from './components/round';
import { SummaryScreen } from './components/summary';
import { AboutModal, ScoringModal } from './components/modals';
import { IconLeaf } from './components/icons';

type Screen = 'home' | 'game';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [state, setState] = useState<GameState | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scoringOpen, setScoringOpen] = useState(false);

  // Восстановление сохранённой игры при загрузке страницы
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      setState(saved);
      setScreen('game');
    }
  }, []);

  // Сохранение прогресса при каждом изменении состояния игры
  useEffect(() => {
    if (screen === 'game' && state) saveGame(state);
  }, [screen, state]);

  function startGame() {
    const pool = eligibleListings();
    if (pool.length === 0) return;
    clearGame(); // повторная игра сбрасывает предыдущий результат
    const fresh = createNewGame(pool);
    setState(fresh);
    setScreen('game');
    window.scrollTo({ top: 0 });
  }

  function answerCurrent(guess: number) {
    if (!state) return;
    const i = currentRoundIndex(state);
    if (i >= state.answers.length || state.answers[i] !== null) return; // защита от двойной отправки
    const answers = state.answers.slice();
    answers[i] = guess;
    const finished = answers.every((a) => a !== null);
    setState({ ...state, answers, phase: finished ? 'finished' : 'playing' });
  }

  function nextRound() {
    if (!state) return;
    if (state.phase === 'finished') {
      setState({ ...state }); // уже finished — просто перерисовка
      return;
    }
    const i = currentRoundIndex(state);
    // переход к следующему раунду возможен только если текущий отвечен
    if (i < state.answers.length && state.answers[i] === null) return;
    if (state.answers.every((a) => a !== null)) {
      setState({ ...state, phase: 'finished' });
    }
    window.scrollTo({ top: 0 });
  }

  const roundIdx = state ? currentRoundIndex(state) : 0;
  const listing = state ? getListingById(state.listingIds[Math.min(roundIdx, state.listingIds.length - 1)]) : undefined;
  const totalRounds = state?.listingIds.length ?? 0;

  let content: React.ReactNode;
  if (screen === 'home' || !state || !listing) {
    content = <HomeScreen onStart={startGame} />;
  } else if (state.phase === 'finished') {
    content = <SummaryScreen state={state} onReplay={startGame} />;
  } else {
    content = (
      <RoundScreen
        key={listing.id}
        listing={listing}
        roundNumber={roundIdx + 1}
        totalRounds={totalRounds}
        totalScore={totalScoreOf(state)}
        answeredGuess={state.answers[roundIdx]}
        onAnswer={answerCurrent}
        onNext={nextRound}
        isLast={roundIdx === totalRounds - 1}
      />
    );
  }

  return (
    <div className="min-h-dvh flex flex-col px-4">
      <main className="mx-auto w-full max-w-5xl flex-1 py-5">{content}</main>

      <footer className="mx-auto w-full max-w-5xl border-t border-ink/10 py-4 text-center safe-bottom">
        <p className="flex items-center justify-center gap-1.5 text-xs text-ink/50 mb-2">
          <IconLeaf size={13} />
          Почём дача? — развлекательный прототип{DATA_IS_DEMO ? ' (демонстрационные данные)' : ''}
        </p>
        <nav aria-label="Информация" className="flex items-center justify-center gap-5 text-sm">
          <button
            type="button"
            onClick={() => setAboutOpen(true)}
            className="font-medium text-leaf underline underline-offset-4 decoration-leaf/40 hover:decoration-leaf"
          >
            Об игре
          </button>
          <button
            type="button"
            onClick={() => setScoringOpen(true)}
            className="font-medium text-leaf underline underline-offset-4 decoration-leaf/40 hover:decoration-leaf"
          >
            Как считаются баллы
          </button>
        </nav>
      </footer>

      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} isDemoData={DATA_IS_DEMO} />
      <ScoringModal open={scoringOpen} onClose={() => setScoringOpen(false)} />
    </div>
  );
}
