import { useState, useCallback } from "react";
import {
  Apartment,
  getRandomApartments,
  calculateScore,
  getResultTitle,
  getResultDescription,
  formatPrice,
} from "./data/apartments";

type Screen = "home" | "game" | "result";

interface RoundResult {
  apartment: Apartment;
  guess: number;
  score: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [rounds, setRounds] = useState<Apartment[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [guess, setGuess] = useState(3000000);
  const [revealed, setRevealed] = useState(false);
  const [animatedSlider, setAnimatedSlider] = useState(false);

  const startGame = useCallback(() => {
    const selected = getRandomApartments(10);
    setRounds(selected);
    setCurrentRound(0);
    setResults([]);
    setGuess(3000000);
    setRevealed(false);
    setAnimatedSlider(false);
    setScreen("game");

    // Animate slider on first round
    setTimeout(() => {
      setGuess(selected[0].price * 0.7);
      setTimeout(() => {
        setAnimatedSlider(true);
      }, 50);
    }, 300);
  }, []);

  const handleSubmit = () => {
    if (!rounds[currentRound]) return;
    const apt = rounds[currentRound];
    const score = calculateScore(guess, apt.price);
    setResults((prev) => [...prev, { apartment: apt, guess, score }]);
    setRevealed(true);
  };

  const handleNext = () => {
    if (currentRound + 1 >= rounds.length) {
      setScreen("result");
    } else {
      const nextRound = currentRound + 1;
      setCurrentRound(nextRound);
      setGuess(3000000);
      setRevealed(false);
      setAnimatedSlider(false);

      setTimeout(() => {
        setGuess(rounds[nextRound].price * 0.7);
        setTimeout(() => {
          setAnimatedSlider(true);
        }, 50);
      }, 300);
    }
  };

  const avgScore =
    results.length > 0
      ? results.reduce((sum, r) => sum + r.score, 0) / results.length
      : 0;

  const totalOverpay = results.reduce((sum, r) => {
    return sum + (r.guess - r.apartment.price);
  }, 0);

  if (screen === "home") {
    return <HomeScreen onStart={startGame} />;
  }

  if (screen === "result") {
    return (
      <ResultScreen
        avgScore={avgScore}
        totalOverpay={totalOverpay}
        results={results}
        onRestart={startGame}
        onHome={() => setScreen("home")}
      />
    );
  }

  const apt = rounds[currentRound];
  if (!apt) return null;

  return (
    <GameScreen
      apartment={apt}
      round={currentRound + 1}
      totalRounds={rounds.length}
      guess={guess}
      setGuess={setGuess}
      revealed={revealed}
      animatedSlider={animatedSlider}
      onSubmit={handleSubmit}
      onNext={handleNext}
    />
  );
}

/* ==================== HOME SCREEN ==================== */
function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#26CD94] to-[#1BA876] text-white px-5 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto text-center">
          <div className="text-4xl mb-3">🏠</div>
          <h1 className="text-3xl font-bold mb-2">Медиакоми</h1>
          <p className="text-white/90 text-sm leading-relaxed">
            Симулятор оценки недвижимости в Республике Коми. Сможете ли вы
            угадать реальную цену квартиры по объявлению?
          </p>
        </div>
      </div>

      {/* Gallery */}
      <div className="px-5 py-6 max-w-md mx-auto w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Примеры объявлений
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
            <img
              src="https://image.qwenlm.ai/generated-images/d23f5b2a-a54c-435e-9d4e-47a92fe0403f/_result.png"
              alt="Квартира 1"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
            <img
              src="https://image.qwenlm.ai/generated-images/a189a89c-887f-464a-abe0-75d9a7a7a304/_result.png"
              alt="Квартира 2"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
            <img
              src="https://image.qwenlm.ai/generated-images/219261e6-52d5-4ffa-a3c8-5ae9bfb6dca7/_result.png"
              alt="Квартира 3"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
            <img
              src="https://image.qwenlm.ai/generated-images/59f5d33e-f266-443f-8c63-05dbe2e07e90/_result.png"
              alt="Квартира 4"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* How to play */}
        <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Как играть?</h3>
          <ul className="text-sm text-gray-600 space-y-1.5">
            <li className="flex items-start gap-2">
              <span className="text-[#26CD94] font-bold">1.</span>
              Вам показывают 10 случайных объявлений
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#26CD94] font-bold">2.</span>
              Угадайте цену квартиры с помощью бегунка
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#26CD94] font-bold">3.</span>
              Получите баллы за точность оценки
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#26CD94] font-bold">4.</span>
              Узнайте свой инвестиционный профиль!
            </li>
          </ul>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="mt-6 w-full py-4 bg-[#26CD94] hover:bg-[#1BA876] active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-md transition-all duration-200"
        >
          🚀 Запустить игру
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

/* ==================== GAME SCREEN ==================== */
function GameScreen({
  apartment,
  round,
  totalRounds,
  guess,
  setGuess,
  revealed,
  animatedSlider,
  onSubmit,
  onNext,
}: {
  apartment: Apartment;
  round: number;
  totalRounds: number;
  guess: number;
  setGuess: (v: number) => void;
  revealed: boolean;
  animatedSlider: boolean;
  onSubmit: () => void;
  onNext: () => void;
}) {
  const minPrice = 500000;
  const maxPrice = 10000000;
  const progress = (round / totalRounds) * 100;

  const diff = guess - apartment.price;
  const diffPercent = Math.abs((diff / apartment.price) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="h-1.5 bg-gray-200">
          <div
            className="h-full bg-[#26CD94] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="px-5 py-2 flex justify-between items-center text-xs text-gray-500">
          <span>
            Раунд {round} из {totalRounds}
          </span>
          <span>Медиакоми</span>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 px-5 py-4 max-w-md mx-auto w-full">
        {/* Image gallery */}
        <div className="relative rounded-2xl overflow-hidden shadow-md mb-4">
          <div className="aspect-[4/3] bg-gray-200">
            <img
              src={apartment.images[0]}
              alt={apartment.title}
              className="w-full h-full object-cover"
            />
          </div>
          {apartment.images.length > 1 && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {apartment.images.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === 0 ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-1">
            {apartment.title}
          </h2>
          <p className="text-sm text-gray-500 mb-3">📍 {apartment.address}</p>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <div className="text-xs text-gray-500">Площадь</div>
              <div className="font-bold text-gray-800">{apartment.area} м²</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <div className="text-xs text-gray-500">Этаж</div>
              <div className="font-bold text-gray-800">
                {apartment.floor}/{apartment.totalFloors}
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-2 text-center">
              <div className="text-xs text-gray-500">Комнат</div>
              <div className="font-bold text-gray-800">
                {apartment.rooms || "Студия"}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {apartment.description}
          </p>
        </div>

        {/* Second image */}
        {apartment.images[1] && (
          <div className="rounded-2xl overflow-hidden shadow-sm mb-4">
            <div className="aspect-[4/3] bg-gray-200">
              <img
                src={apartment.images[1]}
                alt="Фото квартиры"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Slider */}
        <div className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 ${animatedSlider ? "slider-entrance" : ""}`}>
          <div className="text-center mb-3">
            <div className="text-xs text-gray-500 mb-1">Ваша оценка</div>
            <div className="text-2xl font-bold text-[#26CD94]">
              {formatPrice(Math.round(guess / 10000) * 10000)}
            </div>
          </div>

          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step={50000}
            value={guess}
            onChange={(e) => setGuess(Number(e.target.value))}
            disabled={revealed}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#26CD94]"
            style={{
              background: `linear-gradient(to right, #26CD94 0%, #26CD94 ${((guess - minPrice) / (maxPrice - minPrice)) * 100}%, #e5e7eb ${((guess - minPrice) / (maxPrice - minPrice)) * 100}%, #e5e7eb 100%)`,
            }}
          />

          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>500 тыс</span>
            <span>10 млн</span>
          </div>
        </div>

        {/* Result after reveal */}
        {revealed && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 animate-fadeIn">
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Правильная цена</div>
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {formatPrice(apartment.price)}
              </div>
              <div
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  diff > 0
                    ? "bg-red-50 text-red-600"
                    : diff < 0
                      ? "bg-blue-50 text-blue-600"
                      : "bg-green-50 text-green-600"
                }`}
              >
                {diff > 0
                  ? `↑ Больше на ${formatPrice(Math.abs(diff))}`
                  : diff < 0
                    ? `↓ Меньше на ${formatPrice(Math.abs(diff))}`
                    : "✓ Точно в цель!"}
                {diff !== 0 && ` (${diffPercent.toFixed(1)}%)`}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Баллы:{" "}
                <span className="font-bold text-[#26CD94]">
                  {calculateScore(guess, apartment.price)}
                </span>{" "}
                / 100
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        {!revealed ? (
          <button
            onClick={onSubmit}
            className="w-full py-4 bg-[#26CD94] hover:bg-[#1BA876] active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-md transition-all duration-200"
          >
            Оценить
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full py-4 bg-[#26CD94] hover:bg-[#1BA876] active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-md transition-all duration-200"
          >
            {round >= totalRounds ? "Итоги →" : "Следующий вопрос →"}
          </button>
        )}
      </div>

      <Footer />
    </div>
  );
}

/* ==================== RESULT SCREEN ==================== */
function ResultScreen({
  avgScore,
  totalOverpay,
  results,
  onRestart,
  onHome,
}: {
  avgScore: number;
  totalOverpay: number;
  results: RoundResult[];
  onRestart: () => void;
  onHome: () => void;
}) {
  const title = getResultTitle(avgScore);
  const description = getResultDescription(avgScore);

  const emoji =
    avgScore >= 70 ? "🎯" : avgScore >= 45 ? "💰" : "🪙";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#26CD94] to-[#1BA876] text-white px-5 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="max-w-md mx-auto text-center">
          <div className="text-5xl mb-3">{emoji}</div>
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          <p className="text-white/80 text-sm">{description}</p>
        </div>
      </div>

      <div className="px-5 py-6 max-w-md mx-auto w-full">
        {/* Score summary */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#26CD94]">
                {Math.round(avgScore)}
              </div>
              <div className="text-xs text-gray-500">Средний балл</div>
            </div>
            <div className="text-center">
              <div
                className={`text-xl font-bold ${totalOverpay > 0 ? "text-red-500" : "text-blue-500"}`}
              >
                {totalOverpay > 0 ? "+" : ""}
                {formatPrice(Math.abs(totalOverpay))}
              </div>
              <div className="text-xs text-gray-500">
                {totalOverpay > 0 ? "Переплата" : "Недоплата"}
              </div>
            </div>
          </div>
        </div>

        {/* Round details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Детализация</h3>
          <div className="space-y-2">
            {results.map((r, i) => {
              const diff = r.guess - r.apartment.price;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                        {r.apartment.title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {r.apartment.address}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-bold ${r.score >= 70 ? "text-green-600" : r.score >= 40 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {r.score}
                    </div>
                    <div className="text-xs text-gray-400">
                      {diff > 0 ? "+" : ""}
                      {(diff / 1000000).toFixed(1)}М
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-4 bg-[#26CD94] hover:bg-[#1BA876] active:scale-[0.98] text-white font-bold text-lg rounded-2xl shadow-md transition-all duration-200"
          >
            🔄 Играть снова
          </button>
          <button
            onClick={onHome}
            className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-2xl transition-all duration-200 active:scale-[0.98]"
          >
            На главную
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ==================== FOOTER ==================== */
function Footer() {
  return (
    <footer className="mt-auto py-4 px-5 text-center">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center gap-4 text-xs text-gray-400 mb-2">
          <a href="#" className="hover:text-[#26CD94] transition-colors">
            О проекте
          </a>
          <a href="#" className="hover:text-[#26CD94] transition-colors">
            Контакты
          </a>
          <a href="#" className="hover:text-[#26CD94] transition-colors">
            Политика
          </a>
        </div>
        <p className="text-xs text-gray-300">
          © 2024 Медиакоми. Все данные носят ознакомительный характер.
        </p>
      </div>
    </footer>
  );
}
