import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

export default function ScoreHeroCard() {
  const colors = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.05, ease }}
      className="mb-6"
    >
      <div className="relative rounded-3xl overflow-hidden p-8 shadow-sm border" style={{ backgroundColor: '#FAF8F6', borderColor: colors.border }}>
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 flex items-center justify-between">
          {/* Left — Score */}
          <div className="flex items-center gap-8">
            {/* Score circle */}
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120">
                {/* Background circle */}
                <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                {/* Progress arc */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - 0.72) }}
                  transition={{ duration: 1.2, delay: 0.3, ease }}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-4xl font-semibold" style={{ color: colors.text }}>72</span>
                <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: colors.textMuted }}>/100</span>
              </div>
            </div>

            {/* Score details */}
            <div>
              <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>
                Credit Score
              </div>
              <div className="font-serif text-xl font-semibold mb-3" style={{ color: colors.text }}>
                Top 28% of borrowers
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-mono text-[10px]" style={{ color: colors.textMuted }}>Repayment: 94%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7C3AED' }} />
                  <span className="font-mono text-[10px]" style={{ color: colors.textMuted }}>History: 18 mo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-mono text-[10px]" style={{ color: colors.textMuted }}>Liquidations: 0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Quick stats */}
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="font-mono text-[8px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>
                Collateral Tier
              </div>
              <div className="font-serif text-2xl font-semibold" style={{ color: colors.text }}>35%</div>
              <div className="font-mono text-[9px] text-green-500">Lower is better</div>
            </div>
            <div className="w-px h-12" style={{ backgroundColor: colors.border }} />
            <div className="text-right">
              <div className="font-mono text-[8px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>
                Loan Ceiling
              </div>
              <div className="font-serif text-2xl font-semibold" style={{ color: colors.text }}>$12,400</div>
              <div className="font-mono text-[9px] text-green-500">+$2,100 this month</div>
            </div>
            <div className="w-px h-12" style={{ backgroundColor: colors.border }} />
            <div className="text-right">
              <div className="font-mono text-[8px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>
                Active Loans
              </div>
              <div className="font-serif text-2xl font-semibold" style={{ color: colors.text }}>1</div>
              <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>Streaming</div>
            </div>
          </div>
        </div>

        {/* Soulbound badge */}
        <div className="relative z-10 mt-6 flex items-center gap-2">
          <div className="w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(124,58,237,0.1)' }}>
            <img src="/Unora icon.png" alt="" className="h-3 w-auto" />
          </div>
          <span className="font-mono text-[9px]" style={{ color: colors.textMuted }}>
            Soulbound Score NFT · ScoreRegistry #1247 · Updated via Chainlink CRE
          </span>
        </div>
      </div>
    </motion.div>
  );
}
