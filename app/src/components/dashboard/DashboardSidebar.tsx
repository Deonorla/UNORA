import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Users,
  Zap,
  Lock,
  BarChart3,
  Link2,
  Search,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ArrowUpRight, label: 'Borrow', path: '/borrow' },
  { icon: ArrowDownLeft, label: 'Deposit', path: '/lend' },
  { icon: Clock, label: 'Activity', path: '/dashboard/activity' },
  { icon: Users, label: 'Sponsors', path: '/sponsor/graph' },
];

const actionItems = [
  { icon: Zap, label: 'Request Loan' },
  { icon: Lock, label: 'Lock Collateral' },
  { icon: BarChart3, label: 'View Score History' },
  { icon: Link2, label: 'Sponsor Someone' },
];

export default function DashboardSidebar() {
  const colors = useTheme();
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-60 flex flex-col z-10 border-r"
      style={{ backgroundColor: 'rgba(248, 245, 242, 0.95)', borderColor: colors.border }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/Unora icon.png" alt="" className="h-6 w-auto" />
          <span className="font-serif font-bold text-lg" style={{ color: colors.text }}>Unora</span>
        </Link>
      </div>

      {/* Search */}
      <div className="px-4 mb-5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 border border-white/40">
          <Search className="w-3.5 h-3.5" style={{ color: colors.textMuted }} />
          <span className="font-sans text-xs" style={{ color: colors.textMuted }}>Search...</span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4">
        <div className="grid grid-cols-2 gap-2 mb-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all"
                style={{
                  backgroundColor: isActive ? '#7C3AED' : 'transparent',
                  color: isActive ? 'white' : colors.textSecondary,
                }}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-sans text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px mb-4" style={{ backgroundColor: colors.border }} />

        {/* Action items */}
        <div className="space-y-1.5">
          {actionItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-white/60"
              >
                <Icon className="w-4 h-4" style={{ color: colors.textMuted }} strokeWidth={1.5} />
                <span className="font-sans text-xs" style={{ color: colors.textSecondary }}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Promo card */}
      <div className="p-4 mt-auto">
        <div
          className="p-4 rounded-2xl relative overflow-hidden"
          style={{ backgroundColor: '#7C3AED' }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="font-sans text-xs font-bold text-white">Pro</span>
              <Zap className="w-3 h-3 text-white/80" />
            </div>
            <p className="font-sans text-[10px] text-white/80 leading-relaxed">
              Everything you need for onchain credit and lending
            </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10" />
          <div className="absolute -right-2 -bottom-2 w-12 h-12 rounded-full bg-white/10" />
        </div>
      </div>
    </aside>
  );
}
