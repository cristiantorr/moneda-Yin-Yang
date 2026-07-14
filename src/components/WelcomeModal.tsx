interface WelcomeModalProps {
  onStart: () => void;
}

export default function WelcomeModal({ onStart }: WelcomeModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-sm bg-gradient-to-b from-stone-800 to-zinc-900 border border-stone-700 rounded-2xl p-6 shadow-2xl text-center"
        role="dialog"
        aria-labelledby="welcome-title"
      >
        <div className="text-5xl mb-4">☯</div>
        <h2
          id="welcome-title"
          className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent"
        >
          Moneda Yin Yang
        </h2>
        <p className="text-stone-400 text-sm mt-2 leading-relaxed">
          El equilibrio decide tu destino. Elige un lado, apuesta tus Puntos de Equilibrio y
          descubre lo que el universo tiene para ti.
        </p>

        <div className="mt-5 space-y-2 text-left text-sm text-stone-400">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">1.</span>
            <span>Selecciona <strong className="text-white">Yin</strong> (oscuridad) o <strong className="text-white">Yang</strong> (luz)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">2.</span>
            <span>Define tu apuesta en Puntos de Equilibrio</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5">3.</span>
            <span>¡Lanza la moneda! Si aciertas, <strong className="text-emerald-400">duplicas</strong> lo apostado</span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="mt-6 w-full py-3 rounded-xl font-bold text-base bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-900 shadow-lg shadow-amber-600/25 transition-all"
          autoFocus
        >
          Comenzar
        </button>
      </div>
    </div>
  );
}
