interface WisdomMessageProps {
  message: string | null;
  won: boolean | null;
}

export default function WisdomMessage({ message, won }: WisdomMessageProps) {
  if (!message || won === null) return null;

  return (
    <div
      className={`text-center px-6 py-4 rounded-xl border backdrop-blur-sm transition-all duration-500 ${
        won
          ? 'bg-emerald-900/30 border-emerald-700/50 text-emerald-300 shadow-lg shadow-emerald-900/20'
          : 'bg-rose-900/30 border-rose-700/50 text-rose-300 shadow-lg shadow-rose-900/20'
      }`}
    >
      <p className="text-sm italic font-serif leading-relaxed">
        &ldquo;{message}&rdquo;
      </p>
    </div>
  );
}
