import { useEffect, useState } from 'react';

interface YinYangCoinProps {
  isFlipping: boolean;
  result: 'yin' | 'yang' | null;
}

function YinYangIcon({ size, color }: { size: number; color: string }) {
  const opposite = color === 'black' ? 'white' : 'black';
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="50" fill={color} />
      <path
        d="M50,0 A50,50 0 0,1 100,50 A50,50 0 0,1 50,100 A25,25 0 0,0 50,50 A25,25 0 0,1 50,0 Z"
        fill={opposite}
      />
      <circle cx="50" cy="25" r="10" fill={color} />
      <circle cx="50" cy="75" r="10" fill={opposite} />
    </svg>
  );
}

export default function YinYangCoin({ isFlipping, result }: YinYangCoinProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!isFlipping || !result) return;

    const targetAngle = result === 'yang' ? 0 : 180;
    const currentBase = ((rotation % 360) + 360) % 360;
    let diff = targetAngle - currentBase;
    if (diff < 0) diff += 360;

    setRotation(prev => prev + 360 * 5 + diff);
  }, [isFlipping, result]);

  return (
    <div className="w-36 h-36 relative" style={{ perspective: '1000px' }}>
      <div
        className={`w-full h-full ${
          isFlipping ? 'animate-flip-trajectory' : 'animate-idle-wobble'
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="w-full h-full relative rounded-full overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            transition: isFlipping
              ? 'transform 1200ms cubic-bezier(0.15, 0.85, 0.35, 1)'
              : 'none',
          }}
        >
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-stone-100 to-amber-100 border-[3px] border-amber-300 flex items-center justify-center shadow-xl shadow-amber-300/20"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <YinYangIcon size={60} color="black" />
            <span className="absolute bottom-2 text-[10px] font-bold text-stone-600 tracking-[0.2em] uppercase">
              Yang
            </span>
          </div>
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-stone-900 to-indigo-950 border-[3px] border-stone-600 flex items-center justify-center shadow-xl shadow-indigo-500/20"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <YinYangIcon size={60} color="white" />
            <span className="absolute bottom-2 text-[10px] font-bold text-stone-400 tracking-[0.2em] uppercase">
              Yin
            </span>
          </div>

          <div
            className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shine" />
          </div>
          <div
            className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine" />
          </div>
        </div>
      </div>
      <div
        className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-28 h-3 rounded-full bg-black transition-all duration-500 ${
          isFlipping
            ? 'opacity-10 scale-50 translate-y-2 blur-sm'
            : 'opacity-40 scale-100 blur-none'
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
