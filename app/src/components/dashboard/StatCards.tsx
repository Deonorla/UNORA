import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';
import { STAT_CARDS, type StatCard } from '@/lib/portfolio';

const ease = [0.22, 1, 0.36, 1] as const;

const TONE: Record<StatCard['tone'], string> = {
  good: '#639922',
  warn: '#BA7517',
  neutral: '#888780',
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 68;
  const h = 26;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');

  return (
    <svg width={w} height={h} className="shrink-0" aria-hidden="true">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        opacity={0.85}
      />
    </svg>
  );
}

export default function StatCards() {
  const colors = useTheme();

  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {STAT_CARDS.map((stat, i) => {
        const tone = TONE[stat.tone];
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease }}
            className="p-4 rounded-2xl border shadow-sm"
            style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span
                className="font-mono text-[9px] uppercase tracking-widest leading-relaxed"
                style={{ color: colors.textMuted }}
              >
                {stat.label}
              </span>
              <Sparkline data={stat.series} color={tone} />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-semibold tabular-nums" style={{ color: colors.text }}>
                {stat.value}
              </span>
              <span className="font-mono text-[10px]" style={{ color: tone }}>
                {stat.delta}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
