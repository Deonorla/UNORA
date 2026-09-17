import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

export default function LoanCeiling() {
  const colors = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease }}
      className="rounded-2xl bg-white border border-white/50 shadow-[0_8px_40px_rgba(124,58,237,0.06)] p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: colors.textMuted }}>
          Loan Ceiling
        </span>
        <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-green-100 text-green-600">
          Active
        </span>
      </div>

      {/* Max loan */}
      <div className="mb-6">
        <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>
          Maximum loan
        </div>
        <div className="font-serif text-3xl font-semibold" style={{ color: colors.text }}>
          $12,400.00
        </div>
      </div>

      {/* Collateral tier */}
      <div className="p-4 rounded-xl bg-purple-50/50 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
            Collateral Tier
          </span>
          <span className="font-serif text-lg font-semibold" style={{ color: '#7C3AED' }}>
            35%
          </span>
        </div>
        <div className="h-2 rounded-full bg-purple-100 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-purple-500"
            initial={{ width: '0%' }}
            animate={{ width: '35%' }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="font-mono text-[8px]" style={{ color: colors.textMuted }}>20%</span>
          <span className="font-mono text-[8px]" style={{ color: colors.textMuted }}>80%</span>
        </div>
        <p className="font-sans text-[10px] mt-2" style={{ color: colors.textSecondary }}>
          Higher score = lower collateral required
        </p>
      </div>

      {/* Current positions */}
      <div className="space-y-3">
        <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
          Active Positions
        </div>

        <div className="p-3 rounded-xl bg-white/50 border border-white/40">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-medium" style={{ color: colors.text }}>Borrowed</span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-green-100 text-green-600">Streaming</span>
          </div>
          <div className="font-serif text-lg font-semibold" style={{ color: colors.text }}>$8,200.00</div>
          <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>4.2% APR · General Pool</div>
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="font-mono text-[8px]" style={{ color: colors.textMuted }}>Repaid</span>
              <span className="font-mono text-[8px]" style={{ color: colors.text }}>$5,330 / $8,200</span>
            </div>
            <div className="h-1.5 rounded-full bg-purple-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-green-400"
                initial={{ width: '0%' }}
                animate={{ width: '65%' }}
                transition={{ duration: 0.8, delay: 0.5, ease }}
              />
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/50 border border-white/40">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs font-medium" style={{ color: colors.text }}>Deposited</span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-green-100 text-green-600">Earning</span>
          </div>
          <div className="font-serif text-lg font-semibold" style={{ color: colors.text }}>$4,250.00</div>
          <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>4.2% APY · Senior Tranche</div>
        </div>
      </div>
    </motion.div>
  );
}
