import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

export default function DashboardHeader() {
  const colors = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease }}
      className="mb-8"
    >
      {/* Title row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-tight mb-1" style={{ color: colors.text }}>
            Dashboard
          </h1>
          <p className="font-sans text-sm" style={{ color: colors.textSecondary }}>
            Your credit score, loans, and protocol activity
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Credit Score</div>
            <div className="font-serif text-2xl font-semibold" style={{ color: '#7C3AED' }}>72</div>
          </div>
          <div className="w-px h-10" style={{ backgroundColor: colors.border }} />
          <div className="text-right">
            <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Collateral Tier</div>
            <div className="font-serif text-2xl font-semibold" style={{ color: colors.text }}>35%</div>
          </div>
          <div className="w-px h-10" style={{ backgroundColor: colors.border }} />
          <div className="text-right">
            <div className="font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Loan Ceiling</div>
            <div className="font-serif text-2xl font-semibold" style={{ color: colors.text }}>$12.4k</div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-6">
        {[
          { label: 'Total Deposited', value: '$4,250', sub: '4.2% APY' },
          { label: 'Total Borrowed', value: '$8,200', sub: '4.2% APR' },
          { label: 'Repaid', value: '$5,330', sub: '65%' },
          { label: 'Yield Earned', value: '$178.50', sub: '+4.2%' },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div>
              <div className="font-mono text-[8px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
                {stat.label}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-lg font-semibold" style={{ color: colors.text }}>
                  {stat.value}
                </span>
                <span className="font-mono text-[9px]" style={{ color: '#22C55E' }}>
                  {stat.sub}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
