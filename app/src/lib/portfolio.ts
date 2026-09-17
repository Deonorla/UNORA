/**
 * Dashboard series data — MOCK.
 *
 * Time series and derived aggregates for the dashboard. Kept out of the components so
 * swapping in real data is a single-file change: these become `StreamManager` event
 * aggregations and `ScoreRegistry` history reads.
 *
 * Convention: `MONTHS` runs oldest -> newest, and every series is the same length.
 */

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] as const;

/** Principal drawn per month. */
export const BORROWED_SERIES = [3_000, 4_500, 2_000, 6_000, 3_500, 5_000, 2_500, 5_000];

/** Principal repaid per month. Always trails borrowing — that's the point of the score. */
export const REPAID_SERIES = [2_800, 4_100, 2_200, 5_200, 3_300, 4_600, 2_400, 4_800];

/** Credit score at each month end. */
export const SCORE_SERIES = [58, 61, 63, 66, 68, 70, 71, 72];

/** Loan ceiling, which the score drives. */
export const CEILING_SERIES = [7_400, 8_600, 9_400, 10_300, 11_000, 11_600, 12_000, 12_400];

/** Collateral ratio — falling is good, because the score is doing the work. */
export const RATIO_SERIES = [0.52, 0.49, 0.46, 0.43, 0.41, 0.38, 0.36, 0.35];

/** Yield credited to the wallet per month. */
export const YIELD_SERIES = [24, 48, 66, 82, 99, 118, 143, 178];

export const MONTHLY = {
  borrowed: BORROWED_SERIES,
  repaid: REPAID_SERIES,
  score: SCORE_SERIES,
  ceiling: CEILING_SERIES,
  ratio: RATIO_SERIES,
  yield: YIELD_SERIES,
};

export interface AllocationSlice {
  label: string;
  hint: string;
  value: number;
  color: string;
}

/**
 * Where the wallet's USDC actually sits. All three are the same asset, so the
 * percentages are directly comparable.
 */
export const ALLOCATION: AllocationSlice[] = [
  { label: 'Locked collateral', hint: 'backing the open loan', value: 1_750, color: '#7C3AED' },
  { label: 'Idle balance', hint: 'unencumbered', value: 2_500, color: '#A78BFA' },
  { label: 'Delegated out', hint: 'sponsoring 3 wallets', value: 6_500, color: '#639922' },
];

export function allocationTotal(): number {
  return ALLOCATION.reduce((sum, slice) => sum + slice.value, 0);
}

/** Headline figures for the stat cards, each with its own sparkline. */
export interface StatCard {
  label: string;
  value: string;
  delta: string;
  /** Direction of the delta, from the wallet's point of view. */
  tone: 'good' | 'warn' | 'neutral';
  series: number[];
}

export const STAT_CARDS: StatCard[] = [
  {
    label: 'Credit score',
    value: '72',
    delta: '+4 pts',
    tone: 'good',
    series: SCORE_SERIES,
  },
  {
    label: 'Collateral ratio',
    value: '35%',
    delta: '−17 pp',
    tone: 'good',
    series: RATIO_SERIES,
  },
  {
    label: 'Loan ceiling',
    value: '$12,400',
    delta: '+$2,100',
    tone: 'good',
    series: CEILING_SERIES,
  },
  {
    label: 'Outstanding debt',
    value: '$5,000',
    delta: 'streaming',
    tone: 'neutral',
    series: BORROWED_SERIES,
  },
];

/**
 * The tier ladder the score climbs. Mirrors `TIERS` in `lib/sponsorNetwork` so the
 * dashboard and the sponsor graph agree on what a score band is called.
 */
export interface TierRung {
  name: string;
  minScore: number;
  ratio: string;
  ceiling: string;
  color: string;
  fill: string;
  /** True for the rung the wallet currently sits on. */
  current?: boolean;
  /** True for rungs not yet unlocked. */
  locked?: boolean;
}

export const TIER_LADDER: TierRung[] = [
  {
    name: 'Prime',
    minScore: 80,
    ratio: '20%',
    ceiling: '$25,000',
    color: '#639922',
    fill: '#E3E8D5',
    locked: true,
  },
  {
    name: 'Established',
    minScore: 65,
    ratio: '35%',
    ceiling: '$12,400',
    color: '#7C3AED',
    fill: '#E7DBF1',
    current: true,
  },
  {
    name: 'Building',
    minScore: 50,
    ratio: '55%',
    ceiling: '$6,200',
    color: '#BA7517',
    fill: '#EFE3D3',
    locked: true,
  },
];

/** Compact money formatting — `$12.4K`. */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value}`;
}
