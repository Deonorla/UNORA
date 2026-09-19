import {
  TokenETH,
  TokenMON,
  TokenUSDC,
  TokenUSDT,
  TokenWBTC,
  type IconComponent,
} from '@web3icons/react';

/**
 * Real token marks, from `@web3icons/react` (2,500+ crypto SVGs, MIT).
 *
 * WETH maps to the ETH mark deliberately — WETH is wrapped ETH and carries the same mark,
 * and the library has no separate WETH icon.
 *
 * The library has no wstETH or sUSDC, so those fall back to a monogram. That is better than
 * substituting a mark that belongs to a different asset: a wrong logo is worse than no logo,
 * because it tells the user they are looking at something they are not.
 */
const LOGOS: Record<string, IconComponent> = {
  USDC: TokenUSDC,
  USDT: TokenUSDT,
  MON: TokenMON,
  WBTC: TokenWBTC,
  WETH: TokenETH,
  ETH: TokenETH,
};

/**
 * Asset badge. Real logo where we have one, monogram otherwise.
 *
 * Circular throughout, including the monogram fallback — every token logo in the library is
 * a circle, and a row of mixed circles and rounded squares reads as a bug.
 */
export default function TokenIcon({
  symbol,
  color,
  size = 32,
}: {
  symbol: string;
  color: string;
  size?: number;
}) {
  const Logo = LOGOS[symbol.toUpperCase()];

  if (Logo) {
    return (
      <span
        className="flex items-center justify-center shrink-0 rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: symbol.toUpperCase() === 'WBTC' ? '#F7931A' : 'transparent',
        }}
      >
        <Logo size={size} variant="branded" />
      </span>
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 font-mono text-[11px] font-medium"
      style={{ width: size, height: size, backgroundColor: `${color}18`, color }}
    >
      {symbol.charAt(0).toUpperCase()}
    </div>
  );
}
