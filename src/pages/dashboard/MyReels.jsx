import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SmartVideo from '../../components/SmartVideo';
import { IconDownload, IconShare, IconTrash, IconClose, IconCreate } from '../../components/Icons';
import { listReels, deleteReel, subscribeReels } from '../../lib/reelsStore';
import { toast } from '../../lib/toast';

export default function MyReels() {
  const [reels, setReels] = useState(listReels());
  const [active, setActive] = useState(null);

  useEffect(() => subscribeReels(setReels), []);

  const remove = (id) => {
    deleteReel(id);
    setActive(null);
    toast.success('Reel deleted');
  };

  if (reels.length === 0) {
    return (
      <div className="grid min-h-[55vh] place-items-center text-center">
        <div className="max-w-sm">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-accent/10 text-accent">
            <IconCreate width={28} height={28} />
          </div>
          <h2 className="font-display text-2xl font-bold">Your first Reel is one photo away</h2>
          <p className="mt-2 text-text-lo">Upload a favourite shot and watch them come to life.</p>
          <Link to="/app/create" className="btn-accent mt-6">Create a Reel →</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-text-lo">{reels.length} {reels.length === 1 ? 'Reel' : 'Reels'} · tap any to open.</p>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {reels.map((r) => (
          <button
            key={r.id}
            onClick={() => setActive(r)}
            className="group relative block w-full overflow-hidden rounded-token ring-1 ring-stroke transition-all hover:ring-accent/50 hover:shadow-glow"
            style={{ aspectRatio: r.format === '1:1' ? '1/1' : r.format === '16:9' ? '16/9' : '9/16' }}
          >
            <SmartVideo videoSrc={r.videoSrc} poster={r.poster} className="h-full w-full" ariaLabel={`${r.motion} Reel`} />
            <span className="scrim absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
            <span className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-left text-xs opacity-0 transition-opacity group-hover:opacity-100">
              <span className="font-medium text-text-hi">{r.motion}</span>
              <span className="text-text-lo">{new Date(r.createdAt).toLocaleDateString()}</span>
            </span>
          </button>
        ))}
      </div>

      {active && <ReelModal reel={active} onClose={() => setActive(null)} onDelete={remove} />}
    </div>
  );
}

function ReelModal({ reel, onClose, onDelete }) {
  const ratio = reel.format === '1:1' ? '1 / 1' : reel.format === '16:9' ? '16 / 9' : '9 / 16';

  const onShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'My PetReel', url: window.location.href }); } catch {}
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('Link copied');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div className="glass-panel w-full max-w-md rounded-token p-4 shadow-lift" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="font-display font-semibold">{reel.motion}</p>
            <p className="text-xs text-text-lo">{reel.format} · {new Date(reel.createdAt).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="text-text-lo hover:text-text-hi" aria-label="Close"><IconClose /></button>
        </div>
        <div className="mx-auto overflow-hidden rounded-token ring-1 ring-stroke" style={{ aspectRatio: ratio, maxWidth: 340 }}>
          <SmartVideo videoSrc={reel.videoSrc} poster={reel.poster} className="h-full w-full" ariaLabel="Reel playback" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={reel.videoSrc || '#'} download className="btn-accent flex-1 py-2.5 text-sm"><IconDownload width={16} height={16} /> Download</a>
          <button onClick={onShare} className="btn-ghost flex-1 py-2.5 text-sm"><IconShare width={16} height={16} /> Share</button>
          <button onClick={() => onDelete(reel.id)} className="btn-ghost py-2.5 text-sm text-accent-warm"><IconTrash width={16} height={16} /></button>
        </div>
      </div>
    </div>
  );
}
