import { motion } from 'motion/react';
import { useTheme } from '@/contexts/ThemeContext';

const ease = [0.22, 1, 0.36, 1] as const;

const sponsoredBy = [
  { name: 'DeFi Whale', address: '0x7a3b...8f2d', capacity: '$2,000' },
];

const sponsoring = [
  { name: 'New Borrower', address: '0x4c1e...9a5b', exposure: '$200', risk: 'low' },
  { name: 'Builder', address: '0x9d2f...1c7e', exposure: '$0', risk: 'none' },
];

export default function SponsorPanel() {
  const colors = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease }}
      className="rounded-xl border p-5"
      style={{ borderColor: colors.border, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
            <span className="text-sm" style={{ color: '#7C3AED' }}>🤝</span>
          </div>
          <div>
            <h2 className="font-serif text-lg tracking-tight" style={{ color: colors.text }}>Sponsors</h2>
            <p className="font-sans text-[10px]" style={{ color: colors.textSecondary }}>Network relationships</p>
          </div>
        </div>
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
          <div
            key={sponsor.address}
            className="flex items-center gap-3 p-3 rounded-lg border"
            style={{ borderColor: '#DCFCE7', backgroundColor: 'rgba(220, 252, 231, 0.2)' }}
          >
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
              <span className="font-mono text-[9px] font-bold text-green-600">{sponsor.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-sans text-xs font-medium" style={{ color: colors.text }}>{sponsor.name}</div>
              <div className="font-mono text-[8px] truncate" style={{ color: colors.textMuted }}>{sponsor.address}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[7px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Ceiling</div>
              <div className="font-serif text-sm font-semibold" style={{ color: colors.text }}>{sponsor.capacity}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sponsoring */}
      <div className="mb-4">
        <div className="font-mono text-[8px] uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
          You sponsor
        </div>
        <div className="space-y-2">
          {sponsoring.map((person) => (
            <div
              key={person.address}
              className="flex items-center gap-3 p-3 rounded-lg border"
              style={{ borderColor: colors.border }}
            >
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="font-mono text-[9px] font-bold" style={{ color: '#7C3AED' }}>{person.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-sans text-xs font-medium" style={{ color: colors.text }}>{person.name}</div>
                <div className="font-mono text-[8px] truncate" style={{ color: colors.textMuted }}>{person.address}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-[7px] uppercase tracking-widest" style={{ color: colors.textMuted }}>Exposure</div>
                <div
                  className="font-serif text-sm font-semibold"
                  style={{ color: person.exposure !== '$0' ? '#EF4444' : colors.text }}
                >
                  {person.exposure}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="pt-4 border-t" style={{ borderColor: colors.border }}>
        <a
          href="#"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-purple-200 font-mono text-[10px] uppercase tracking-widest text-purple-600 hover:bg-purple-50 transition-colors"
        >
          View sponsor graph →
        </a>
      </div>
    </motion.div>
  );
}
