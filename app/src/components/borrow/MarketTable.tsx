import { motion } from 'motion/react';
import { ArrowUpRight, Lock } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import TokenIcon from '@/components/TokenIcon';
import {
  formatApr,
  formatCompactUsd,
  formatFullUsd,
  type Market,
} from '@/lib/markets';

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  markets: Market[];
  /** Score of the connected wallet, or null when disconnected. */
  score: number | null;
  /** Opens the borrow flow for this market. Called only when connected. */
  onSelect: (market: Market) => void;
  /** Raised instead of `onSelect` when there is no wallet yet. */
  onRequireWallet: () => void;
}

export default function MarketTable({ markets, score, onSelect, onRequireWallet }: Props) {
  const colors = useTheme();

  return (
    <div
      className="rounded-2xl border shadow-sm overflow-hidden"
      style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}
    >
      {/* Column headers */}
      <div
        className="grid grid-cols-[1.9fr_0.7fr_0.8fr_1fr_1fr_120px] gap-4 px-6 py-3 border-b text-[10px] font-mono uppercase tracking-widest"
        style={{ borderColor: colors.border, color: colors.textMuted }}
      >
        <span>Asset</span>
        <span>Min score</span>
        <span className="text-right">Base APR</span>
        <span className="text-right">Total borrows</span>
        <span className="text-right">Liquidity</span>
        <span />
      </div>

      {markets.map((market, i) => {
        const isSoon = market.status === 'soon';
        const gated = market.minScore > 0;
        // A connected wallet below the gate sees the market but can't open it.
        const blocked = gated && score !== null && score < market.minScore;
        // Not-yet-deployed reserves are inert regardless of wallet state.
        const inert = isSoon || blocked;

        return (
          <motion.div
            key={market.symbol}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3), ease }}
            className="grid grid-cols-[1.9fr_0.7fr_0.8fr_1fr_1fr_120px] gap-4 px-6 py-4 border-b last:border-b-0 items-center transition-colors hover:bg-purple-50/30"
            style={{ borderColor: colors.border, opacity: isSoon ? 0.6 : 1 }}
          >
            {/* Asset */}
            <div className="flex items-center gap-3 min-w-0">
              <TokenIcon symbol={market.symbol} color={market.accent} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-xs font-medium" style={{ color: colors.text }}>
                    {market.symbol}
                  </span>
                  {!isSoon && (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#639922' }} />
                      <span className="font-mono text-[9px]" style={{ color: '#639922' }}>
                        Live
                      </span>
                    </span>
                  )}
                </div>
                <div className="font-mono text-[9px] truncate" style={{ color: colors.textMuted }}>
                  {market.name}
                </div>
              </div>
            </div>

            {/* Score gate */}
            <div className="flex items-center gap-1.5">
              {isSoon ? (
                <span className="font-mono text-[10px]" style={{ color: colors.textMuted }}>—</span>
              ) : gated ? (
                <>
                  <Lock className="w-3 h-3" style={{ color: colors.textMuted }} strokeWidth={1.5} />
                  <span className="font-mono text-[10px]" style={{ color: colors.textSecondary }}>
                    {market.minScore}+
                  </span>
                </>
              ) : (
                <span className="font-mono text-[10px]" style={{ color: colors.textMuted }}>
                  Any
                </span>
              )}
            </div>

            {/* APR — the planned rate is still useful for a reserve that isn't live yet */}
            <div className="text-right">
              <div className="font-mono text-xs tabular-nums" style={{ color: isSoon ? colors.textMuted : colors.text }}>
                {formatApr(market.baseApr)}
              </div>
              {isSoon && (
                <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>
                  target
                </div>
              )}
            </div>

            {/* Total borrows */}
            <div className="text-right">
              {isSoon ? (
                <div className="font-mono text-xs" style={{ color: colors.textMuted }}>—</div>
              ) : (
                <>
                  <div className="font-mono text-xs tabular-nums" style={{ color: colors.text }}>
                    {formatCompactUsd(market.totalBorrows)}
                  </div>
                  <div className="font-mono text-[9px] tabular-nums" style={{ color: colors.textMuted }}>
                    {formatFullUsd(market.totalBorrows)}
                  </div>
                </>
              )}
            </div>

            {/* Liquidity */}
            <div className="text-right">
              {isSoon ? (
                <div className="font-mono text-xs" style={{ color: colors.textMuted }}>—</div>
              ) : (
                <>
                  <div className="font-mono text-xs tabular-nums" style={{ color: colors.text }}>
                    {formatCompactUsd(market.liquidity)}
                  </div>
                  <div className="font-mono text-[9px] tabular-nums" style={{ color: colors.textMuted }}>
                    {formatFullUsd(market.liquidity)}
                  </div>
                </>
              )}
            </div>

            {/* Action */}
            <div className="flex justify-end">
              {isSoon ? (
                <span
                  className="px-3 py-2 rounded-lg font-mono text-[9px] uppercase tracking-widest"
                  style={{ backgroundColor: 'rgba(136,135,128,0.1)', color: colors.textMuted }}
                >
                  Coming soon
                </span>
              ) : (
                <button
                  onClick={() => (score === null ? onRequireWallet() : onSelect(market))}
                  disabled={inert}
                  title={blocked ? `Requires a score of ${market.minScore}` : undefined}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-sans text-xs font-medium transition-all"
                  style={{
                    backgroundColor: blocked ? 'rgba(124,58,237,0.06)' : '#7C3AED',
                    color: blocked ? colors.textMuted : '#FFFFFF',
                    cursor: blocked ? 'not-allowed' : 'pointer',
                  }}
                >
                  Borrow
                  {!blocked && <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={1.5} />}
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
