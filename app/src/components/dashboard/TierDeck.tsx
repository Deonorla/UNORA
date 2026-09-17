import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Check } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { SCORE } from '@/lib/protocol';
import { TIER_LADDER, type TierRung } from '@/lib/portfolio';

const ease = [0.22, 1, 0.36, 1] as const;

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
    const current = TIER_LADDER.findIndex((t) => t.current);
    const rest = TIER_LADDER.map((_, i) => i).filter((i) => i !== current);
    return [current, ...rest];
  });

  function bringToFront(index: number) {
    setOrder((prev) => [index, ...prev.filter((i) => i !== index)]);
  }

  return (
    <div className="relative h-[212px] flex items-center justify-center select-none">
      {order.map((tierIndex, position) => {
        const tier = TIER_LADDER[tierIndex];
        return (
          <TierCard
            key={tier.name}
            tier={tier}
            position={position}
            total={order.length}
            onSelect={() => bringToFront(tierIndex)}
            borderColor={colors.border}
          />
        );
      })}
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

  // Front card sits centre; the rest fan out symmetrically to either side.
  const side = position === 0 ? 0 : position % 2 === 1 ? -1 : 1;
  const depth = Math.ceil(position / 2);
  const offsetX = side * depth * 176;
  const offsetY = isFront ? 0 : -7 * depth;
  const scale = isFront ? 1 : 0.88 - (depth - 1) * 0.03;
  const rotate = side * depth * 3;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={`${tier.name} tier — score ${tier.minScore}+`}
      initial={false}
      animate={{
        x: offsetX,
        y: offsetY,
        scale,
        rotate,
        zIndex: total - position,
        opacity: isFront ? 1 : 0.94,
      }}
      transition={{ duration: 0.55, ease }}
      whileHover={isFront ? undefined : { scale: scale + 0.03, y: offsetY - 4 }}
      className="absolute w-[272px] h-[184px] rounded-3xl p-5 text-left border shadow-lg"
      style={{
        backgroundColor: tier.fill,
        borderColor: isFront ? tier.color : borderColor,
        cursor: isFront ? 'default' : 'pointer',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-1.5">
          <img src="/Unora icon.png" alt="" className="h-4 w-auto" />
          <span className="font-serif font-bold text-sm" style={{ color: '#111111' }}>
            Unora
          </span>
        </div>

        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ backgroundColor: `${tier.color}1F` }}
        >
          {tier.locked ? (
            <Lock className="w-2.5 h-2.5" style={{ color: tier.color }} strokeWidth={2} />
          ) : (
            <Check className="w-2.5 h-2.5" style={{ color: tier.color }} strokeWidth={2.5} />
          )}
          <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: tier.color }}>
            {tier.current ? 'Current' : tier.locked ? 'Locked' : 'Tier'}
          </span>
        </div>
      </div>

      {/* Tier name + threshold */}
      <div className="mb-5">
        <div className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#6B6A66' }}>
          {tier.name} · score {tier.minScore}+
        </div>
        <div className="font-serif text-3xl font-semibold tabular-nums" style={{ color: '#111111' }}>
          {tier.current ? SCORE.value : tier.minScore}
          <span className="font-mono text-xs ml-1" style={{ color: '#6B6A66' }}>/100</span>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-center gap-6 pt-4 border-t" style={{ borderColor: `${tier.color}26` }}>
        <div>
          <div className="font-mono text-[8px] uppercase tracking-widest" style={{ color: '#6B6A66' }}>
            Collateral
          </div>
          <div className="font-mono text-sm tabular-nums" style={{ color: '#111111' }}>
            {tier.ratio}
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
