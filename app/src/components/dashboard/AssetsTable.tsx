import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

const assets = [
  {
    name: 'General Pool',
    type: 'Borrowed',
    tokens: ['MON', 'USDC', 'WETH'],
    apy: '4.2%',
    apyColor: '#7C3AED',
    deposited: '$8,200.00',
    depositedSub: '4.2% APR',
    capacity: 65,
    available: '$2,870.00',
    status: 'streaming',
  },
  {
    name: 'Senior Tranche',
    type: 'Deposited',
    tokens: ['USDC', 'WETH'],
    apy: '3.8%',
    apyColor: '#22C55E',
    deposited: '$4,250.00',
    depositedSub: '4.2% APY',
    capacity: 42,
    available: '$7,350.00',
    status: 'earning',
  },
  {
    name: 'Sponsored Pool',
    type: 'Borrowed',
    tokens: ['MON', 'USDC'],
    apy: '5.1%',
    apyColor: '#7C3AED',
    deposited: '$0.00',
    depositedSub: '-',
    capacity: 0,
    available: '$12,400.00',
    status: 'available',
  },
  {
    name: 'Junior Tranche',
    type: 'Deposited',
    tokens: ['MON'],
    apy: '6.2%',
    apyColor: '#22C55E',
    deposited: '$0.00',
    depositedSub: '-',
    capacity: 0,
    available: '-',
    status: 'available',
  },
];

export default function AssetsTable() {
  const colors = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
            <span className="text-sm" style={{ color: '#7C3AED' }}>◈</span>
          </div>
          <div>
            <h2 className="font-serif text-xl tracking-tight" style={{ color: colors.text }}>Positions</h2>
            <p className="font-sans text-xs" style={{ color: colors.textSecondary }}>Your active loans and deposits</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">All</span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/60 border border-white/40" style={{ color: colors.textMuted }}>Borrowed</span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/60 border border-white/40" style={{ color: colors.textMuted }}>Deposited</span>
          </div>
          <button className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/60 border border-white/40" style={{ color: colors.textMuted }}>
            Group by: Pool
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: colors.border }}>
        {/* Table header */}
        <div
          className="grid grid-cols-12 gap-4 px-5 py-3 border-b"
          style={{ backgroundColor: 'rgba(243, 232, 255, 0.3)', borderColor: colors.border }}
        >
          <div className="col-span-3 font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Pool</div>
          <div className="col-span-2 font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Type</div>
          <div className="col-span-1 font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>APY</div>
          <div className="col-span-2 font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Amount</div>
          <div className="col-span-2 font-mono text-[9px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Capacity</div>
          <div className="col-span-2 font-mono text-[9px] uppercase tracking-widest text-right" style={{ color: colors.textMuted }}>Available</div>
        </div>

        {/* Table rows */}
        {assets.map((asset, i) => (
          <motion.div
            key={asset.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.05, ease }}
            className="grid grid-cols-12 gap-4 px-5 py-4 border-b last:border-b-0 hover:bg-purple-50/20 transition-colors cursor-pointer"
            style={{ borderColor: colors.border }}
          >
            {/* Pool */}
            <div className="col-span-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
                <span className="font-serif text-sm font-bold" style={{ color: '#7C3AED' }}>
                  {asset.name[0]}
                </span>
              </div>
              <div>
                <div className="font-sans text-sm font-medium" style={{ color: colors.text }}>{asset.name}</div>
                <div className="flex gap-1 mt-0.5">
                  {asset.tokens.map((t) => (
                    <span key={t} className="font-mono text-[7px] px-1 py-0.5 rounded bg-purple-100 text-purple-600">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Type */}
            <div className="col-span-2 flex items-center">
              <span
                className="font-mono text-[9px] px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: asset.type === 'Borrowed' ? '#FEF3C7' : '#DCFCE7',
                  color: asset.type === 'Borrowed' ? '#D97706' : '#16A34A',
                }}
              >
                {asset.status === 'streaming' ? 'Streaming' : asset.status === 'earning' ? 'Earning' : asset.type}
              </span>
            </div>

            {/* APY */}
            <div className="col-span-1 flex items-center">
              <span className="font-serif text-sm font-semibold" style={{ color: asset.apyColor }}>
                {asset.apy}
              </span>
            </div>

            {/* Amount */}
            <div className="col-span-2 flex items-center">
              <div>
                <div className="font-serif text-sm font-semibold" style={{ color: colors.text }}>{asset.deposited}</div>
                <div className="font-mono text-[8px]" style={{ color: colors.textMuted }}>{asset.depositedSub}</div>
              </div>
            </div>

            {/* Capacity */}
            <div className="col-span-2 flex items-center gap-3">
              <div className="flex-1">
                <div className="h-1.5 rounded-full bg-purple-100 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: asset.capacity > 0 ? '#7C3AED' : '#E5E7EB' }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${asset.capacity}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease }}
                  />
                </div>
              </div>
              <span className="font-mono text-[10px]" style={{ color: colors.textMuted }}>{asset.capacity}%</span>
            </div>

            {/* Available */}
            <div className="col-span-2 flex items-center justify-end">
              <span className="font-serif text-sm" style={{ color: colors.text }}>{asset.available}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
