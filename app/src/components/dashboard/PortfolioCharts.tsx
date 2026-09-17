import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';
import { MONTHS, BORROWED_SERIES, REPAID_SERIES, formatCompact } from '@/lib/portfolio';

const ease = [0.22, 1, 0.36, 1] as const;

/** Shared card shell so every panel lines up. */
function Panel({
  title,
  meta,
  children,
  delay = 0,
}: {
  title: string;
  meta?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const colors = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease }}
      className="rounded-2xl border shadow-sm p-5 flex flex-col h-full"
      style={{ borderColor: colors.border, backgroundColor: 'rgba(255,255,255,0.6)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="font-sans text-xs font-medium" style={{ color: colors.text }}>
          {title}
        </span>
        {meta && (
          <span
            className="font-mono text-[9px] px-2 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(124,58,237,0.07)', color: '#7C3AED' }}
          >
            {meta}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Borrower-only: mirrored bar chart                                          */
/* -------------------------------------------------------------------------- */

/**
 * Mirrored bar chart: drawn principal above the axis, repaid principal below it.
 * The gap between the two is the outstanding balance — which is the whole story of
 * a credit line, so the two series share one scale rather than being normalised apart.
 */
export function BorrowRepayChart() {
  const colors = useTheme();

  const totalBorrowed = BORROWED_SERIES.reduce((a, b) => a + b, 0);
  const totalRepaid = REPAID_SERIES.reduce((a, b) => a + b, 0);
  const max = Math.max(...BORROWED_SERIES, ...REPAID_SERIES);

  return (
    <Panel title="Borrowed vs repaid" meta="Last 8 months" delay={0.25}>
      <div className="text-center mb-3">
        <div
          className="font-mono text-[9px] uppercase tracking-widest mb-0.5"
          style={{ color: colors.textMuted }}
        >
          Drawn
        </div>
        <div className="font-serif text-3xl font-semibold tabular-nums" style={{ color: colors.text }}>
          {formatCompact(totalBorrowed)}
        </div>
      </div>

      <div className="flex items-end gap-1.5 h-[96px]">
        {MONTHS.map((month, i) => (
          <div key={month} className="flex-1 flex flex-col justify-end h-full">
            <motion.div
              className="w-full rounded-t-[3px]"
              style={{ backgroundColor: '#7C3AED' }}
              initial={{ height: 0 }}
              animate={{ height: `${(BORROWED_SERIES[i] / max) * 100}%` }}
              transition={{ duration: 0.7, delay: 0.35 + i * 0.04, ease }}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 my-1.5">
        {MONTHS.map((month) => (
          <div
            key={month}
            className="flex-1 text-center font-mono text-[8px] py-0.5"
            style={{ color: colors.textMuted, borderTop: `1px solid ${colors.border}` }}
          >
            {month}
          </div>
        ))}
      </div>

      <div className="flex items-start gap-1.5 h-[96px]">
        {MONTHS.map((month, i) => (
          <div key={month} className="flex-1 flex flex-col justify-start h-full">
            <motion.div
              className="w-full rounded-b-[3px]"
              style={{ backgroundColor: '#A78BFA' }}
              initial={{ height: 0 }}
              animate={{ height: `${(REPAID_SERIES[i] / max) * 100}%` }}
              transition={{ duration: 0.7, delay: 0.35 + i * 0.04, ease }}
            />
          </div>
        ))}
      </div>

      <div className="text-center mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
        <div
          className="font-mono text-[9px] uppercase tracking-widest mb-0.5"
          style={{ color: colors.textMuted }}
        >
          Repaid
        </div>
        <div className="font-serif text-3xl font-semibold tabular-nums" style={{ color: colors.text }}>
          {formatCompact(totalRepaid)}
        </div>
        <div className="font-mono text-[9px] mt-1" style={{ color: '#639922' }}>
          {Math.round((totalRepaid / totalBorrowed) * 100)}% of everything drawn
        </div>
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared: donut                                                             */
/* -------------------------------------------------------------------------- */

export interface DonutSlice {
  label: string;
  hint: string;
  value: number;
  color: string;
}

interface DonutProps {
  title: string;
  meta?: string;
  delay?: number;
  slices: DonutSlice[];
  /** Caption above the centre figure — "Total", "Pools", etc. */
  centerLabel: string;
  /** Renders the centre figure from the summed slice values. */
  formatCenter?: (total: number) => string;
  ariaLabel: string;
}

/**
 * Donut of how a fixed pot of capital is split. Used twice on the dashboard — once for
 * where the wallet's USDC sits, once for how it is spread across lending tranches — so
 * it takes its slices rather than importing them.
 */
export function AllocationDonut({
  title,
  meta,
  delay = 0,
  slices,
  centerLabel,
  formatCenter = formatCompact,
  ariaLabel,
}: DonutProps) {
  const colors = useTheme();

  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const size = 172;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  // Each slice is an arc offset by the sum of the slices before it. Computed purely —
  // accumulating into a variable during the render map trips the React Compiler.
  const fractions = slices.map((slice) => (total > 0 ? slice.value / total : 0));
  const offsets = fractions.map((_, i) => fractions.slice(0, i).reduce((a, b) => a + b, 0));

  return (
    <Panel title={title} meta={meta} delay={delay}>
      {/* my-auto centres it in the free space, so equal-height cards don't pool whitespace. */}
      <div className="relative my-auto mx-auto" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label={ariaLabel}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth={stroke}
          />
          {slices.map((slice, i) => {
            const dash = fractions[i] * circumference;
            const offset = offsets[i] * circumference;
            return (
              <motion.circle
                key={slice.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth={stroke}
                strokeLinecap="butt"
                strokeDasharray={`${dash} ${circumference - dash}`}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: -offset }}
                transition={{ duration: 0.9, delay: 0.4 + i * 0.1, ease }}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[8px] uppercase tracking-widest" style={{ color: colors.textMuted }}>
            {centerLabel}
          </span>
          <span className="font-serif text-xl font-semibold tabular-nums" style={{ color: colors.text }}>
            {formatCenter(total)}
          </span>
        </div>
      </div>

      <div className="pt-5 space-y-2.5">
        {slices.map((slice) => (
          <div key={slice.label} className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
            <div className="min-w-0 flex-1">
              <div className="font-sans text-[11px]" style={{ color: colors.text }}>
                {slice.label}
              </div>
              <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>
                {slice.hint}
              </div>
            </div>
            <span className="font-mono text-[10px] tabular-nums shrink-0" style={{ color: colors.text }}>
              {Math.round((total > 0 ? slice.value / total : 0) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared: trend line                                                        */
/* -------------------------------------------------------------------------- */

/** Catmull-Rom to cubic bezier, so the line flows instead of reading as a polyline. */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export interface TrendThreshold {
  value: number;
  label: string;
  color: string;
}

interface TrendProps {
  title: string;
  meta?: string;
  delay?: number;
  series: number[];
  /** Fixed, labelled y-axis bounds — never the data range. */
  yMin: number;
  yMax: number;
  ticks: number[];
  thresholds?: TrendThreshold[];
  /** Must be unique on the page; two instances would otherwise share one gradient. */
  gradientId: string;
  ariaLabel: string;
}

/**
 * Smoothed area line over `MONTHS`.
 *
 * The y-axis is always a fixed, labelled band rather than the data range, so a small
 * move doesn't render as a cliff — but it is labelled, because a silently cropped axis
 * is how charts lie. Optional thresholds draw reference lines in.
 */
export function TrendLineChart({
  title,
  meta,
  delay = 0,
  series,
  yMin,
  yMax,
  ticks,
  thresholds = [],
  gradientId,
  ariaLabel,
}: TrendProps) {
  const colors = useTheme();

  const w = 420;
  const h = 380;
  const padX = 30;
  const padY = 14;

  const x = (i: number) => padX + (i / (series.length - 1)) * (w - padX - 10);
  const y = (value: number) => padY + (1 - (value - yMin) / (yMax - yMin)) * (h - padY * 2);

  const points = series.map((value, i) => ({ x: x(i), y: y(value) }));
  const line = smoothPath(points);
  const area = `${line} L ${x(series.length - 1)} ${h - padY} L ${x(0)} ${h - padY} Z`;
  const last = points[points.length - 1];

  return (
    <Panel title={title} meta={meta} delay={delay}>
      {/* my-auto centres the plot in the free space — same reasoning as the gauge. */}
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-auto my-auto"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={padX} y1={y(tick)} x2={w - 10} y2={y(tick)} stroke={colors.border} strokeWidth="1" />
            <text x={2} y={y(tick) + 4} fontSize="11" fill={colors.textMuted} fontFamily="monospace">
              {tick}
            </text>
          </g>
        ))}

        {thresholds.map((t) => (
          <g key={t.label}>
            <line
              x1={padX}
              y1={y(t.value)}
              x2={w - 10}
              y2={y(t.value)}
              stroke={t.color}
              strokeWidth="1"
              strokeDasharray="3 4"
              opacity="0.5"
            />
            <text
              x={padX + 3}
              y={y(t.value) - 6}
              fontSize="11"
              fill={t.color}
              opacity="0.9"
              fontFamily="monospace"
            >
              {t.label}
            </text>
          </g>
        ))}

        <motion.path
          d={area}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        <motion.path
          d={line}
          fill="none"
          stroke="#7C3AED"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.45, ease }}
        />

        <motion.circle
          cx={last.x}
          cy={last.y}
          r="4"
          fill="#7C3AED"
          stroke="#FFFFFF"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 1.5, ease }}
        />
      </svg>

      <div
        className="flex items-center justify-between mt-4 pt-3 border-t"
        style={{ borderColor: colors.border }}
      >
        {MONTHS.map((month) => (
          <span key={month} className="font-mono text-[8px]" style={{ color: colors.textMuted }}>
            {month}
          </span>
        ))}
      </div>
    </Panel>
  );
}
