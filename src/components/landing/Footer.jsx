import Logo from '../Logo';

const cols = [
  { title: 'Product', links: ['Motions', 'Pricing', 'For memories', 'Gallery'] },
  { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Content policy'] },
];

export default function Footer() {
  return (
    <footer className="border-t border-stroke bg-void">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-text-lo">
            One photo. One tap. A Reel that feels alive.
          </p>
          <div className="mt-5 flex gap-3">
            {['TikTok', 'Instagram', 'YouTube'].map((s) => (
              <a
                key={s}
                href="#"
                aria-label={s}
                className="grid h-9 w-9 place-items-center rounded-full glass text-text-lo transition-colors hover:text-accent"
              >
                <span className="text-xs">{s[0]}</span>
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-lo">{c.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-text-hi/80 transition-colors hover:text-accent">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-stroke">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-text-lo sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} PetReel. Made for the ones we love.</p>
          <p>Crafted with care · For the ones we miss too. 🕊️</p>
        </div>
      </div>
    </footer>
  );
}
