import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Check, ChevronUp } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { SCORE } from '@/lib/protocol';
import { TIER_LADDER, pointsToNextTier, type TierRung, type TierState } from '@/lib/portfolio';

const ease = [0.22, 1, 0.36, 1] as const;

const CARD_W = 320;
const CARD_H = 224;
/**
 * Horizontal step between stacked cards, and therefore exactly how much of a side card
 * stays visible. Card content is left-aligned, so the step has to exceed the card's own
 * padding or the tier name slides under the front card — at the original 246 it did.
 */
const SPREAD = 296;

const STATE_META: Record<TierState, { label: string; color: string }> = {
  current: { label: 'Current', color: '#7C3AED' },
  cleared: { label: 'Passed', color: '#639922' },
  locked: { label: 'Locked', color: '#BA7517' },
};

/**
 * Fanned deck of score tiers. The front card is the rung the wallet sits on; the two
 * behind it are the neighbouring rungs, so the ladder reads at a glance.
 *
 * Clicking a card rotates it to the front rather than navigating — there is no per-tier
 * page to go to, and the whole point is comparing the three.
 */
export default function TierDeck() {
  const colors = useTheme();

  // Order is by deck position, front first. Seeded with the current tier in front.
  const [order, setOrder] = useState<number[]>(() => {
    const current = TIER_LADDER.findIndex((t) => t.state === 'current');
    const rest = TIER_LADDER.map((_, i) => i).filter((i) => i !== current);
    return [current, ...rest];
  });

  function bringToFront(index: number) {
    setOrder((prev) => [index, ...prev.filter((i) => i !== index)]);
  }

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ height: CARD_H + 56 }}
    >
      {order.map((tierIndex, position) => (
        <TierCard
          key={TIER_LADDER[tierIndex].name}
          tier={TIER_LADDER[tierIndex]}
          position={position}
          total={order.length}
          onSelect={() => bringToFront(tierIndex)}
          borderColor={colors.border}
        />
      ))}
    </div>
  );
}

function TierCard({
  tier,
  position,
  total,
  onSelect,
  borderColor,
}: {
  tier: TierRung;
  position: number;
  total: number;
  onSelect: () => void;
  borderColor: string;
}) {
  const isFront = position === 0;
  const meta = STATE_META[tier.state];

  // Front card sits centre; the rest fan out symmetrically to either side.
  const side = position === 0 ? 0 : position % 2 === 1 ? -1 : 1;
  const depth = Math.ceil(position / 2);
  const offsetX = side * depth * SPREAD;
  const offsetY = isFront ? 0 : -10 * depth;
  const scale = isFront ? 1 : 0.93 - (depth - 1) * 0.03;
  const rotate = side * depth * 4;

  // The status line is the only place the wallet's own score appears — the card's own
  // numbers are all properties of the tier, so this is what ties it to you.
  const next = pointsToNextTier(SCORE.value);
  const status =
    tier.state === 'current'
      ? `Your score: ${SCORE.value}`
      : tier.state === 'cleared'
        ? `Passed — you're above ${tier.minScore}`
        : next && next.rung.name === tier.name
          ? `Needs ${next.gap} more points`
          : `Unlocks at ${tier.minScore}`;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={`${tier.name} tier — ${meta.label}. Score ${tier.minScore} to enter, ${tier.ratio} collateral, ${tier.ceiling} ceiling.`}
      initial={false}
      animate={{
        x: offsetX,
        y: offsetY,
        scale,
        rotate,
        zIndex: total - position,
      }}
      transition={{ duration: 0.55, ease }}
      whileHover={isFront ? undefined : { scale: scale + 0.025, y: offsetY - 5 }}
      className="absolute rounded-3xl p-5 text-left border shadow-lg flex flex-col"
      style={{
        width: CARD_W,
        height: CARD_H,
        backgroundColor: tier.fill,
        borderColor: isFront ? tier.color : borderColor,
        cursor: isFront ? 'default' : 'pointer',
      }}
    >
      {/* Wordmark + state badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <img src="/Unora icon.png" alt="" className="h-4 w-auto" />
          <span className="font-serif font-bold text-sm" style={{ color: '#111111' }}>
            Unora
          </span>
        </div>

        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full shrink-0"
          style={{ backgroundColor: `${meta.color}1F` }}
        >
          {tier.state === 'locked' ? (
            <Lock className="w-2.5 h-2.5" style={{ color: meta.color }} strokeWidth={2} />
          ) : (
            <Check className="w-2.5 h-2.5" style={{ color: meta.color }} strokeWidth={2.5} />
          )}
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>
      </div>

      {/* Which tier, and where this wallet stands against it */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-serif text-2xl font-semibold" style={{ color: '#111111' }}>
          {tier.name}
        </span>
        {tier.state === 'locked' && (
          <ChevronUp className="w-4 h-4 shrink-0" style={{ color: meta.color }} strokeWidth={2} />
        )}
      </div>
      <div className="font-mono text-[9px] mt-1" style={{ color: meta.color }}>
        {status}
      </div>

      {/* The number the tier actually buys you — what you'd have to lock. */}
      <div className="mt-auto flex items-baseline gap-2">
        <span
          className="font-serif text-4xl font-semibold tabular-nums leading-none"
          style={{ color: '#111111' }}
        >
          {tier.ratio}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: '#6B6A66' }}>
          collateral
        </span>
      </div>

      {/* What it takes to get here, and how much you could draw */}
      <div
        className="flex items-center gap-7 mt-3.5 pt-3.5 border-t"
        style={{ borderColor: `${tier.color}33` }}
      >
        <div>
          <div className="font-mono text-[8px] uppercase tracking-widest" style={{ color: '#6B6A66' }}>
            Entry score
          </div>
          <div className="font-mono text-sm tabular-nums" style={{ color: '#111111' }}>
            {tier.minScore}
          </div>
        </div>
        <div>
          <div className="font-mono text-[8px] uppercase tracking-widest" style={{ color: '#6B6A66' }}>
            Ceiling
          </div>
          <div className="font-mono text-sm tabular-nums" style={{ color: '#111111' }}>
            {tier.ceiling}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
