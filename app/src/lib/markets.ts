/**
 * Borrow markets — MOCK DATA.
 *
 * Mirrors what `LendingPool` would expose per reserve: the asset, the pool it sits in,
 * its utilisation-derived APR, total outstanding principal, and available liquidity.
 *
 * Replace with a `LendingPool.getReserveData()` read (or an Envio indexer query) when
 * the backend lands. Keep the shape — components depend on it, not on the numbers.
 */

export type PoolId = 'main' | 'bluechip' | 'sponsored';

export interface Pool {
  id: PoolId;
  name: string;
  /** One-line explanation of who the pool is for. */
  description: string;
  /** Risk framing, shown under the pool name. */
  riskNote: string;
}

export const POOLS: Pool[] = [
  {
    id: 'main',
    name: 'General',
    description: 'Borrow against the widest range of assets in one general-purpose market.',
    riskNote: 'Open to every scored wallet. Collateral priced from your credit history.',
  },
  {
    id: 'bluechip',
    name: 'Bluechip',
    description: 'Lower rates on the deepest, most liquid collateral assets.',
    riskNote: 'Requires a score of 60 or above. Tighter risk limits, cheaper debt.',
  },
  {
    id: 'sponsored',
    name: 'Sponsored',
    description: 'Debt backed by capacity a sponsor has delegated to your wallet.',
    riskNote: 'Requires an active sponsor. Their capacity is slashed if you default.',
  },
];

export interface Market {
  /** Ticker, e.g. USDC. */
  symbol: string;
  name: string;
  pool: PoolId;
  /**
   * `live` reserves can be borrowed against today. `soon` reserves are visible so the
   * roadmap is legible, but the pool holds no liquidity for them yet — on Monad testnet
   * only USDC is deployed.
   */
  status: 'live' | 'soon';
  /** Interest rate before any score discount, as a decimal. */
  baseApr: number;
  /** Outstanding principal across the pool. */
  totalBorrows: number;
  /** Undrawn deposits available to borrow right now. */
  liquidity: number;
  /** Lowest credit score this market will lend to. */
  minScore: number;
  /** Hex for the asset badge. Kept muted — this is a data table, not a logo wall. */
  accent: string;
}

export const MARKETS: Market[] = [
  { symbol: 'USDC',   name: 'USD Coin',         pool: 'main',      status: 'live', baseApr: 0.042, totalBorrows: 1_240_000, liquidity: 480_000, minScore: 0,  accent: '#2775CA' },
  { symbol: 'USDT',   name: 'Tether USD',       pool: 'main',      status: 'soon', baseApr: 0.046, totalBorrows: 0, liquidity: 0, minScore: 0,  accent: '#26A17B' },
  { symbol: 'MON',    name: 'Monad',            pool: 'main',      status: 'soon', baseApr: 0.034, totalBorrows: 0, liquidity: 0, minScore: 0,  accent: '#6E54FF' },
  { symbol: 'WETH',   name: 'Wrapped Ether',    pool: 'main',      status: 'soon', baseApr: 0.039, totalBorrows: 0, liquidity: 0, minScore: 0,  accent: '#627EEA' },
  { symbol: 'WBTC',   name: 'Wrapped Bitcoin',  pool: 'bluechip',  status: 'soon', baseApr: 0.031, totalBorrows: 0, liquidity: 0, minScore: 60, accent: '#F09242' },
  { symbol: 'wstETH', name: 'Wrapped stETH',    pool: 'bluechip',  status: 'soon', baseApr: 0.036, totalBorrows: 0, liquidity: 0, minScore: 60, accent: '#00A3FF' },
  { symbol: 'sUSDC',  name: 'Staked USDC',      pool: 'sponsored', status: 'soon', baseApr: 0.028, totalBorrows: 0, liquidity: 0, minScore: 50, accent: '#7C3AED' },
];

/** Reserves that are actually deployed. Everything else is roadmap. */
export function liveMarkets(): Market[] {
  return MARKETS.filter((m) => m.status === 'live');
}

/**
 * Share of borrow interest the protocol keeps before paying suppliers. The rest funds the
 * reserve that absorbs defaults.
 */
export const RESERVE_FACTOR = 0.1;

/** Outstanding principal as a share of total deposits. */
export function utilizationOf(market: Market): number {
  const deposits = market.totalBorrows + market.liquidity;
  return deposits === 0 ? 0 : market.totalBorrows / deposits;
}

/**
 * What a supplier actually earns.
 *
 * A supplier cannot earn the headline borrow rate — only the borrowed portion of the pool
 * generates interest at all, and the protocol takes its cut first. So:
 *
 *     supplyApy = borrowApr x utilization x (1 - reserveFactor)
 *
 * Deriving it rather than listing it separately is what keeps the borrow page's APR and
 * the deposit page's APY from drifting apart. At USDC's 72% utilization that is roughly
 * 2.7% against a 4.2% borrow rate.
 */
export function supplyApy(market: Market): number {
  return market.baseApr * utilizationOf(market) * (1 - RESERVE_FACTOR);
}

/** Reserve buffer: the undrawn share a withdrawal would be paid from. */
export function reserveBufferOf(market: Market): number {
  return 1 - utilizationOf(market);
}

/** Undrawn deposits across every live pool. */
export function totalLiquidity(): number {
  return liveMarkets().reduce((sum, m) => sum + m.liquidity, 0);
}

/** Outstanding principal across every live pool. */
export function totalBorrows(): number {
  return liveMarkets().reduce((sum, m) => sum + m.totalBorrows, 0);
}

/** Deposits are what's been lent plus what's still sitting idle. */
export function totalDeposits(): number {
  return totalLiquidity() + totalBorrows();
}

/** Compact money formatting for table cells — `$1.24M`, `$880K`. */
export function formatCompactUsd(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

/** Fixed-precision money, for the secondary line under a compact figure. */
export function formatFullUsd(value: number): string {
  return `$${value.toLocaleString('en-US')}`;
}

export function formatApr(value: number): string {
  return `${(value * 100).toFixed(2)}%`;
}
