import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import {
  TrendingUp,
  RotateCcw,
  Star,
  ArrowDownToLine,
  ShieldAlert,
  Search,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

interface Activity {
  name: string;
  detail: string;
  amount: string;
  /** Short label under the amount, mirroring a transaction type. */
  kind: string;
  time: string;
  color: string;
  Icon: LucideIcon;
}

/**
 * The five most recent events. Deliberately short — the full feed lives at
 * /dashboard/activity, and a dashboard that lists everything is a report.
 *
 * Grouped the way a statement reads: today first, then backwards.
 */
const GROUPS: { label: string; items: Activity[] }[] = [
  {
    label: 'Today',
    items: [
      { name: 'Stream tick', detail: 'Repayment stream #12', amount: '+0.000650 USDC', kind: 'Stream', time: '2m ago', color: '#639922', Icon: TrendingUp },
      { name: 'Repayment', detail: 'Loan #12 — principal', amount: '$45.00', kind: 'Repaid', time: '1h ago', color: '#7C3AED', Icon: RotateCcw },
      { name: 'Score update', detail: 'Milestone: 18 months history', amount: '+2 pts', kind: 'Score', time: '3h ago', color: '#639922', Icon: Star },
    ],
  },
  {
    label: 'This week',
    items: [
      { name: 'Deposit', detail: 'General pool — 2.72% APY', amount: '$500.00', kind: 'Deposit', time: '1d ago', color: '#7C3AED', Icon: ArrowDownToLine },
      { name: 'Default flagged', detail: 'A. Bello — stream stalled', amount: 'slashed', kind: 'Default', time: '4d ago', color: '#BA7517', Icon: ShieldAlert },
    ],
  },
];

export default function ActivityList() {
  const colors = useTheme();

  // Flat index per row, so the stagger keeps counting across groups without a counter
  // mutated during render.
  const groupOffsets = GROUPS.map((_, gi) =>
    GROUPS.slice(0, gi).reduce((total, group) => total + group.items.length, 0),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease }}
      className="rounded-2xl border shadow-sm p-5"
      style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-sans text-xs font-medium" style={{ color: colors.text }}>
          Transactions
        </span>
        <div className="flex items-center gap-2">
          <button
            aria-label="Search transactions"
            className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors hover:bg-white"
            style={{ borderColor: colors.border }}
          >
            <Search className="w-3.5 h-3.5" style={{ color: colors.textMuted }} strokeWidth={1.5} />
          </button>
          <button
            aria-label="Filter transactions"
            className="w-7 h-7 rounded-lg flex items-center justify-center border transition-colors hover:bg-white"
            style={{ borderColor: colors.border }}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" style={{ color: colors.textMuted }} strokeWidth={1.5} />
          </button>
          <Link
            to="/dashboard/activity"
            className="px-2.5 py-1.5 rounded-lg font-sans text-[10px] font-medium transition-colors"
            style={{ backgroundColor: 'rgba(124,58,237,0.07)', color: '#7C3AED' }}
          >
            View all
          </Link>
        </div>
      </div>

      {/* Groups */}
      <div className="space-y-5">
        {GROUPS.map((group, gi) => (
          <div key={group.label}>
            <div
              className="font-mono text-[9px] uppercase tracking-widest mb-2"
              style={{ color: colors.textMuted }}
            >
              {group.label}
            </div>

            <div className="space-y-0.5">
              {group.items.map((item, ii) => {
                const Icon = item.Icon;
                const delay = 0.45 + (groupOffsets[gi] + ii) * 0.04;
                return (
                  <motion.div
                    key={`${group.label}-${item.name}-${item.time}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay, ease }}
                    className="flex items-center justify-between gap-3 px-2 py-2.5 rounded-xl transition-colors hover:bg-purple-50/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${item.color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: item.color }} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-sans text-xs font-medium truncate" style={{ color: colors.text }}>
                          {item.name}
                        </div>
                        <div className="font-mono text-[9px] truncate" style={{ color: colors.textMuted }}>
                          {item.detail} · {item.time}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono text-xs tabular-nums" style={{ color: item.color }}>
                        {item.amount}
                      </div>
                      <div className="font-mono text-[8px]" style={{ color: colors.textMuted }}>
                        {item.kind}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
