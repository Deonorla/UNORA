import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PageHeader, { StatusNote } from '@/components/dashboard/PageHeader';
import { totalDeposits } from '@/lib/markets';
import { positionDeposited, resolveWalletState } from '@/lib/position';

const ease = [0.22, 1, 0.36, 1] as const;

interface DepositReserve {
  symbol: string;
  name: string;
  /** Display APY, already formatted. */
  apy: string;
  /** Numeric APY, so the headline average can be weighted. */
  apyValue: number;
  apyTrend: 'up' | 'down' | 'stable';
  /** Deposits held, in USDC. `0` for reserves that aren't deployed. */
  poolSize: number;
  ltv: string;
  color: string;
  status: 'live' | 'soon';
}

/**
 * Deposit reserves. Only USDC is deployed on Monad testnet — the rest are roadmap and
 * carry no liquidity, so they are listed but not depositable.
 *
 * USDC's size comes from `totalDeposits()` in `lib/markets` rather than a literal, so this
 * page and the borrow page can't quote different numbers for the same pool.
 */
const reserves: DepositReserve[] = [
  { symbol: 'USDC', name: 'USD Coin',        apy: '5.80%', apyValue: 0.058, apyTrend: 'up',     poolSize: totalDeposits(), ltv: '80%', color: '#2775CA', status: 'live' },
  { symbol: 'MON',  name: 'Monad',           apy: '4.20%', apyValue: 0.042, apyTrend: 'stable', poolSize: 0,               ltv: '75%', color: '#6E54FF', status: 'soon' },
  { symbol: 'USDT', name: 'Tether USD',      apy: '5.60%', apyValue: 0.056, apyTrend: 'stable', poolSize: 0,               ltv: '80%', color: '#26A17B', status: 'soon' },
  { symbol: 'WETH', name: 'Wrapped Ether',   apy: '3.10%', apyValue: 0.031, apyTrend: 'down',   poolSize: 0,               ltv: '70%', color: '#627EEA', status: 'soon' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', apy: '2.40%', apyValue: 0.024, apyTrend: 'stable', poolSize: 0,               ltv: '65%', color: '#F09242', status: 'soon' },
];

const liveReserves = reserves.filter((r) => r.status === 'live');
const soonCount = reserves.length - liveReserves.length;

function formatUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value.toFixed(2)}`;
}

function AssetIcon({ symbol, color }: { symbol: string; color: string }) {
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-[11px] font-medium"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {symbol.charAt(0).toUpperCase()}
    </div>
  );
}

function ApyBadge({ apy, trend, muted }: { apy: string; trend: string; muted?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-mono text-sm" style={{ color: muted ? '#888780' : '#639922' }}>
        {apy}
      </span>
      {!muted && trend === 'up' && <span className="font-mono text-[10px]" style={{ color: '#639922' }}>↑</span>}
      {!muted && trend === 'down' && <span className="font-mono text-[10px]" style={{ color: '#BA7517' }}>↓</span>}
    </div>
  );
}

export default function LendPage() {
  const colors = useTheme();
  const { search } = useLocation();

  // Weighted by size, and only across deployed reserves — an undeployed pool has no yield.
  const liveSize = liveReserves.reduce((sum, r) => sum + r.poolSize, 0);
  const weightedApy = liveReserves.reduce((sum, r) => sum + r.apyValue * r.poolSize, 0) / (liveSize || 1);

  // The wallet's own deposit, read from the same position the dashboard renders so the
  // two pages can't disagree about how much is supplied. Exact figures here, not the
  // compact "$4K" — this is the number a depositor checks.
  const { position } = resolveWalletState(search);
  const deposited = position.lending ? positionDeposited(position.lending) : 0;
  const balanceLabel =
    deposited > 0
      ? `$${deposited.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '$0.00';

  return (
    <DashboardLayout>
        <PageHeader
          title="Deposit"
          subtitle="Supply assets to Unora pools and earn yield. Your deposits fund borrower credit lines backed by onchain reputation."
          note={<StatusNote>USDC live on Monad testnet · {soonCount} reserves rolling out</StatusNote>}
        />

        <div className="max-w-[1100px] mx-auto px-8 py-8">
          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            <div className="p-4 rounded-2xl border shadow-sm" style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>Total pool value</div>
              <div className="font-serif text-xl font-semibold tabular-nums" style={{ color: colors.text }}>{formatUsd(liveSize)}</div>
            </div>
            <div className="p-4 rounded-2xl border shadow-sm" style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>Average APY</div>
              <div className="font-serif text-xl font-semibold tabular-nums" style={{ color: '#639922' }}>
                {(weightedApy * 100).toFixed(2)}%
              </div>
            </div>
            <div className="p-4 rounded-2xl border shadow-sm" style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}>
              <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: colors.textMuted }}>Your deposits</div>
              <div className="font-serif text-xl font-semibold tabular-nums" style={{ color: colors.text }}>{balanceLabel}</div>
            </div>
          </motion.div>

          {/* Asset table */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="rounded-2xl border shadow-sm overflow-hidden"
            style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}
          >
            {/* Table header */}
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-4 px-6 py-3 border-b text-[10px] font-mono uppercase tracking-widest"
              style={{ borderColor: colors.border, color: colors.textMuted }}
            >
              <span>Asset</span>
              <span>APY</span>
              <span className="text-right">Pool size</span>
              <span className="text-right">Your balance</span>
              <span className="text-right">Collateral</span>
              <span></span>
            </div>

            {/* Asset rows */}
            {reserves.map((reserve, i) => {
              const isSoon = reserve.status === 'soon';
              return (
                <motion.div
                  key={reserve.symbol}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease }}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-4 px-6 py-4 border-b last:border-b-0 items-center transition-colors hover:bg-purple-50/30"
                  style={{ borderColor: colors.border, opacity: isSoon ? 0.6 : 1 }}
                >
                  {/* Asset */}
                  <div className="flex items-center gap-3 min-w-0">
                    <AssetIcon symbol={reserve.symbol} color={reserve.color} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-xs font-medium" style={{ color: colors.text }}>
                          {reserve.symbol}
                        </span>
                        {!isSoon && (
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#639922' }} />
                            <span className="font-mono text-[9px]" style={{ color: '#639922' }}>Live</span>
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[9px] truncate" style={{ color: colors.textMuted }}>{reserve.name}</div>
                    </div>
                  </div>

                  {/* APY */}
                  <div>
                    <ApyBadge apy={reserve.apy} trend={reserve.apyTrend} muted={isSoon} />
                    {isSoon && (
                      <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>target</div>
                    )}
                  </div>

                  {/* Pool size */}
                  <div className="text-right">
                    {isSoon ? (
                      <span className="font-mono text-xs" style={{ color: colors.textMuted }}>—</span>
                    ) : (
                      <span className="font-mono text-xs tabular-nums" style={{ color: colors.text }}>
                        {formatUsd(reserve.poolSize)}
                      </span>
                    )}
                  </div>

                  {/* Your balance — USDC is the only live reserve, so it carries the position. */}
                  <div className="text-right">
                    <span
                      className="font-mono text-xs tabular-nums"
                      style={{ color: deposited > 0 && !isSoon ? colors.text : colors.textMuted }}
                    >
                      {isSoon ? '—' : balanceLabel}
                    </span>
                  </div>

                  {/* Collateral factor */}
                  <div className="flex items-center justify-end gap-2">
                    {isSoon ? (
                      <span className="font-mono text-xs" style={{ color: colors.textMuted }}>—</span>
                    ) : (
                      <>
                        <span className="font-mono text-xs tabular-nums" style={{ color: colors.text }}>{reserve.ltv}</span>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#639922' }} />
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
                        className="px-4 py-2 rounded-lg font-sans text-xs font-medium transition-all hover:opacity-90"
                        style={{ backgroundColor: '#7C3AED', color: '#FFFFFF' }}
                      >
                        Deposit
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
    </DashboardLayout>
  );
}
