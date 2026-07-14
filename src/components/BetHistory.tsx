import { Moon, Sun } from 'lucide-react';

interface HistoryEntry {
  id: number;
  side: 'yin' | 'yang';
  won: boolean;
  bet: number;
}

interface BetHistoryProps {
  history: HistoryEntry[];
}

export default function BetHistory({ history }: BetHistoryProps) {
  if (history.length === 0) {
    return (
      <p className="text-stone-500 text-sm text-center">
        Aún no hay lanzamientos
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {history.map((entry, i) => (
        <div
          key={entry.id}
          className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm transition-all ${
            entry.won
              ? 'bg-emerald-900/20 border-emerald-800/30 text-emerald-300'
              : 'bg-rose-900/20 border-rose-800/30 text-rose-400'
          } animate-fade-in-up`}
          style={{ animationDelay: `${i * 60}ms` }}
          role="listitem"
        >
          <div className="flex items-center gap-2.5">
            {entry.side === 'yin' ? (
              <Moon size={16} className="text-indigo-400" aria-hidden="true" />
            ) : (
              <Sun size={16} className="text-amber-400" aria-hidden="true" />
            )}
            <span className="font-semibold capitalize">{entry.side}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-stone-400 tabular-nums">{entry.bet} pts</span>
            <span
              className={`font-bold ${
                entry.won ? 'text-emerald-400' : 'text-rose-400'
              }`}
              aria-label={entry.won ? 'Ganó' : 'Perdió'}
            >
              {entry.won ? '+✓' : '−✗'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
