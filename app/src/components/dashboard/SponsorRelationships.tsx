import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

const sponsoredBy = [
  { address: '0x7a3b...8f2d', name: 'DeFi Whale', capacity: '$2,000', status: 'active' },
];

const sponsoring = [
  { address: '0x4c1e...9a5b', name: 'New Borrower', capacity: '$800', exposure: '$200', status: 'active' },
  { address: '0x9d2f...1c7e', name: 'Builder', capacity: '$500', exposure: '$0', status: 'idle' },
];

export default function SponsorRelationships() {
  const colors = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease }}
      className="rounded-2xl bg-white border border-white/50 shadow-[0_8px_40px_rgba(124,58,237,0.06)] p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: colors.textMuted }}>
          Sponsor Network
        </span>
        <button className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors">
          + Invite
        </button>
      </div>

      {/* Sponsored by */}
      <div className="mb-5">
        <div className="font-mono text-[8px] uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
          Sponsored by
        </div>
        {sponsoredBy.map((sponsor) => (
          <div key={sponsor.address} className="p-3 rounded-xl bg-green-50/50 border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <span className="font-mono text-[10px] font-bold text-green-600">
                  {sponsor.name[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-xs font-medium" style={{ color: colors.text }}>
                  {sponsor.name}
                </div>
                <div className="font-mono text-[9px] truncate" style={{ color: colors.textMuted }}>
                  {sponsor.address}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[8px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Ceiling</div>
                <div className="font-serif text-sm font-semibold" style={{ color: colors.text }}>
                  {sponsor.capacity}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sponsoring */}
      <div>
        <div className="font-mono text-[8px] uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
          You sponsor
        </div>
        <div className="space-y-2">
          {sponsoring.map((person) => (
            <div key={person.address} className="p-3 rounded-xl bg-white/50 border border-white/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="font-mono text-[10px] font-bold" style={{ color: '#7C3AED' }}>
                    {person.name[0]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-xs font-medium" style={{ color: colors.text }}>
                    {person.name}
                  </div>
                  <div className="font-mono text-[9px] truncate" style={{ color: colors.textMuted }}>
                    {person.address}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[8px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Exposure</div>
                  <div className="font-serif text-sm font-semibold" style={{ color: person.exposure !== '$0' ? '#EF4444' : colors.text }}>
                    {person.exposure}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graph link */}
      <button className="w-full mt-4 py-2 rounded-xl border border-purple-200 font-mono text-[10px] uppercase tracking-widest text-purple-600 hover:bg-purple-50 transition-colors">
        View sponsor graph →
      </button>
    </motion.div>
  );
}
