export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  check: (stats: GameStats) => boolean;
}

export interface GameStats {
  totalFlips: number;
  wins: number;
  losses: number;
  streak: number;
  bestStreak: number;
  balance: number;
  totalPointsEarned: number;
  totalPointsLost: number;
  yinCount: number;
  yangCount: number;
  isNewPlayer: boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-flip',
    title: 'Primer Lanzamiento',
    description: 'Lanzaste la moneda por primera vez',
    icon: '🪙',
    check: s => s.totalFlips >= 1,
  },
  {
    id: 'first-win',
    title: 'Primera Victoria',
    description: 'Ganaste tu primera apuesta',
    icon: '✨',
    check: s => s.wins >= 1,
  },
  {
    id: 'streak-3',
    title: 'En Racha',
    description: 'Alcanzaste 3 victorias consecutivas',
    icon: '🔥',
    check: s => s.streak >= 3,
  },
  {
    id: 'streak-5',
    title: 'Imparable',
    description: 'Alcanzaste 5 victorias consecutivas',
    icon: '⚡',
    check: s => s.streak >= 5,
  },
  {
    id: 'balance-200',
    title: 'Equilibrista',
    description: 'Acumulaste 200 Puntos de Equilibrio',
    icon: '☯',
    check: s => s.balance >= 200,
  },
  {
    id: 'balance-500',
    title: 'Maestro del Equilibrio',
    description: 'Acumulaste 500 Puntos de Equilibrio',
    icon: '🌟',
    check: s => s.balance >= 500,
  },
  {
    id: 'flips-10',
    title: 'Aprendiz',
    description: 'Realizaste 10 lanzamientos',
    icon: '📿',
    check: s => s.totalFlips >= 10,
  },
  {
    id: 'flips-25',
    title: 'Filósofo',
    description: 'Realizaste 25 lanzamientos',
    icon: '🧘',
    check: s => s.totalFlips >= 25,
  },
  {
    id: 'yin-devotee',
    title: 'Devoto de Yin',
    description: 'Acertaste 5 veces con Yin',
    icon: '🌙',
    check: s => s.yinCount >= 5,
  },
  {
    id: 'yang-devotee',
    title: 'Devoto de Yang',
    description: 'Acertaste 5 veces con Yang',
    icon: '☀️',
    check: s => s.yangCount >= 5,
  },
  {
    id: 'comeback',
    title: 'Renacido',
    description: 'Volviste de 0 puntos a 100+',
    icon: '🦋',
    check: s => s.isNewPlayer === false,
  },
  {
    id: 'best-streak-7',
    title: 'Leyenda',
    description: 'Alcanzaste 7 victorias consecutivas',
    icon: '🏆',
    check: s => s.bestStreak >= 7,
  },
];
