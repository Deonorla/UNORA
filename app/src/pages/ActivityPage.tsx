import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  RotateCcw,
  Star,
  ArrowDownToLine,
  Banknote,
  Handshake,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import PageHeader from '@/components/dashboard/PageHeader';

const ease = [0.22, 1, 0.36, 1] as const;

type EventKind = 'stream' | 'repayment' | 'score' | 'deposit' | 'loan' | 'sponsor' | 'default';

interface ProtocolEvent {
  kind: EventKind;
  name: string;
  detail: string;
  amount: string;
  time: string;
  /** Seconds ago — used for ordering, since the display strings aren't sortable. */
  age: number;
}

const KIND_META: Record<EventKind, { label: string; color: string; Icon: LucideIcon }> = {
  stream: { label: 'Stream tick', color: '#639922', Icon: TrendingUp },
  repayment: { label: 'Repayment', color: '#7C3AED', Icon: RotateCcw },
  score: { label: 'Score update', color: '#639922', Icon: Star },
  deposit: { label: 'Deposit', color: '#7C3AED', Icon: ArrowDownToLine },
  loan: { label: 'Loan', color: '#639922', Icon: Banknote },
  sponsor: { label: 'Sponsorship', color: '#7C3AED', Icon: Handshake },
  default: { label: 'Default', color: '#BA7517', Icon: ShieldAlert },
};

const EVENTS: ProtocolEvent[] = [
  { kind: 'stream', name: 'Stream tick', detail: 'Repayment stream #12', amount: '+0.000650 USDC', time: 'just now', age: 5 },
  { kind: 'stream', name: 'Stream tick', detail: 'Repayment stream #12', amount: '+0.000650 USDC', time: '1m ago', age: 60 },
  { kind: 'stream', name: 'Stream tick', detail: 'Repayment stream #12', amount: '+0.000650 USDC', time: '2m ago', age: 120 },
  { kind: 'repayment', name: 'Repayment', detail: 'Loan #1247 — principal', amount: '$45.00', time: '1h ago', age: 3_600 },
  { kind: 'score', name: 'Score update', detail: 'Milestone: 18 months history', amount: '+2 pts', time: '3h ago', age: 10_800 },
  { kind: 'deposit', name: 'Deposit', detail: 'General Pool — 4.2% APY', amount: '$500.00', time: '1d ago', age: 86_400 },
  { kind: 'sponsor', name: 'Capacity delegated', detail: 'To T. Reyes', amount: '$3,000', time: '2d ago', age: 172_800 },
  { kind: 'sponsor', name: 'Capacity delegated', detail: 'To J. Lindqvist', amount: '$2,000', time: '3d ago', age: 259_200 },
  { kind: 'default', name: 'Default flagged', detail: 'A. Bello — stream stalled', amount: 'slashed', time: '4d ago', age: 345_600 },
  { kind: 'loan', name: 'Loan received', detail: 'General Pool — 4.2% APR', amount: '$8,200', time: '5d ago', age: 432_000 },
  { kind: 'repayment', name: 'Repayment', detail: 'Loan #7 — interest', amount: '$28.40', time: '6d ago', age: 518_400 },
  { kind: 'score', name: 'Score update', detail: 'Repayment rate: 94%', amount: '+1 pt', time: '1w ago', age: 604_800 },
  { kind: 'deposit', name: 'Deposit', detail: 'Bluechip Pool — 5.8% APY', amount: '$1,250.00', time: '1w ago', age: 691_200 },
  { kind: 'sponsor', name: 'Sponsorship received', detail: 'From M. Okafor', amount: '$8,000', time: '2w ago', age: 1_209_600 },
  { kind: 'loan', name: 'Loan repaid', detail: 'Loan #6 — closed', amount: '$3,400', time: '3w ago', age: 1_814_400 },
  { kind: 'score', name: 'Score update', detail: 'Collateral tier: 40% → 35%', amount: '+3 pts', time: '1mo ago', age: 2_592_000 },
  { kind: 'deposit', name: 'Deposit', detail: 'General Pool — 4.2% APY', amount: '$2,500.00', time: '1mo ago', age: 2_678_400 },
  { kind: 'loan', name: 'Loan received', detail: 'Sponsored Pool — 3.8% APR', amount: '$5,000', time: '2mo ago', age: 5_184_000 },
];

const FILTERS: { key: EventKind | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'stream', label: 'Stream' },
  { key: 'repayment', label: 'Repayments' },
  { key: 'score', label: 'Score' },
  { key: 'deposit', label: 'Deposits' },
  { key: 'loan', label: 'Loans' },
  { key: 'sponsor', label: 'Sponsorships' },
  { key: 'default', label: 'Defaults' },
];

export default function ActivityPage() {
  const colors = useTheme();
  const [filter, setFilter] = useState<EventKind | 'all'>('all');

  const visible = useMemo(
    () => (filter === 'all' ? EVENTS : EVENTS.filter((e) => e.kind === filter)),
    [filter],
  );

  const counts = useMemo(() => {
    const map = new Map<EventKind, number>();
    for (const event of EVENTS) map.set(event.kind, (map.get(event.kind) ?? 0) + 1);
    return map;
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F5F2' }}>
      <DashboardSidebar />

      <main className="ml-60 min-h-screen">
        <PageHeader
          title="Activity"
          subtitle="Every protocol event on your wallet — stream ticks, repayments, score changes, and sponsorship movements."
        />

        <div className="max-w-[1100px] mx-auto px-8 py-8">
          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease }}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <div className="p-4 rounded-2xl border shadow-sm" style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>Events recorded</div>
              <div className="font-serif text-xl font-semibold" style={{ color: colors.text }}>{EVENTS.length}</div>
            </div>
            <div className="p-4 rounded-2xl border shadow-sm" style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>Stream ticks</div>
              <div className="font-serif text-xl font-semibold" style={{ color: colors.text }}>{counts.get('stream') ?? 0}</div>
            </div>
            <div className="p-4 rounded-2xl border shadow-sm" style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>Defaults</div>
              <div className="font-serif text-xl font-semibold" style={{ color: '#BA7517' }}>{counts.get('default') ?? 0}</div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14, ease }}
            className="flex items-center gap-2 mb-5 flex-wrap"
          >
            {FILTERS.map((option) => {
              const isActive = filter === option.key;
              const count = option.key === 'all' ? EVENTS.length : counts.get(option.key) ?? 0;
              return (
                <button
                  key={option.key}
                  onClick={() => setFilter(option.key)}
                  className="px-3 py-1.5 rounded-lg font-sans text-xs transition-colors"
                  style={{
                    backgroundColor: isActive ? '#7C3AED' : 'rgba(124,58,237,0.07)',
                    color: isActive ? '#FFFFFF' : '#7C3AED',
                  }}
                >
                  {option.label}
                  <span className="font-mono text-[10px] ml-1.5" style={{ opacity: 0.7 }}>{count}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Event list */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="rounded-2xl border shadow-sm overflow-hidden"
            style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}
          >
            <div
              className="grid grid-cols-[2.2fr_1fr_100px] gap-4 px-6 py-3 border-b text-[10px] font-mono uppercase tracking-widest"
              style={{ borderColor: colors.border, color: colors.textMuted }}
            >
              <span>Event</span>
              <span className="text-right">Amount</span>
              <span className="text-right">When</span>
            </div>

            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((event, i) => {
                const meta = KIND_META[event.kind];
                const Icon = meta.Icon;
                return (
                  <motion.div
                    key={`${event.kind}-${event.age}`}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.28, delay: Math.min(i * 0.025, 0.3), ease }}
                    className="grid grid-cols-[2.2fr_1fr_100px] gap-4 px-6 py-3.5 border-b last:border-b-0 items-center transition-colors hover:bg-purple-50/30"
                    style={{ borderColor: colors.border }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${meta.color}15` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: meta.color }} strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-sans text-xs font-medium" style={{ color: colors.text }}>{event.name}</div>
                        <div className="font-mono text-[9px] truncate" style={{ color: colors.textMuted }}>{event.detail}</div>
                      </div>
                    </div>

                    <div className="font-mono text-xs text-right" style={{ color: meta.color }}>
                      {event.amount}
                    </div>

                    <div className="font-mono text-[10px] text-right" style={{ color: colors.textMuted }}>
                      {event.time}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {visible.length === 0 && (
              <div className="px-6 py-12 text-center font-sans text-sm" style={{ color: colors.textMuted }}>
                No events of this type yet.
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
