import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowUpRight } from 'lucide-react';

const ease = [0.22, 1, 0.36, 1] as const;

function BarChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const values = [45, 52, 48, 55, 60, 58, 65, 62, 68, 72];
  const max = Math.max(...values);

  return (
    <div className="flex items-end gap-1.5 h-32">
      {values.map((v, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-t-sm"
          style={{ backgroundColor: i === values.length - 1 ? '#7C3AED' : '#E5E7EB' }}
          initial={{ height: 0 }}
          animate={{ height: `${(v / max) * 100}%` }}
          transition={{ duration: 0.5, delay: 0.4 + i * 0.05, ease }}
        />
      ))}
    </div>
  );
}

function DonutChart() {
  const segments = [
    { label: 'General Pool', value: 57, color: '#7C3AED' },
    { label: 'Senior Tranche', value: 43, color: '#A78BFA' },
  ];
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <div className="flex items-center gap-6">
      <div className="relative">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {segments.reduce((acc, seg, i) => {
            const dashArray = (seg.value / total) * 2 * Math.PI * 38;
            const dashOffset = -acc.offset;
            acc.offset += dashArray;
            acc.elements.push(
              <motion.circle
                key={i}
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke={seg.color}
                strokeWidth="12"
                strokeDasharray={`${dashArray} ${2 * Math.PI * 38}`}
                strokeDashoffset={dashOffset}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.2, ease }}
                transform="rotate(-90 50 50)"
              />
            );
            return acc;
          }, { offset: 0, elements: [] as React.ReactNode[] }).elements}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-lg font-semibold" style={{ color: '#111' }}>{total.toFixed(1)}%</span>
          <span className="font-mono text-[7px]" style={{ color: '#999' }}>of total</span>
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="font-sans text-[10px]" style={{ color: '#666' }}>{seg.label}</span>
            <span className="font-mono text-[10px] font-medium" style={{ color: '#111' }}>{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const data = [30, 45, 35, 55, 48, 62, 58, 72, 65, 78, 70, 82];
  const max = Math.max(...data);
  const h = 100;
  const w = 180;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div>
      <svg width={w} height={h} className="mb-2">
        <motion.polyline
          fill="none"
          stroke="#7C3AED"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5, ease }}
        />
      </svg>
      <div className="flex justify-between">
        {months.map((m) => (
          <span key={m} className="font-mono text-[7px]" style={{ color: '#999' }}>{m}</span>
        ))}
      </div>
    </div>
  );
}

export default function ChartsSection() {
  const colors = useTheme();

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {/* Score History */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease }}
        className="p-5 rounded-2xl border shadow-sm"
        style={{ borderColor: colors.border, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-sans text-sm font-medium" style={{ color: colors.text }}>Score History</div>
            <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>Last 10 updates</div>
          </div>
          <button className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(124,58,237,0.1)' }}>
            <ArrowUpRight className="w-3 h-3" style={{ color: '#7C3AED' }} />
          </button>
        </div>
        <BarChart />
      </motion.div>

      {/* Pool Allocation */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease }}
        className="p-5 rounded-2xl border shadow-sm"
        style={{ borderColor: colors.border, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-sans text-sm font-medium" style={{ color: colors.text }}>Pool Allocation</div>
            <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>Where your funds are</div>
          </div>
          <button className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(124,58,237,0.1)' }}>
            <ArrowUpRight className="w-3 h-3" style={{ color: '#7C3AED' }} />
          </button>
        </div>
        <DonutChart />
      </motion.div>

      {/* Repayment Trend */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease }}
        className="p-5 rounded-2xl border shadow-sm"
        style={{ borderColor: colors.border, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-sans text-sm font-medium" style={{ color: colors.text }}>Repayment Trend</div>
            <div className="font-mono text-[9px]" style={{ color: colors.textMuted }}>Score impact over time</div>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100">
            <span className="font-mono text-[9px] text-green-600">+82%</span>
          </div>
        </div>
        <LineChart />
      </motion.div>
    </div>
  );
}
