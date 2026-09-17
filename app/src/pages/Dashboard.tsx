import { useTheme } from '@/contexts/ThemeContext';
import { Bell } from 'lucide-react';
import { SCORE } from '@/lib/protocol';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PageHeader from '@/components/dashboard/PageHeader';
import TierDeck from '@/components/dashboard/TierDeck';
import StatCards from '@/components/dashboard/StatCards';
import {
  BorrowRepayChart,
  CollateralGauge,
  ScoreHistoryChart,
} from '@/components/dashboard/PortfolioCharts';
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

export default function Dashboard() {
  return (
    <DashboardLayout>
        <GreetingHeader />

        <div className="max-w-[1100px] mx-auto px-8 py-8">
          {/* Score tiers, fanned like a card deck — current tier in front. */}
          <TierDeck />
          <ScoreProvenance />

          <StatCards />

          {/* Three panels across, then the full-width statement below. */}
          <div className="grid grid-cols-[1.15fr_1fr_1fr] gap-4 mb-4">
            <BorrowRepayChart />
            <CollateralGauge />
            <ScoreHistoryChart />
          </div>

          <ActivityList />
        </div>
    </DashboardLayout>
  );
}
