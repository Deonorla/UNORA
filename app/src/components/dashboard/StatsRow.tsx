import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 28;
  const w = 60;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} className="opacity-40">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

const stats = [
  { label: 'Credit Score', value: '72', change: '+4', positive: true, data: [45, 52, 48, 55, 60, 58, 65, 62, 68, 72] },
  { label: 'Collateral Tier', value: '35%', change: '-5%', positive: true, data: [60, 55, 52, 48, 45, 42, 40, 38, 36, 35] },
  { label: 'Loan Ceiling', value: '$12.4k', change: '+$2.1k', positive: true, data: [8000, 8500, 9200, 9800, 10200, 10800, 11200, 11800, 12000, 12400] },
  { label: 'Yield Earned', value: '$178', change: '+4.2%', positive: true, data: [20, 45, 62, 78, 95, 110, 128, 145, 162, 178] },
];

export default function StatsRow() {
  const colors = useTheme();

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease }}
          className="p-4 rounded-2xl border shadow-sm"
          style={{ borderColor: colors.border, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
              {stat.label}
            </span>
            <MiniSparkline data={stat.data} color={stat.positive ? '#22C55E' : '#EF4444'} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-semibold" style={{ color: colors.text }}>
              {stat.value}
            </span>
            <span
              className="font-mono text-[10px]"
              style={{ color: stat.positive ? '#22C55E' : '#EF4444' }}
            >
              {stat.change}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
