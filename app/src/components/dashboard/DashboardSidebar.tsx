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
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

/** Width of the rail when collapsed, and of the full sidebar. */
export const SIDEBAR_W = 240;
export const SIDEBAR_W_COLLAPSED = 76;

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: ArrowUpRight, label: 'Borrow', path: '/borrow' },
  { icon: ArrowDownLeft, label: 'Deposit', path: '/lend' },
  { icon: Clock, label: 'Activity', path: '/dashboard/activity' },
  { icon: Users, label: 'Sponsors', path: '/sponsor/graph' },
];

const actionItems = [
  { icon: Zap, label: 'Request Loan', path: '/borrow' },
  { icon: Lock, label: 'Lock Collateral', path: '/borrow' },
  { icon: BarChart3, label: 'View Score History', path: '/dashboard' },
  { icon: Link2, label: 'Sponsor Someone', path: '/sponsor/graph' },
];

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

export default function DashboardSidebar({ collapsed, onToggle }: Props) {
  const colors = useTheme();
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col z-10 border-r transition-[width] duration-300"
      style={{
        width: collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W,
        backgroundColor: 'rgba(248, 245, 242, 0.95)',
        borderColor: colors.border,
      }}
    >
      {/* Logo + collapse toggle */}
      <div
        className={
          collapsed
            ? 'flex flex-col items-center gap-3 py-4'
            : 'h-16 flex items-center justify-between px-5 shrink-0'
        }
      >
        <Link to="/" className="flex items-center gap-2" title="Unora">
          <img src="/Unora icon.png" alt="" className="h-6 w-auto" />
          {!collapsed && (
            <span className="font-serif font-bold text-lg whitespace-nowrap" style={{ color: colors.text }}>
              Unora
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-white shrink-0"
          style={{ borderColor: colors.border }}
        >
          {collapsed ? (
            <PanelLeftOpen className="w-4 h-4" style={{ color: colors.textMuted }} strokeWidth={1.5} />
          ) : (
            <PanelLeftClose className="w-4 h-4" style={{ color: colors.textMuted }} strokeWidth={1.5} />
          )}
        </button>
      </div>

      <nav className={`flex-1 overflow-y-auto ${collapsed ? 'px-3' : 'px-4'}`}>
        {/* Primary destinations */}
        <div className={collapsed ? 'flex flex-col gap-2 mb-6' : 'grid grid-cols-2 gap-2 mb-6'}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                aria-current={isActive ? 'page' : undefined}
                className={`flex flex-col items-center rounded-xl transition-all ${
                  collapsed ? 'gap-0 p-3' : 'gap-1.5 p-3'
                }`}
                style={{
                  backgroundColor: isActive ? '#7C3AED' : 'transparent',
                  color: isActive ? 'white' : colors.textSecondary,
                }}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {!collapsed && (
                  <span className="font-sans text-[10px] font-medium whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="h-px mb-4" style={{ backgroundColor: colors.border }} />

        {/* Secondary actions */}
        <div className="space-y-1.5">
          {actionItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-xl transition-colors hover:bg-white/60 ${
                  collapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" style={{ color: colors.textMuted }} strokeWidth={1.5} />
                {!collapsed && (
                  <span className="font-sans text-xs whitespace-nowrap" style={{ color: colors.textSecondary }}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Promo — hidden on the rail, where there is no room for the copy */}
      {!collapsed && (
        <div className="p-4 mt-auto shrink-0">
          <div className="p-4 rounded-2xl relative overflow-hidden" style={{ backgroundColor: '#7C3AED' }}>
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="font-sans text-xs font-bold text-white">Pro</span>
                <Zap className="w-3 h-3 text-white/80" />
              </div>
              <p className="font-sans text-[10px] text-white/80 leading-relaxed">
                Everything you need for onchain credit and lending
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-white/10" />
            <div className="absolute -right-2 -bottom-2 w-12 h-12 rounded-full bg-white/10" />
          </div>
        </div>
      )}
    </aside>
  );
}
