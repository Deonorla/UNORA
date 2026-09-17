import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Bell } from 'lucide-react';
import { SCORE } from '@/lib/protocol';
import {
  ALLOCATION,
  SCORE_SERIES,
  STAT_CARDS,
  allocationTotal,
  formatCompact,
} from '@/lib/portfolio';
import { resolveWalletState } from '@/lib/position';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PageHeader from '@/components/dashboard/PageHeader';
import TierDeck from '@/components/dashboard/TierDeck';
import StatCards from '@/components/dashboard/StatCards';
import {
  AllocationDonut,
  BorrowRepayChart,
  TrendLineChart,
} from '@/components/dashboard/PortfolioCharts';
import LendingSection from '@/components/dashboard/LendingSection';
import EmptyWalletState from '@/components/dashboard/EmptyWalletState';
import ActivityList from '@/components/dashboard/ActivityList';

function GreetingHeader() {
  const colors = useTheme();

  return (
    <PageHeader
      dense
      title="Good Morning, Alvie"
      subtitle={new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    >
      <button
        aria-label="Notifications"
        className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm transition-colors hover:bg-white"
        style={{ borderColor: colors.border }}
      >
        <Bell className="w-4 h-4" style={{ color: colors.textMuted }} strokeWidth={1.5} />
      </button>
    </PageHeader>
  );
}

/** Single-line provenance for the score — replaces the old hero card's fine print. */
function ScoreProvenance() {
  const colors = useTheme();
  const facts = [
    `ScoreRegistry #${SCORE.nftId} · soulbound`,
    `Repayment ${Math.round(SCORE.repaymentRate * 100)}%`,
    `${SCORE.historyMonths} mo history`,
    `${SCORE.liquidations} liquidations`,
    'Updated via Chainlink CRE',
  ];

  return (
    <div className="flex items-center justify-center gap-2.5 flex-wrap -mt-1 mb-5">
      {facts.map((fact, i) => (
        <span key={fact} className="flex items-center gap-2.5">
          {i > 0 && <span style={{ color: colors.textMuted }}>·</span>}
          <span className="font-mono text-[9px]" style={{ color: colors.textMuted }}>
            {fact}
          </span>
        </span>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  const colors = useTheme();
  return (
    <div
      className="font-mono text-[9px] uppercase tracking-widest mb-3"
      style={{ color: colors.textMuted }}
    >
      {children}
    </div>
  );
}

/**
 * The dashboard adapts to what the wallet actually has:
 *
 *   scored            -> the borrower half (score, tiers, ceiling, borrow history)
 *   active deposit    -> the lender half (position, pool health, yield)
 *   both              -> stacked, each under its own label
 *   neither           -> the empty state
 *
 * `?state=` overrides the mock position so each branch can be seen without a wallet:
 * `new`, `borrower`, `lender`, `lender-multi`, `both`, `both-multi`.
 */
export default function Dashboard() {
  const { search } = useLocation();
  const { position } = useMemo(() => resolveWalletState(search), [search]);

  const hasBorrower = position.scored;
  const lending = position.lending;
  const hasLending = lending !== null;
  const stacked = hasBorrower && hasLending;

  return (
    <DashboardLayout>
      <GreetingHeader />

      <div className="max-w-[1100px] mx-auto px-8 py-8">
        {!hasBorrower && !hasLending && <EmptyWalletState />}

        {hasBorrower && (
          <div className={stacked ? 'mb-8' : ''}>
            {stacked && <SectionLabel>Borrowing</SectionLabel>}

            <TierDeck />
            <ScoreProvenance />

            <StatCards cards={STAT_CARDS} />

            {/* Three panels across, then the full-width statement below. */}
            <div className="grid grid-cols-[1.15fr_1fr_1fr] gap-4 mt-4">
              <BorrowRepayChart />
              <AllocationDonut
                title="Capital allocation"
                meta={formatCompact(allocationTotal())}
                delay={0.3}
                slices={ALLOCATION}
                centerLabel="Total"
                ariaLabel="Where the wallet's USDC sits"
              />
              <TrendLineChart
                title="Score history"
                meta="+14 pts"
                delay={0.35}
                series={SCORE_SERIES}
                yMin={40}
                yMax={100}
                ticks={[40, 60, 80, 100]}
                thresholds={[
                  { value: 80, label: 'Prime 80', color: '#639922' },
                  { value: 65, label: 'Established 65', color: '#7C3AED' },
                ]}
                gradientId="score-fill"
                ariaLabel="Credit score by month"
              />
            </div>
          </div>
        )}

        {lending && (
          <div>
            {stacked && <SectionLabel>Lending</SectionLabel>}
            <LendingSection lending={lending} />
          </div>
        )}

        {(hasBorrower || hasLending) && (
          <div className="mt-4">
            <ActivityList />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
