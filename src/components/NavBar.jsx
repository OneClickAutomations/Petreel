import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

/** Minimal glass nav — transparent at top, frosts on scroll. */
export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-intent ${
        scrolled ? 'glass shadow-lift' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <Link to="/app" className="btn-accent px-5 py-2.5 text-sm">
              Open studio →
            </Link>
          ) : (
            <>
              <Link
                to="/signin"
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-text-lo transition-colors hover:text-text-hi sm:inline-flex"
              >
                Sign in
              </Link>
              <Link to="/signup" className="btn-accent px-5 py-2.5 text-sm">
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
