import { useEffect, useState } from 'react';

interface AchievementPopupProps {
  achievement: { id: string; title: string; description: string; icon: string } | null;
  onComplete: () => void;
}

export default function AchievementPopup({ achievement, onComplete }: AchievementPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!achievement) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [achievement]);

  if (!achievement && !visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-400 ${
        visible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="bg-gradient-to-r from-amber-900/90 to-stone-900/90 backdrop-blur-md border border-amber-600/50 rounded-xl px-5 py-4 shadow-2xl shadow-amber-900/30 max-w-xs">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{achievement?.icon}</span>
          <div>
            <p className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">
              Logro desbloqueado
            </p>
            <p className="text-white font-bold text-sm mt-0.5">{achievement?.title}</p>
            <p className="text-stone-400 text-xs mt-0.5">{achievement?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
