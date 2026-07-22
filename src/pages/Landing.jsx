import NavBar from '../components/NavBar';
import Hero from '../components/landing/Hero';
import ProofStrip from '../components/landing/ProofStrip';
import MotionTeaser from '../components/landing/MotionTeaser';
import UgcTicker from '../components/landing/UgcTicker';
import ClosingCTA from '../components/landing/ClosingCTA';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="bg-void">
      <a
        href="#proof"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>
      <NavBar />
      <main>
        <Hero />
        <ProofStrip />
        <MotionTeaser />
        <UgcTicker />
        <ClosingCTA />
      </main>
      <Footer />
    </div>
  );
}
