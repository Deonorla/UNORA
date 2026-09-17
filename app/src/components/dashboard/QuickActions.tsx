import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

export default function QuickActions() {
  const colors = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35, ease }}
      className="rounded-2xl bg-white border border-white/50 shadow-[0_8px_40px_rgba(124,58,237,0.06)] p-6"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] block mb-4" style={{ color: colors.textMuted }}>
        Quick Actions
      </span>

      <div className="space-y-3">
        <a
          href="#"
          className="flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-md"
          style={{ backgroundColor: '#7C3AED', color: 'white' }}
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <span className="text-sm">↗</span>
          </div>
          <div>
            <div className="font-sans text-sm font-medium">Request Loan</div>
            <div className="font-mono text-[9px] opacity-70">Up to $12,400</div>
          </div>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center" style={{ color: '#7C3AED' }}>
            <span className="text-sm">↙</span>
          </div>
          <div>
            <div className="font-sans text-sm font-medium" style={{ color: colors.text }}>Deposit</div>
            <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>Earn 4.2% APY</div>
          </div>
        </a>

        <a
          href="#"
          className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center" style={{ color: '#7C3AED' }}>
            <span className="text-sm">🤝</span>
          </div>
          <div>
            <div className="font-sans text-sm font-medium" style={{ color: colors.text }}>Sponsor Someone</div>
            <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>Delegate capacity</div>
          </div>
        </a>
      </div>

      {/* Pool stats */}
      <div className="mt-5 pt-5 border-t border-purple-100">
        <div className="font-mono text-[8px] uppercase tracking-widest mb-3" style={{ color: colors.textMuted }}>
          Pool Stats
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-lg bg-purple-50/50">
            <div className="font-mono text-[7px] uppercase tracking-widest" style={{ color: colors.textMuted }}>TVL</div>
            <div className="font-serif text-sm font-semibold" style={{ color: colors.text }}>$0</div>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-50/50">
            <div className="font-mono text-[7px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Utilization</div>
            <div className="font-serif text-sm font-semibold" style={{ color: colors.text }}>-</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
