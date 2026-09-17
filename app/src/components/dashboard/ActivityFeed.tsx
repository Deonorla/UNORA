import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

const activities = [
  {
    type: 'stream_tick',
    title: 'Stream tick',
    detail: 'Repayment stream #12 — tick 847',
    amount: '+0.5 pts',
    time: '2m ago',
    color: '#22C55E',
    icon: '→',
  },
  {
    type: 'repayment',
    title: 'Repayment',
    detail: 'Loan #7 — $45.00 via stream',
    amount: '$45.00',
    time: '1h ago',
    color: '#7C3AED',
    icon: '↩',
  },
  {
    type: 'score_update',
    title: 'Score update',
    detail: 'Milestone: 18 months history',
    amount: '+2 pts',
    time: '3h ago',
    color: '#22C55E',
    icon: '★',
  },
  {
    type: 'deposit',
    title: 'Deposit',
    detail: 'General Pool — Senior Tranche',
    amount: '$500.00',
    time: '1d ago',
    color: '#7C3AED',
    icon: '↓',
  },
  {
    type: 'stream_start',
    title: 'Stream started',
    detail: 'Loan #7 — Repayment stream active',
    amount: '$8,200',
    time: '5d ago',
    color: '#22C55E',
    icon: '▶',
  },
  {
    type: 'loan',
    title: 'Loan received',
    detail: 'General Pool — 4.2% APR',
    amount: '$8,200.00',
    time: '5d ago',
    color: '#7C3AED',
    icon: '💰',
  },
  {
    type: 'sponsored',
    title: 'Sponsored',
    detail: 'DeFi Whale delegated $2,000 ceiling',
    amount: '$2,000',
    time: '2w ago',
    color: '#22C55E',
    icon: '🤝',
  },
];

export default function ActivityFeed() {
  const colors = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease }}
      className="rounded-2xl bg-white border border-white/50 shadow-[0_8px_40px_rgba(124,58,237,0.06)] p-6 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: colors.textMuted }}>
          Activity
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[8px] px-2 py-0.5 rounded-full bg-green-100 text-green-600">Live</span>
          <button className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/60 border border-white/40" style={{ color: colors.textMuted }}>
            Filter
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50/50 border border-purple-100 mb-4">
        <svg className="w-3.5 h-3.5" style={{ color: colors.textMuted }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="font-sans text-xs" style={{ color: colors.textMuted }}>Search activities...</span>
      </div>

      {/* Activity list */}
      <div className="space-y-2">
        {activities.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.05, ease }}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ backgroundColor: item.color + '15', color: item.color }}
              >
                {item.icon}
              </div>
              <div>
                <div className="font-sans text-xs font-medium" style={{ color: colors.text }}>
                  {item.title}
                </div>
                <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>
                  {item.detail}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs font-medium" style={{ color: item.color }}>
                {item.amount}
              </div>
              <div className="font-mono text-[8px]" style={{ color: colors.textMuted }}>
                {item.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
