import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SCORE_SERIES } from '@/lib/portfolio';
import { YIELD_SERIES, type WalletPosition } from '@/lib/position';
import {
  BorrowRepayBody,
  Panel,
  TrendLineBody,
  type TrendThreshold,
} from '@/components/dashboard/PortfolioCharts';

type SeriesKey = 'borrow' | 'score' | 'yield';

interface SeriesOption {
  key: SeriesKey;
  /** Toggle label — short, so three fit on one row. */
  label: string;
}

const SCORE_THRESHOLDS: TrendThreshold[] = [
  { value: 80, label: 'Prime 80', color: '#639922' },
  { value: 65, label: 'Established 65', color: '#7C3AED' },
];

/**
 * One chart, several subjects, rather than three charts competing for the page.
 *
 * Aave does this with a 1D/1W/1M/1Y/All control over a single plot. The same idea applies
 * here: the wallet's history is one story, and which slice of it you want is a toggle, not
 * three separate cards. Each series keeps its natural rendering — borrowing reads as
 * mirrored bars, the score and yield as lines — so the toggle changes the subject without
 * pretending the shapes are interchangeable.
 *
 * The options are built from what the wallet actually has, so a lender-only wallet never
 * sees a Borrowed tab.
 */
export default function PositionChart({ position }: { position: WalletPosition }) {
  const colors = useTheme();

  const options: SeriesOption[] = [];
  if (position.scored) {
    options.push({ key: 'borrow', label: 'Borrowed' });
    options.push({ key: 'score', label: 'Score' });
  }
  if (position.lending) options.push({ key: 'yield', label: 'Yield' });

  const [requested, setRequested] = useState<SeriesKey>(options[0]?.key ?? 'borrow');
  // The wallet state can change under us (the ?state= override), so fall back rather than
  // rendering a series that no longer exists.
  const active = options.some((o) => o.key === requested) ? requested : options[0]?.key;

  if (options.length === 0) return null;

  const toggle = (
    <div
      className="flex items-center gap-0.5 p-0.5 rounded-lg shrink-0"
      style={{ backgroundColor: 'rgba(124,58,237,0.07)' }}
      role="tablist"
      aria-label="Chart series"
    >
      {options.map((option) => {
        const isActive = option.key === active;
        return (
          <button
            key={option.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => setRequested(option.key)}
            className="px-2.5 py-1 rounded-md font-mono text-[9px] uppercase tracking-widest transition-colors"
            style={{
              backgroundColor: isActive ? '#FFFFFF' : 'transparent',
              color: isActive ? '#7C3AED' : colors.textMuted,
              boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.06)' : undefined,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <Panel title="History" right={toggle} delay={0.2}>
      <div className="flex flex-col flex-1 min-h-[440px] justify-center">
        {active === 'borrow' && <BorrowRepayBody />}

        {active === 'score' && (
          <TrendLineBody
            series={SCORE_SERIES}
            yMin={40}
            yMax={100}
            ticks={[40, 60, 80, 100]}
            thresholds={SCORE_THRESHOLDS}
            gradientId="score-fill"
            ariaLabel="Credit score by month"
          />
        )}

        {active === 'yield' && (
          <TrendLineBody
            series={YIELD_SERIES}
            yMin={0}
            yMax={600}
            ticks={[0, 200, 400, 600]}
            gradientId="yield-fill"
            ariaLabel="Accrued yield by month"
          />
        )}
      </div>
    </Panel>
  );
}
