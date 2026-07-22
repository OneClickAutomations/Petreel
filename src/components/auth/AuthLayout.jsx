import { Link } from 'react-router-dom';
import SmartVideo from '../SmartVideo';
import Logo from '../Logo';
import { authBrand } from '../../config/media';

/**
 * Split-screen auth shell. Left: brand — a slow muted looping pet render under
 * a dark scrim with the value prop. Right: the form on a glass panel.
 * Never a plain white centered card.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-screen bg-void lg:grid-cols-2">
      {/* Brand side */}
      <div className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0">
          <SmartVideo
            videoSrc={authBrand.videoSrc}
            poster={authBrand.poster}
            className="h-full w-full"
            ariaLabel="A pet, gently in motion"
          />
        </div>
        <div className="scrim absolute inset-0" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo />
          <div>
            <h2 className="font-display max-w-sm text-4xl font-bold leading-tight text-text-hi">
              Your best friend, in motion.
            </h2>
            <p className="mt-3 max-w-xs text-text-lo">
              One photo becomes a Reel that feels alive — in under a minute.
            </p>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <div className="glass-panel rounded-token p-7 shadow-lift sm:p-9">
            <h1 className="font-display text-2xl font-bold text-text-hi sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-text-lo">{subtitle}</p>}
            <div className="mt-7">{children}</div>
          </div>
          <p className="mt-6 text-center text-xs text-text-lo">
            <Link to="/" className="transition-colors hover:text-text-hi">
              ← Back to PetReel
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
