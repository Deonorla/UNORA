import { useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';
import StatCards from '@/components/dashboard/StatCards';
import { AllocationDonut, TrendLineChart } from '@/components/dashboard/PortfolioCharts';
import {
  APY_SERIES,
  DEPOSITED_SERIES,
  blendedApy,
  poolName,
  positionDeposited,
  positionValue,
  YIELD_SERIES,
  type LendingPosition,
} from '@/lib/position';
import type { PoolId } from '@/lib/markets';
import type { StatCard } from '@/lib/portfolio';

const ease = [0.22, 1, 0.36, 1] as const;

const POOL_COLORS: Record<PoolId, string> = {
  main: '#7C3AED',
  bluechip: '#639922',
  sponsored: '#BA7517',
};

function formatUsd(value: number, digits = 0): string {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

function formatPct(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

/** Headline figures for the lender row. Same shape as the borrower cards. */
function lendingCards(lending: LendingPosition): StatCard[] {
  const deposited = positionDeposited(lending);
  const apy = blendedApy(lending);
  const single = lending.holdings.length === 1 ? lending.holdings[0] : null;

  return [
    {
      label: 'Deposited',
      value: formatUsd(deposited),
      delta: `${lending.holdings.length} ${lending.holdings.length === 1 ? 'pool' : 'pools'}`,
      tone: 'neutral',
      series: DEPOSITED_SERIES,
    },
    {
      label: 'Current APY',
      value: formatPct(apy, 2),
      delta: 'variable',
      tone: 'good',
      // Last point is the live figure, so the sparkline can't drift from the number.
      series: [...APY_SERIES, apy * 100],
    },
    {
      label: 'Accrued yield',
      value: formatUsd(lending.accruedYield, 2),
      delta: `+${formatUsd(lending.yieldLast30d, 2)} / 30d`,
      tone: 'good',
      series: YIELD_SERIES,
    },
    {
      label: single ? 'Pool' : 'Pools',
      value: single ? poolName(single.pool) : String(lending.holdings.length),
      delta: single ? `${formatPct(single.apy, 2)} APY` : 'weighted APY',
      tone: 'neutral',
      // No sparkline — which pool you're in has no shape over time.
    },
  ];
}

/* -------------------------------------------------------------------------- */

/**
 * Pool health plus the withdraw action.
 *
 * Utilization and reserve buffer are the same number from two sides — they sum to 100% —
 * but lenders look for both, so both are shown. Utilization is the risk figure: the
 * higher it is, the more of the pool is out on loan when a withdrawal lands.
 */
function PoolHealthCard({ lending }: { lending: LendingPosition }) {
  const colors = useTheme();
  const [confirming, setConfirming] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const value = positionValue(lending);
  const { utilization, reserveBuffer } = lending.health;

  // Utilization is weighted across holdings, so name the pool only when there is one.
  const label =
    lending.holdings.length === 1 ? poolName(lending.holdings[0].pool) : `${lending.holdings.length} pools`;

  const meters = [
    {
      label: 'Reserve buffer',
      value: reserveBuffer,
      color: '#639922',
      hint: 'undrawn and available',
    },
    {
      label: 'Utilization',
      value: utilization,
      color: utilization > 0.85 ? '#BA7517' : '#7C3AED',
      hint: 'out on loan',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease }}
      className="rounded-2xl border shadow-sm p-5 flex flex-col h-full"
      style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="font-sans text-xs font-medium" style={{ color: colors.text }}>
          Pool health
        </span>
        <span
          className="font-mono text-[9px] px-2 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(124,58,237,0.07)', color: '#7C3AED' }}
        >
          {label}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-5">
        {meters.map((meter) => (
          <div key={meter.label}>
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
                {meter.label}
              </span>
              <span className="font-serif text-lg font-semibold tabular-nums" style={{ color: colors.text }}>
                {Math.round(meter.value * 100)}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: meter.color }}
                initial={{ width: 0 }}
                animate={{ width: `${meter.value * 100}%` }}
                transition={{ duration: 0.8, delay: 0.4, ease }}
              />
            </div>
            <div className="font-mono text-[9px] mt-1.5" style={{ color: colors.textMuted }}>
              {meter.hint}
            </div>
          </div>
        ))}
      </div>

      {/* Withdraw */}
      <div className="pt-5">
        {withdrawn ? (
          <div
            className="p-3 rounded-xl text-center font-sans text-xs"
            style={{ backgroundColor: 'rgba(99,153,34,0.08)', color: '#4F7A1B' }}
          >
            Withdrawal of {formatUsd(value, 2)} submitted
          </div>
        ) : confirming ? (
          <div className="space-y-2">
            <div className="font-sans text-xs text-center" style={{ color: colors.textSecondary }}>
              Withdraw all {formatUsd(value, 2)}?
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border font-sans text-xs font-medium transition-colors hover:bg-white"
                style={{ borderColor: colors.border, color: colors.textSecondary }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setWithdrawn(true);
                  setConfirming(false);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl font-sans text-xs font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: '#7C3AED', color: '#FFFFFF' }}
              >
                Confirm
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="w-full px-5 py-3 rounded-xl font-sans text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#7C3AED', color: '#FFFFFF' }}
          >
            Withdraw
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The lender half of the dashboard. Renders only when there is an active deposit —
 * see `Dashboard`, which decides that.
 *
 * Reuses the borrower charts rather than introducing new ones: `TrendLineChart` for the
 * yield curve and `AllocationDonut` for the tranche split, the latter only when there is
 * more than one tranche to split.
 */
export default function LendingSection({ lending }: { lending: LendingPosition }) {
  const multiPool = lending.holdings.length > 1;

  const poolSlices = lending.holdings.map((holding) => ({
    label: poolName(holding.pool),
    hint: `${formatUsd(holding.deposited)} deposited · ${formatPct(holding.apy, 2)} APY`,
    value: holding.value,
    color: POOL_COLORS[holding.pool],
  }));

  return (
    <div className="space-y-4">
      <StatCards cards={lendingCards(lending)} />

      <div className={`grid gap-4 ${multiPool ? 'grid-cols-[1.15fr_1fr_1fr]' : 'grid-cols-[1.15fr_1fr]'}`}>
        <PoolHealthCard lending={lending} />

        <TrendLineChart
          title="Yield history"
          meta="+14.7%"
          delay={0.3}
          series={YIELD_SERIES}
          yMin={0}
          yMax={200}
          ticks={[0, 50, 100, 150, 200]}
          gradientId="yield-fill"
          ariaLabel="Accrued yield by month"
        />

        {multiPool && (
          <AllocationDonut
            title="Capital allocation across pools"
            meta={formatUsd(positionValue(lending))}
            delay={0.35}
            slices={poolSlices}
            centerLabel="Deposited"
            formatCenter={(total) => formatUsd(total)}
            ariaLabel="Deposited capital split across lending pools"
          />
        )}
      </div>
    </div>
  );
}
