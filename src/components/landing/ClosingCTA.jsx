import { Link } from 'react-router-dom';
import SmartVideo from '../SmartVideo';
import { closing } from '../../config/media';

export default function ClosingCTA() {
  return (
    <section className="relative overflow-hidden border-t border-stroke">
      <div className="absolute inset-0 -z-10">
        <SmartVideo
          videoSrc={closing.videoSrc}
          poster={closing.poster}
          className="h-full w-full"
          ariaLabel="A pet in joyful slow motion"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-void/70" aria-hidden="true" />

      <div className="mx-auto flex min-h-[70svh] max-w-4xl flex-col items-center justify-center px-5 py-28 text-center sm:px-8">
        <h2 className="font-display text-4xl font-bold leading-tight text-text-hi sm:text-6xl">
          Your best friend,
          <br />
          <span className="text-glow">in motion.</span>
        </h2>
        <Link to="/signup" className="btn-accent mt-9 text-base">
          Animate my pet →
        </Link>
        <p className="mt-4 text-sm text-text-lo">First animation free · No app install</p>
      </div>
    </section>
  );
}
