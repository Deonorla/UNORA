import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

export default function ScoreCard() {
  const colors = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease }}
      className="rounded-2xl bg-white border border-white/50 shadow-[0_8px_40px_rgba(124,58,237,0.06)] p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: colors.textMuted }}>
          Credit Score
        </span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-mono text-[9px] text-green-600">Synced</span>
        </div>
      </div>

      {/* Score */}
      <div className="flex items-end gap-3 mb-2">
        <span className="font-serif text-6xl font-semibold tracking-tight" style={{ color: colors.text }}>
          72
        </span>
        <div className="mb-2">
          <span className="font-sans text-sm font-medium text-green-500">+4</span>
          <span className="font-sans text-sm" style={{ color: colors.textMuted }}> this week</span>
        </div>
      </div>
      <p className="font-mono text-[10px] mb-6" style={{ color: colors.textMuted }}>
        Top 28% of borrowers · ScoreRegistry #1247
      </p>

      {/* Score bar */}
      <div className="mb-4">
        <div className="h-3 rounded-full bg-purple-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7C3AED, #A78BFA)' }}
            initial={{ width: '0%' }}
            animate={{ width: '72%' }}
            transition={{ duration: 1, delay: 0.3, ease }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-mono text-[9px]" style={{ color: colors.textMuted }}>0</span>
          <span className="font-mono text-[9px]" style={{ color: colors.textMuted }}>100</span>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Repayment', value: '94%', color: '#22C55E' },
          { label: 'History', value: '18 mo', color: '#7C3AED' },
          { label: 'Collateral', value: 'Stable', color: '#22C55E' },
          { label: 'Liquidations', value: '0', color: '#22C55E' },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-xl bg-purple-50/50">
            <div className="font-mono text-[8px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>
              {item.label}
            </div>
            <div className="font-serif text-base font-semibold" style={{ color: item.color }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Soulbound NFT badge */}
      <div className="mt-4 p-3 rounded-xl border border-purple-200 bg-purple-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
            <img src="/Unora icon.png" alt="" className="h-6 w-auto" />
          </div>
          <div>
            <div className="font-sans text-xs font-medium" style={{ color: colors.text }}>
              Soulbound Score NFT
            </div>
            <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>
              Non-transferable · Updated via Chainlink CRE
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
