import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ConnectWalletButton from '@/components/ConnectWalletButton';
import { useUnoraWallet } from '@/hooks/useUnoraWallet';

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  title: string;
  subtitle: string;
  /** Optional third line — status notes, reserve counts. */
  note?: ReactNode;
  /**
   * Right-hand slot, shown only once a wallet is connected: protocol stats, dashboard
   * shortcuts. The connect button is rendered by this component, not passed in.
   */
  children?: ReactNode;
  /**
   * Dashboard-style sizing: smaller title, vertically centred actions, tighter gaps.
   * The content pages use the roomier default.
   */
  dense?: boolean;
}

/**
 * The page header. Pinned to the top of the scroll container so the title and the
 * connect button stay reachable while the table scrolls.
 *
 * Signed out, this collapses to exactly two things — the page name and the connect
 * button. Subtitle, status note and the right-hand slot all appear only once there is
 * a wallet, so a visitor never sees stats or copy describing an account they don't have.
 *
 * The translucent background matters — a fully opaque bar would read as a separate
 * chrome layer, and the cream page tint is what ties it to the surface beneath.
 */
export default function PageHeader({ title, subtitle, note, children, dense }: Props) {
  const colors = useTheme();
  const { authenticated } = useUnoraWallet();

  return (
    <header
      className="sticky top-0 z-20 border-b"
      style={{
        backgroundColor: 'rgba(248, 245, 242, 0.85)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderColor: colors.border,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className={`max-w-[1100px] mx-auto px-8 flex justify-between gap-8 ${
          dense ? 'py-4 items-center' : 'py-6 items-center'
        }`}
      >
        <div className="min-w-0">
          <h1
            className={`font-serif tracking-tight ${dense ? 'text-2xl' : 'text-3xl'} ${
              authenticated && !dense ? 'mb-2' : ''
            }`}
            style={{ color: colors.text }}
          >
            {title}
          </h1>

          {authenticated && (
            <p
              className={`font-sans leading-relaxed ${dense ? 'text-xs' : 'text-sm max-w-lg'}`}
              style={{ color: dense ? colors.textMuted : colors.textSecondary }}
            >
              {subtitle}
            </p>
          )}

          {authenticated && note && <div className="mt-2.5">{note}</div>}
        </div>

        <div className={`flex shrink-0 items-center ${dense ? 'gap-3' : 'gap-7'}`}>
          {authenticated && children}
          <ConnectWalletButton />
        </div>
      </motion.div>
    </header>
  );
}

/** Green dot + mono caption. Used for "X live on Monad testnet" notes. */
export function StatusNote({ children }: { children: ReactNode }) {
  const colors = useTheme();
  return (
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#639922' }} />
      <span className="font-mono text-[10px]" style={{ color: colors.textMuted }}>
        {children}
      </span>
    </div>
  );
}
