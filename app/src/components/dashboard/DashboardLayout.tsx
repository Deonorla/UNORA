import { useCallback, useState, type ReactNode } from 'react';
import DashboardSidebar, { SIDEBAR_W, SIDEBAR_W_COLLAPSED } from './DashboardSidebar';

const STORAGE_KEY = 'unora:sidebar-collapsed';

/**
 * App shell for every signed-in page: fixed sidebar plus the scrolling content column.
 *
 * The collapsed flag lives here rather than in each page because the sidebar's width and
 * the content's left margin have to move together. Persisted so the rail stays put across
 * navigations and reloads.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      // Storage can throw in private mode — fall back to expanded.
      return false;
    }
  });

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* not fatal — the rail just won't remember */
      }
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F5F2' }}>
      <DashboardSidebar collapsed={collapsed} onToggle={toggle} />
      <main
        className="min-h-screen transition-[margin-left] duration-300"
        style={{ marginLeft: collapsed ? SIDEBAR_W_COLLAPSED : SIDEBAR_W }}
      >
        {children}
      </main>
    </div>
  );
}
