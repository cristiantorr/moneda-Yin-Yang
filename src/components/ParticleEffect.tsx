import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  distance: number;
  isStar?: boolean;
}

interface ParticleEffectProps {
  active: boolean;
  streak?: number;
}

export default function ParticleEffect({ active, streak = 0 }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const isBigWin = streak >= 3;

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const count = isBigWin ? 50 : 28;
    const colors = isBigWin
      ? ['#fbbf24', '#fef08a', '#f59e0b', '#eab308', '#fcd34d']
      : ['#fbbf24', '#34d399', '#a78bfa', '#f472b6', '#22d3ee', '#f97316'];

    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 16,
      y: 50 + (Math.random() - 0.5) * 16,
      size: isBigWin ? 3 + Math.random() * 8 : 2 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      distance: isBigWin ? 40 + Math.random() * 140 : 30 + Math.random() * 90,
      isStar: isBigWin && Math.random() > 0.5,
    }));

    setParticles(newParticles);
  }, [active, isBigWin]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
      {particles.map(p => {
        const dx = Math.cos((p.angle * Math.PI) / 180) * p.distance;
        const dy = Math.sin((p.angle * Math.PI) / 180) * p.distance;
        return (
          <span
            key={p.id}
            className={`absolute rounded-full animate-particle ${p.isStar ? 'rotate-45' : ''}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.isStar ? p.size * 2.5 : p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              borderRadius: p.isStar ? '2px' : '50%',
              '--dx': `${dx}px`,
              '--dy': `${dy}px`,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
