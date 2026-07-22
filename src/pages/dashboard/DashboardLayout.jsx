import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import Toaster from '../../components/Toaster';
import { useAuth } from '../../context/AuthContext';
import {
  IconCreate,
  IconReels,
  IconCredits,
  IconSettings,
  IconSparkle,
  IconLogout,
} from '../../components/Icons';

const nav = [
  { to: '/app/create', label: 'Create', Icon: IconCreate },
  { to: '/app/reels', label: 'My Reels', Icon: IconReels },
  { to: '/app/credits', label: 'Credits', Icon: IconCredits },
  { to: '/app/settings', label: 'Settings', Icon: IconSettings },
];

const titles = {
  '/app/create': 'Create',
  '/app/reels': 'My Reels',
  '/app/credits': 'Credits',
  '/app/settings': 'Settings',
};

export default function DashboardLayout() {
  const { user, credits, signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = titles[location.pathname] || 'Studio';
  const initial = (user?.user_metadata?.name || user?.email || 'P')[0].toUpperCase();

  const doSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-void text-text-hi">
      {/* ---- Desktop nav rail ---- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-stroke bg-panel/60 backdrop-blur-md transition-all duration-300 ease-intent md:flex ${
          collapsed ? 'w-[76px]' : 'w-60'
        }`}
      >
        <div className="flex h-16 items-center px-4">
          {collapsed ? <Logo to="/app" className="[&_span:last-child]:hidden" /> : <Logo to="/app" />}
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-token px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-text-hi'
                    : 'text-text-lo hover:bg-white/5 hover:text-text-hi'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accent" />
                  )}
                  <Icon className={isActive ? 'text-accent' : ''} width={20} height={20} />
                  {!collapsed && <span>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="m-3 rounded-token px-3 py-2 text-xs text-text-lo transition-colors hover:bg-white/5 hover:text-text-hi"
        >
          {collapsed ? '»' : '« Collapse'}
        </button>
      </aside>

      {/* ---- Main column ---- */}
      <div className={`transition-all duration-300 ${collapsed ? 'md:pl-[76px]' : 'md:pl-60'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stroke bg-void/80 px-5 backdrop-blur-md sm:px-8">
          <h1 className="font-display text-xl font-semibold">{pageTitle}</h1>
          <div className="flex items-center gap-3">
            <NavLink
              to="/app/credits"
              className="flex items-center gap-1.5 rounded-full border border-accent/40 px-3 py-1.5 text-sm font-medium text-accent transition-shadow hover:shadow-glow"
            >
              <IconSparkle width={15} height={15} />
              {credits}
            </NavLink>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="grid h-9 w-9 place-items-center rounded-full bg-panel text-sm font-semibold ring-1 ring-stroke transition-shadow hover:shadow-glow"
                aria-label="Account menu"
                aria-expanded={menuOpen}
              >
                {initial}
              </button>
              {menuOpen && (
                <>
                  <button
                    className="fixed inset-0 z-10 cursor-default"
                    aria-hidden="true"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="glass-panel absolute right-0 z-20 mt-2 w-56 rounded-token p-2 shadow-lift">
                    <p className="truncate px-3 py-2 text-xs text-text-lo">{user?.email}</p>
                    <div className="my-1 h-px bg-stroke" />
                    <NavLink
                      to="/app/settings"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-text-hi transition-colors hover:bg-white/5"
                    >
                      Settings
                    </NavLink>
                    <button
                      onClick={doSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-accent-warm transition-colors hover:bg-white/5"
                    >
                      <IconLogout width={16} height={16} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="px-5 pb-28 pt-6 sm:px-8 md:pb-10">
          <Outlet />
        </main>
      </div>

      {/* ---- Mobile bottom bar ---- */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-stroke bg-panel/90 backdrop-blur-md md:hidden">
        {nav.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors ${
                isActive ? 'text-accent' : 'text-text-lo'
              }`
            }
          >
            <Icon width={20} height={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <Toaster />
    </div>
  );
}
