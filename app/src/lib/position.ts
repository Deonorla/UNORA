/**
 * Wallet position — MOCK.
 *
 * Two independent things a wallet can have:
 *   - a `ScoreRegistry` NFT (it has been scored, and can borrow)
 *   - a `LendingPool` deposit (it is a lender, and earns yield)
 *
 * They are not mutually exclusive, so the dashboard renders each section on its own
 * merits and stacks them when both are present. Nothing here is wired to a contract yet.
 *
 * In production this becomes `ScoreRegistry.getScore()` and a `LendingPool` position
 * read. The `?state=` override below exists so the four states can be demoed and tested
 * without redeploying anything.
 */

import { MARKETS, POOLS, type PoolId } from '@/lib/markets';

export interface PoolHolding {
  pool: PoolId;
  /** Principal still in the tranche. */
  deposited: number;
  /** Current value, i.e. principal plus accrued yield. */
  value: number;
  apy: number;
}

export interface LendingPosition {
  holdings: PoolHolding[];
  /** Yield accrued to date across every tranche. */
  accruedYield: number;
  /** Yield earned in the last 30 days — drives the trend indicator. */
  yieldLast30d: number;
  health: { utilization: number; reserveBuffer: number };
}

export interface WalletPosition {
  /** True when the wallet holds a soulbound score and can borrow. */
  scored: boolean;
  /** Null when there is no active deposit. */
  lending: LendingPosition | null;
}

/**
 * Cumulative yield by month, oldest first. Ends on `accruedYield` so the chart and the
 * card cannot disagree.
 */
export const YIELD_SERIES = [18, 39, 61, 84, 106, 129, 152, 178.5];

/** Cumulative deposit balance by month — the wallet topped the position up twice. */
export const DEPOSITED_SERIES = [0, 1_000, 1_000, 2_500, 2_500, 4_250, 4_250, 4_250];

/**
 * Blended APY by month. The final point is replaced with the live blended figure at
 * render time, so the sparkline can't drift away from the number above it.
 */
export const APY_SERIES = [4.1, 4.2, 4.35, 4.5, 4.42, 4.55, 4.61];

const TOTAL_YIELD = YIELD_SERIES[YIELD_SERIES.length - 1];
const YIELD_LAST_30D = TOTAL_YIELD - YIELD_SERIES[YIELD_SERIES.length - 2];

/**
 * Pool health per tranche.
 *
 * In production these come from `LendingPool.getReserveData()`: utilization is
 * outstanding principal over total deposits, and the reserve buffer is the undrawn share
 * that a withdrawal would be paid from. Mocked rather than derived from `lib/markets`
 * because a tranche can hold deposits before its borrow markets open, and a derived
 * figure would divide by zero there.
 */
const POOL_HEALTH: Record<PoolId, { utilization: number; reserveBuffer: number }> = {
  main: { utilization: 0.3, reserveBuffer: 0.7 },
  bluechip: { utilization: 0.22, reserveBuffer: 0.78 },
  sponsored: { utilization: 0.41, reserveBuffer: 0.59 },
};

/**
 * Deposits are tranches of the same USDC market — a risk tier you choose, not a
 * different asset — so holding several is consistent with USDC being the only deployed
 * reserve.
 */
function makeLending(holdings: PoolHolding[]): LendingPosition {
  const value = holdings.reduce((sum, h) => sum + h.value, 0);
  const deposited = holdings.reduce((sum, h) => sum + h.deposited, 0);

  // Utilization is reported per tranche; weight it by holding so the headline figure
  // reflects where the money actually is.
  const utilization =
    value > 0
      ? holdings.reduce((sum, h) => sum + POOL_HEALTH[h.pool].utilization * h.value, 0) / value
      : 0;

  return {
    holdings,
    accruedYield: value - deposited,
    yieldLast30d: YIELD_LAST_30D,
    health: { utilization, reserveBuffer: 1 - utilization },
  };
}

const SINGLE_POOL: PoolHolding[] = [
  { pool: 'main', deposited: 4_250, value: 4_428.5, apy: 0.042 },
];

const MULTI_POOL: PoolHolding[] = [
  { pool: 'main', deposited: 3_000, value: 3_126, apy: 0.042 },
  { pool: 'bluechip', deposited: 1_250, value: 1_302.5, apy: 0.058 },
];

/** Named wallet states, so the conditional rendering can be exercised end to end. */
export const WALLET_STATES = {
  /** Brand new wallet: no score, no deposit. */
  new: { scored: false, lending: null },
  /** Has been scored but has never deposited. */
  borrower: { scored: true, lending: null },
  /** Lends only — has never borrowed. */
  lender: { scored: false, lending: makeLending(SINGLE_POOL) },
  /** Lends across more than one tranche, which is what reveals the pool donut. */
  'lender-multi': { scored: false, lending: makeLending(MULTI_POOL) },
  /** Has done both — the two sections stack. */
  both: { scored: true, lending: makeLending(SINGLE_POOL) },
  'both-multi': { scored: true, lending: makeLending(MULTI_POOL) },
} satisfies Record<string, WalletPosition>;

export type WalletStateKey = keyof typeof WALLET_STATES;

export const DEFAULT_WALLET_STATE: WalletStateKey = 'both-multi';

/** Reads `?state=` off the URL, falling back to the default. */
export function resolveWalletState(search: string): { key: WalletStateKey; position: WalletPosition } {
  const requested = new URLSearchParams(search).get('state');
  const key = (requested && requested in WALLET_STATES ? requested : DEFAULT_WALLET_STATE) as WalletStateKey;
  return { key, position: WALLET_STATES[key] };
}

/** Weighted APY across tranches — what the position is actually earning. */
export function blendedApy(lending: LendingPosition): number {
  const value = lending.holdings.reduce((sum, h) => sum + h.value, 0);
  if (value === 0) return 0;
  return lending.holdings.reduce((sum, h) => sum + h.apy * h.value, 0) / value;
}

/** Total principal plus accrued yield. */
export function positionValue(lending: LendingPosition): number {
  return lending.holdings.reduce((sum, h) => sum + h.value, 0);
}

/** Total principal deposited. */
export function positionDeposited(lending: LendingPosition): number {
  return lending.holdings.reduce((sum, h) => sum + h.deposited, 0);
}

export function poolName(pool: PoolId): string {
  return POOLS.find((p) => p.id === pool)?.name ?? pool;
}

/**
 * Undrawn liquidity in a tranche's live markets. Used for the "can I withdraw now"
 * note — a withdrawal is limited by what the pool has on hand, not by its deposits.
 */
export function poolLiquidity(pool: PoolId): number {
  return MARKETS.filter((m) => m.pool === pool && m.status === 'live').reduce(
    (sum, m) => sum + m.liquidity,
    0,
  );
}
