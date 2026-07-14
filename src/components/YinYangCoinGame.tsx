import { useState, useCallback, useRef } from 'react';
import {
  Coins,
  RotateCcw,
  RotateCw,
  TrendingUp,
  BarChart3,
  Trophy,
  RefreshCw,
} from 'lucide-react';
import YinYangCoin from './YinYangCoin';
import WisdomMessage from './WisdomMessage';
import BetHistory from './BetHistory';
import ParticleEffect from './ParticleEffect';
import AnimatedNumber from './AnimatedNumber';
import AchievementPopup from './AchievementPopup';
import WelcomeModal from './WelcomeModal';
import { useLocalStorage } from '../utils/useLocalStorage';
import { playFlipSound, playWinSound, playLoseSound, playAchievementSound } from '../utils/sounds';
import { ACHIEVEMENTS, type Achievement, type GameStats } from '../utils/achievements';

const YIN_WISDOM = [
  'Es momento de descansar y reflexionar',
  'La quietud trae respuestas profundas',
  'Escucha tu voz interior, ella sabe el camino',
  'La noche protege tus sueños más profundos',
  'La paciencia es la llave de la sabiduría',
  'El silencio guarda los secretos del universo',
  'Confía en el flujo natural de la vida',
  'Las estrellas guían a quienes saben esperar',
];

const YANG_WISDOM = [
  'La energía está de tu lado, actúa ahora',
  'El momento de brillar ha llegado',
  'Tu voluntad puede mover montañas',
  'El sol ilumina cada paso que das',
  'La acción vence al miedo y la duda',
  'Hoy es el día perfecto para comenzar',
  'Tu fuego interior ilumina el camino',
  'Atrévete a dar el primer paso',
];

type Side = 'yin' | 'yang';

interface HistoryEntry {
  id: number;
  side: Side;
  won: boolean;
  bet: number;
}

interface SavedState {
  balance: number;
  history: HistoryEntry[];
  nextId: number;
  unlockedAchievements: string[];
  stats: GameStats;
  hasSeenWelcome: boolean;
}

const INITIAL_STATS: GameStats = {
  totalFlips: 0,
  wins: 0,
  losses: 0,
  streak: 0,
  bestStreak: 0,
  balance: 100,
  totalPointsEarned: 0,
  totalPointsLost: 0,
  yinCount: 0,
  yangCount: 0,
  isNewPlayer: true,
};

const INITIAL_STATE: SavedState = {
  balance: 100,
  history: [],
  nextId: 1,
  unlockedAchievements: [],
  stats: INITIAL_STATS,
  hasSeenWelcome: false,
};

export default function YinYangCoinGame() {
  const [saved, setSaved, clearSaved] = useLocalStorage<SavedState>(
    'yin-yang-game-state',
    INITIAL_STATE,
  );

  const [balance, setBalance] = useState(saved.balance);
  const [history, setHistory] = useState<HistoryEntry[]>(saved.history);
  const [nextId, setNextId] = useState(saved.nextId);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(
    saved.unlockedAchievements,
  );
  const [stats, setStats] = useState<GameStats>(saved.stats);
  const [showWelcome, setShowWelcome] = useState(!saved.hasSeenWelcome);
  const [showStats, setShowStats] = useState(false);

  const [bet, setBet] = useState(10);
  const [selectedSide, setSelectedSide] = useState<Side | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<Side | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [wisdom, setWisdom] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);
  const [lastAchievement, setLastAchievement] = useState<Achievement | null>(null);
  const prevBalanceRef = useRef(balance);

  const persist = useCallback(
    (updates: Partial<SavedState>) => {
      setSaved(prev => ({ ...prev, ...updates }));
    },
    [setSaved],
  );

  const getWisdom = useCallback((side: Side): string => {
    const pool = side === 'yin' ? YIN_WISDOM : YANG_WISDOM;
    return pool[Math.floor(Math.random() * pool.length)];
  }, []);

  const checkAchievements = useCallback(
    (currentStats: GameStats): Achievement | null => {
      const newlyUnlocked = ACHIEVEMENTS.find(
        a => !unlockedAchievements.includes(a.id) && a.check(currentStats),
      );
      if (newlyUnlocked) {
        setUnlockedAchievements(prev => {
          const next = [...prev, newlyUnlocked.id];
          persist({ unlockedAchievements: next });
          return next;
        });
        playAchievementSound();
        setLastAchievement(newlyUnlocked);
      }
      return newlyUnlocked || null;
    },
    [unlockedAchievements, persist],
  );

  const handleFlip = useCallback(() => {
    if (isFlipping || !selectedSide || bet <= 0 || bet > balance) return;

    playFlipSound();
    prevBalanceRef.current = balance;
    setIsFlipping(true);
    setResult(null);
    setWon(null);
    setWisdom(null);
    setShowParticles(false);

    const outcome: Side = Math.random() < 0.5 ? 'yin' : 'yang';
    const playerWon = outcome === selectedSide;
    const streakBonus = stats.streak >= 3 ? 1.1 : 1;
    const pointsChange = playerWon ? Math.round(bet * 2 * streakBonus) : -bet;

    setTimeout(() => {
      setResult(outcome);
      setWon(playerWon);
      setWisdom(getWisdom(outcome));

      if (playerWon) playWinSound();
      else playLoseSound();

      setBalance(prev => {
        const newBalance = prev + (playerWon ? Math.round(bet * 2 * streakBonus) : -bet);
        return newBalance;
      });

      const entry: HistoryEntry = {
        id: nextId,
        side: outcome,
        won: playerWon,
        bet: playerWon ? Math.round(bet * 2 * streakBonus) : bet,
      };

      setHistory(prev => {
        const updated = [entry, ...prev].slice(0, 5);
        persist({ history: updated });
        return updated;
      });
      setNextId(id => {
        const next = id + 1;
        persist({ nextId: next });
        return next;
      });

      setStats(prev => {
        const newStreak = playerWon ? prev.streak + 1 : 0;
        const newStats: GameStats = {
          totalFlips: prev.totalFlips + 1,
          wins: prev.wins + (playerWon ? 1 : 0),
          losses: prev.losses + (playerWon ? 0 : 1),
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          balance: prev.balance + (playerWon ? Math.round(bet * 2 * streakBonus) : -bet),
          totalPointsEarned: prev.totalPointsEarned + (playerWon ? Math.round(bet * 2 * streakBonus) : 0),
          totalPointsLost: prev.totalPointsLost + (playerWon ? 0 : bet),
          yinCount: prev.yinCount + (outcome === 'yin' && playerWon ? 1 : 0),
          yangCount: prev.yangCount + (outcome === 'yang' && playerWon ? 1 : 0),
          isNewPlayer: false,
        };
        persist({ stats: newStats, balance: newStats.balance });
        checkAchievements(newStats);
        return newStats;
      });

      if (playerWon) {
        setShowParticles(true);
        setTimeout(() => setShowParticles(false), 1500);
      }

      setIsFlipping(false);
    }, 1200);
  }, [isFlipping, selectedSide, bet, balance, nextId, getWisdom, stats, checkAchievements, persist]);

  const handleReset = useCallback(() => {
    if (!window.confirm('¿Estás seguro? Todo tu progreso se perderá.')) return;
    clearSaved();
    setBalance(100);
    setHistory([]);
    setNextId(1);
    setUnlockedAchievements([]);
    setStats(INITIAL_STATS);
    setSelectedSide(null);
    setResult(null);
    setWon(null);
    setWisdom(null);
    setShowParticles(false);
    setLastAchievement(null);
    setBet(10);
  }, [clearSaved]);

  const isValidBet = bet > 0 && bet <= balance;
  const canFlip = !!selectedSide && isValidBet && !isFlipping;
  const hasStreakBonus = stats.streak >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-stone-900 to-zinc-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-stone-800/20 rounded-full blur-3xl" />
      </div>

      <AchievementPopup
        achievement={lastAchievement}
        onComplete={() => setLastAchievement(null)}
      />

      {showWelcome && (
        <WelcomeModal onStart={() => { setShowWelcome(false); persist({ hasSeenWelcome: true }); }} />
      )}

      <div className="relative w-full max-w-sm mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
              Moneda Yin Yang
            </h1>
            <p className="text-stone-500 text-xs mt-1">
              El equilibrio decide tu destino
            </p>
          </div>
          <button
            onClick={() => setShowStats(v => !v)}
            className="p-2 rounded-lg hover:bg-stone-800 transition-colors text-stone-400 hover:text-stone-200"
            aria-label="Estadísticas"
            title="Estadísticas"
          >
            <BarChart3 size={18} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <Coins className="text-amber-400" size={22} aria-hidden="true" />
          <AnimatedNumber
            value={balance}
            className="text-2xl font-bold text-amber-400 tabular-nums"
          />
          <span className="text-stone-500 text-xs">Puntos de Equilibrio</span>
        </div>

        {stats.streak >= 2 && (
          <div className="text-center mb-3" role="status" aria-live="polite">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-900/40 to-rose-900/40 border border-amber-700/30 text-amber-400 text-xs font-semibold">
              <TrendingUp size={14} />
              Racha de {stats.streak}
              {hasStreakBonus && (
                <span className="text-emerald-400 ml-1">×1.1 bonus activo</span>
              )}
            </span>
          </div>
        )}

        <div className="flex justify-center mb-6 relative">
          <ParticleEffect active={showParticles} />
          <YinYangCoin isFlipping={isFlipping} result={result} />
        </div>

        {balance <= 0 && (
          <div
            className="text-center mb-4 px-4 py-3 rounded-xl bg-rose-900/20 border border-rose-800/30 text-rose-400 text-sm"
            role="alert"
          >
            Te has quedado sin Puntos de Equilibrio.
          </div>
        )}

        <div className="mb-5">
          <label className="block text-xs text-stone-500 mb-2 text-center uppercase tracking-wider font-semibold">
            Tu apuesta
          </label>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setBet(Math.max(1, Math.ceil(balance / 2)))}
              className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 transition-colors border border-stone-700 disabled:opacity-30"
              disabled={isFlipping || balance <= 0}
              aria-label="Apostar la mitad"
            >
              ½
            </button>
            <button
              onClick={() => setBet(Math.max(1, bet - 10))}
              className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-lg transition-colors disabled:opacity-30 border border-stone-700"
              disabled={isFlipping || balance <= 0}
              aria-label="Reducir apuesta en 10"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={balance}
              value={bet}
              onChange={e => {
                const v = parseInt(e.target.value);
                if (isNaN(v) || v < 1) setBet(1);
                else setBet(Math.min(balance, v));
              }}
              className="w-20 text-center bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white text-lg font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
              disabled={isFlipping || balance <= 0}
              aria-label="Cantidad a apostar"
            />
            <button
              onClick={() => setBet(Math.min(balance, bet + 10))}
              className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-lg transition-colors disabled:opacity-30 border border-stone-700"
              disabled={isFlipping || balance <= 0}
              aria-label="Aumentar apuesta en 10"
            >
              +
            </button>
            <button
              onClick={() => setBet(balance)}
              className="px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 transition-colors border border-stone-700 disabled:opacity-30"
              disabled={isFlipping || balance <= 0}
              aria-label="Apostar todo"
            >
              Todo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => setSelectedSide('yin')}
            disabled={isFlipping || balance <= 0}
            className={`relative py-3.5 rounded-xl border-2 transition-all duration-200 ${
              selectedSide === 'yin'
                ? 'border-stone-400 bg-stone-800 shadow-lg shadow-stone-900/50'
                : 'border-stone-700/50 bg-stone-800/30 hover:bg-stone-800 hover:border-stone-500'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            aria-pressed={selectedSide === 'yin'}
            aria-label="Seleccionar Yin"
          >
            <div className="text-xl mb-1" aria-hidden="true">🌙</div>
            <div className="font-semibold text-sm">Yin</div>
            <div className="text-[10px] text-stone-500">Oscuridad</div>
          </button>
          <button
            onClick={() => setSelectedSide('yang')}
            disabled={isFlipping || balance <= 0}
            className={`relative py-3.5 rounded-xl border-2 transition-all duration-200 ${
              selectedSide === 'yang'
                ? 'border-amber-400 bg-amber-900/20 shadow-lg shadow-amber-900/30'
                : 'border-stone-700/50 bg-stone-800/30 hover:bg-stone-800 hover:border-amber-700'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            aria-pressed={selectedSide === 'yang'}
            aria-label="Seleccionar Yang"
          >
            <div className="text-xl mb-1" aria-hidden="true">☀️</div>
            <div className="font-semibold text-sm">Yang</div>
            <div className="text-[10px] text-stone-500">Luz</div>
          </button>
        </div>

        <button
          onClick={handleFlip}
          disabled={!canFlip || balance <= 0}
          className="w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-900 shadow-lg shadow-amber-600/25 hover:shadow-amber-500/40 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Lanzar moneda"
        >
          {isFlipping ? (
            <span className="flex items-center justify-center gap-2">
              <RotateCcw size={18} className="animate-spin" />
              Lanzando...
            </span>
          ) : (
            'Lanzar Moneda'
          )}
        </button>

        {wisdom && (
          <div className="mt-5">
            <WisdomMessage message={wisdom} won={won} />
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
              Últimos lanzamientos
            </h3>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-stone-500 hover:text-rose-400 transition-colors"
              aria-label="Reiniciar partida"
            >
              <RefreshCw size={12} />
              Reiniciar
            </button>
          </div>
          <BetHistory history={history} />
        </div>

        {showStats && (
          <div
            className="mt-6 p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 animate-fade-in"
            role="region"
            aria-label="Estadísticas"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                <BarChart3 size={14} />
                Estadísticas
              </h3>
              <button
                onClick={() => setShowStats(false)}
                className="text-stone-500 hover:text-stone-300 transition-colors"
                aria-label="Cerrar estadísticas"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
              <span className="text-stone-400">Lanzamientos</span>
              <span className="text-right text-stone-200 font-semibold tabular-nums">{stats.totalFlips}</span>
              <span className="text-stone-400">Victorias</span>
              <span className="text-right text-emerald-400 font-semibold tabular-nums">{stats.wins}</span>
              <span className="text-stone-400">Derrotas</span>
              <span className="text-right text-rose-400 font-semibold tabular-nums">{stats.losses}</span>
              <span className="text-stone-400">Precisión</span>
              <span className="text-right text-amber-400 font-semibold tabular-nums">
                {stats.totalFlips > 0
                  ? Math.round((stats.wins / stats.totalFlips) * 100)
                  : 0}%
              </span>
              <span className="text-stone-400">Mejor racha</span>
              <span className="text-right text-amber-400 font-semibold tabular-nums">{stats.bestStreak}</span>
              <span className="text-stone-400">Ganado (total)</span>
              <span className="text-right text-emerald-400 font-semibold tabular-nums">+{stats.totalPointsEarned}</span>
              <span className="text-stone-400">Perdido (total)</span>
              <span className="text-right text-rose-400 font-semibold tabular-nums">−{stats.totalPointsLost}</span>
              <span className="text-stone-400">Aciertos Yin</span>
              <span className="text-right text-indigo-400 font-semibold tabular-nums">{stats.yinCount}</span>
              <span className="text-stone-400">Aciertos Yang</span>
              <span className="text-right text-amber-400 font-semibold tabular-nums">{stats.yangCount}</span>
            </div>

            {unlockedAchievements.length > 0 && (
              <div className="mt-4 pt-4 border-t border-stone-700/50">
                <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <Trophy size={14} />
                  Logros ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id)).map(a => (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-900/20 border border-amber-700/30 text-amber-400 text-[10px]"
                      title={a.description}
                    >
                      {a.icon} {a.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
