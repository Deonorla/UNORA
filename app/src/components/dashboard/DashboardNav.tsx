import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

export default function DashboardNav() {
  const colors = useTheme();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: colors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/Unora icon.png" alt="" className="h-6 w-auto" />
          <span className="font-serif font-bold text-lg" style={{ color: colors.text }}>Unora</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="font-sans text-sm font-medium" style={{ color: '#7C3AED' }}>
            Dashboard
          </Link>
          <a href="#" className="font-sans text-sm" style={{ color: colors.textSecondary }}>
            Borrow
          </a>
          <a href="#" className="font-sans text-sm" style={{ color: colors.textSecondary }}>
            Lend
          </a>
          <a href="#" className="font-sans text-sm" style={{ color: colors.textSecondary }}>
            Sponsor
          </a>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider"
            style={{ backgroundColor: '#F3E8FF', color: '#7C3AED' }}
          >
            CC3 Testnet
          </div>
          <button
            className="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: '#7C3AED', color: 'white' }}
          >
            0x1a2f...3c4d
          </button>
        </div>
      </div>
    </nav>
  );
}
