import { useTheme } from '@/contexts/ThemeContext';
import { ArrowUpRight, ArrowDownLeft, Handshake, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SCORE } from '@/lib/protocol';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import PageHeader from '@/components/dashboard/PageHeader';
import TierDeck from '@/components/dashboard/TierDeck';
import StatCards from '@/components/dashboard/StatCards';
import {
  BorrowRepayChart,
  CollateralGauge,
  ScoreHistoryChart,
} from '@/components/dashboard/PortfolioCharts';
import ActivityList from '@/components/dashboard/ActivityList';

const QUICK_ACTIONS = [
  { label: 'Borrow', to: '/borrow', Icon: ArrowUpRight },
  { label: 'Deposit', to: '/lend', Icon: ArrowDownLeft },
  { label: 'Sponsor', to: '/sponsor/graph', Icon: Handshake },
];

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
      {QUICK_ACTIONS.map(({ label, to, Icon }) => (
        <Link
          key={label}
          to={to}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-sans transition-colors hover:bg-white shadow-sm"
          style={{ borderColor: colors.border, color: colors.text }}
        >
          <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
          {label}
        </Link>
      ))}
      <div className="w-px h-6" style={{ backgroundColor: colors.border }} />
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
    <div className="min-h-screen" style={{ backgroundColor: '#F8F5F2' }}>
      <DashboardSidebar />

      <main className="ml-60 min-h-screen">
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
      </main>
    </div>
  );
}
