import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

const activities = [
  { type: 'Stream tick', detail: 'Repayment stream #12 — tick 847', amount: '+0.5 pts', time: '2m ago', color: '#22C55E', icon: '→' },
  { type: 'Repayment', detail: 'Loan #7 — $45.00 via stream', amount: '$45.00', time: '1h ago', color: '#7C3AED', icon: '↩' },
  { type: 'Score update', detail: 'Milestone: 18 months history', amount: '+2 pts', time: '3h ago', color: '#22C55E', icon: '★' },
  { type: 'Deposit', detail: 'General Pool — Senior Tranche', amount: '$500.00', time: '1d ago', color: '#7C3AED', icon: '↓' },
  { type: 'Stream started', detail: 'Loan #7 — Repayment stream active', amount: '$8,200', time: '5d ago', color: '#22C55E', icon: '▶' },
  { type: 'Loan received', detail: 'General Pool — 4.2% APR', amount: '$8,200.00', time: '5d ago', color: '#7C3AED', icon: '💰' },
  { type: 'Sponsored', detail: 'DeFi Whale delegated $2,000 ceiling', amount: '$2,000', time: '2w ago', color: '#22C55E', icon: '🤝' },
  { type: 'Score update', detail: 'Repayment streak: 12 ticks', amount: '+1 pt', time: '2w ago', color: '#22C55E', icon: '★' },
];

export default function ActivityTable() {
  const colors = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
            <span className="text-sm" style={{ color: '#7C3AED' }}>◷</span>
          </div>
          <div>
            <h2 className="font-serif text-xl tracking-tight" style={{ color: colors.text }}>Activity</h2>
            <p className="font-sans text-xs" style={{ color: colors.textSecondary }}>Recent protocol events</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-green-100 text-green-600">Live</span>
          <button className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/60 border border-white/40" style={{ color: colors.textMuted }}>
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: colors.border }}>
        {/* Table header */}
        <div
          className="grid grid-cols-12 gap-4 px-5 py-3 border-b"
          style={{ backgroundColor: 'rgba(243, 232, 255, 0.3)', borderColor: colors.border }}
        >
          <div className="col-span-3 font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Event</div>
          <div className="col-span-4 font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Detail</div>
          <div className="col-span-2 font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Amount</div>
          <div className="col-span-3 font-mono text-[9px] uppercase tracking-widest text-right" style={{ color: colors.textMuted }}>Time</div>
        </div>

        {/* Table rows */}
        {activities.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.35 + i * 0.04, ease }}
            className="grid grid-cols-12 gap-4 px-5 py-3 border-b last:border-b-0 hover:bg-purple-50/20 transition-colors cursor-pointer"
            style={{ borderColor: colors.border }}
          >
            {/* Event */}
            <div className="col-span-3 flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                style={{ backgroundColor: item.color + '15', color: item.color }}
              >
                {item.icon}
              </div>
              <span className="font-sans text-xs font-medium" style={{ color: colors.text }}>{item.type}</span>
            </div>

            {/* Detail */}
            <div className="col-span-4 flex items-center">
              <span className="font-mono text-[10px]" style={{ color: colors.textSecondary }}>{item.detail}</span>
            </div>

            {/* Amount */}
            <div className="col-span-2 flex items-center">
              <span className="font-mono text-xs font-medium" style={{ color: item.color }}>{item.amount}</span>
            </div>

            {/* Time */}
            <div className="col-span-3 flex items-center justify-end">
              <span className="font-mono text-[10px]" style={{ color: colors.textMuted }}>{item.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
