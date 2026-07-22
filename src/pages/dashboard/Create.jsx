import { useEffect, useRef, useState } from 'react';
import SmartVideo from '../../components/SmartVideo';
import Confetti from '../../components/Confetti';
import { IconUpload, IconDownload, IconShare, IconSparkle, IconClose } from '../../components/Icons';
import { motions, formats, GENERATE_COST } from '../../config/media';
import { useAuth } from '../../context/AuthContext';
import { generateAndPoll } from '../../lib/generation';
import { addReel } from '../../lib/reelsStore';
import { toast } from '../../lib/toast';

const STATUS_LINES = [
  'Waking up your pet…',
  'Studying those eyes…',
  'Teaching them to move…',
  'Adding a little sparkle…',
  'Almost ready — hold tight…',
];

export default function Create() {
  const { credits, spendCredits } = useAuth();
  const [photo, setPhoto] = useState(null); // { url, name }
  const [enhance, setEnhance] = useState(true);
  const [motionId, setMotionId] = useState(null);
  const [format, setFormat] = useState('9:16');
  const [phase, setPhase] = useState('build'); // build | generating | result
  const [progress, setProgress] = useState(0);
  const [statusLine, setStatusLine] = useState(STATUS_LINES[0]);
  const [result, setResult] = useState(null);
  const abortRef = useRef(null);

  const motion = motions.find((m) => m.id === motionId);
  const canGenerate = photo && motionId && credits >= GENERATE_COST;

  // cycle status lines while generating
  useEffect(() => {
    if (phase !== 'generating') return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % STATUS_LINES.length;
      setStatusLine(STATUS_LINES[i]);
    }, 1600);
    return () => clearInterval(id);
  }, [phase]);

  const onFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please choose an image file.');
    if (photo?.url) URL.revokeObjectURL(photo.url);
    setPhoto({ url: URL.createObjectURL(file), name: file.name });
  };

  const onGenerate = async () => {
    if (!canGenerate) {
      if (credits < GENERATE_COST) toast.error('Not enough credits — top up to generate.');
      return;
    }
    setPhase('generating');
    setProgress(0);
    abortRef.current = new AbortController();
    try {
      const job = await generateAndPoll(
        {
          motion: motionId,
          format,
          enhance,
          stillUrl: photo.url,
          previewSrc: motion?.videoSrc, // mock uses the motion loop as the result
        },
        {
          signal: abortRef.current.signal,
          onProgress: (j) => setProgress(Math.round((j.progress || 0) * 100)),
        }
      );
      spendCredits(GENERATE_COST);
      const reel = addReel({
        motion: motion.label,
        motionId,
        format,
        stillUrl: photo.url,
        videoSrc: job.resultUrl || motion?.videoSrc,
        poster: job.posterUrl || photo.url,
      });
      setResult(reel);
      setPhase('result');
      toast.success('Your Reel is ready ✨');
    } catch (err) {
      if (err?.name !== 'AbortError') toast.error('Generation failed. Please try again.');
      setPhase('build');
    }
  };

  const reset = () => {
    setResult(null);
    setMotionId(null);
    setPhase('build');
  };

  if (phase === 'generating') return <Generating progress={progress} statusLine={statusLine} onCancel={() => { abortRef.current?.abort(); setPhase('build'); }} />;
  if (phase === 'result' && result) return <Result reel={result} still={photo} onAnother={reset} />;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-text-lo">Three quick steps. Your Reel in under a minute.</p>

      {/* Step 1 — Upload */}
      <Step n={1} title="Upload a photo" done={!!photo}>
        <Dropzone photo={photo} onFile={onFile} onClear={() => setPhoto(null)} enhance={enhance} setEnhance={setEnhance} />
      </Step>

      {/* Step 2 — Choose motion */}
      <Step n={2} title="Choose a motion" done={!!motionId} muted={!photo}>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {motions.map((m) => {
            const active = motionId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMotionId(m.id)}
                aria-pressed={active}
                className={`group relative aspect-[3/4] w-[116px] shrink-0 overflow-hidden rounded-token ring-1 transition-all duration-300 ease-intent ${
                  active ? 'ring-2 ring-accent shadow-glow' : 'ring-stroke hover:ring-white/25'
                }`}
              >
                <SmartVideo videoSrc={m.videoSrc} className="h-full w-full" ariaLabel={`${m.label} preview`} />
                <span className="scrim absolute inset-0" aria-hidden="true" />
                <span className={`absolute bottom-2 left-2 right-2 text-left text-xs font-semibold ${m.accent === 'accent-warm' ? 'text-accent-warm' : 'text-text-hi'}`}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
        {motion?.gentle && (
          <p className="mt-3 text-xs text-text-lo">For the ones we miss. Handled gently. 🕊️</p>
        )}
      </Step>

      {/* Step 3 — Format & generate */}
      <Step n={3} title="Format & generate" muted={!photo || !motionId} last>
        <div className="flex flex-wrap items-center gap-2">
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              aria-pressed={format === f.id}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                format === f.id ? 'border-accent bg-accent/10 text-accent' : 'border-stroke text-text-lo hover:text-text-hi'
              }`}
            >
              {f.label} · {f.hint}
            </button>
          ))}
        </div>
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className="btn-accent mt-6 w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10"
        >
          <IconSparkle width={18} height={18} />
          Generate · {GENERATE_COST} ✨
        </button>
        {credits < GENERATE_COST && (
          <p className="mt-3 text-sm text-accent-warm">You need {GENERATE_COST - credits} more credits.</p>
        )}
      </Step>
    </div>
  );
}

function Step({ n, title, children, done, muted, last }) {
  return (
    <section className={`relative pl-10 ${last ? 'pb-2' : 'pb-8'} ${muted ? 'opacity-45' : ''} transition-opacity`}>
      {!last && <span className="absolute left-[15px] top-9 bottom-0 w-px bg-stroke" aria-hidden="true" />}
      <span
        className={`absolute left-0 top-6 grid h-8 w-8 place-items-center rounded-full border text-sm font-semibold ${
          done ? 'border-accent bg-accent text-black' : 'border-stroke bg-panel text-text-lo'
        }`}
      >
        {done ? '✓' : n}
      </span>
      <div className="pt-6">
        <h2 className="font-display mb-4 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function Dropzone({ photo, onFile, onClear, enhance, setEnhance }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  if (photo) {
    return (
      <div className="glass-panel rounded-token p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <img src={photo.url} alt="Your pet" className="h-40 w-40 rounded-token object-cover ring-1 ring-stroke" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm text-accent">
              <span className="h-2 w-2 rounded-full bg-accent" /> Looking good — clear subject, nice light.
            </p>
            <p className="mt-1 truncate text-xs text-text-lo">{photo.name}</p>
            <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-sm text-text-hi">
              <input type="checkbox" checked={enhance} onChange={(e) => setEnhance(e.target.checked)} className="peer sr-only" />
              <span className="relative h-5 w-9 rounded-full bg-white/10 transition-colors peer-checked:bg-accent">
                <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
              </span>
              Auto-enhance
            </label>
            <button onClick={onClear} className="mt-4 text-xs text-text-lo underline underline-offset-2 hover:text-text-hi">
              Choose a different photo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); onFile(e.dataTransfer.files?.[0]); }}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      className={`grid cursor-pointer place-items-center rounded-token border-2 border-dashed py-14 text-center transition-colors ${
        drag ? 'border-accent bg-accent/5' : 'border-stroke hover:border-white/25'
      }`}
    >
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-accent/10 text-accent">
        <IconUpload />
      </span>
      <p className="font-medium text-text-hi">Drop a photo, or click to browse</p>
      <p className="mt-1 text-sm text-text-lo">One clear shot of your pet. JPG or PNG.</p>
    </div>
  );
}

function Generating({ progress, statusLine, onCancel }) {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="w-full max-w-sm text-center">
        <div className="relative mx-auto h-28 w-28">
          <span className="absolute inset-0 animate-pulse-glow rounded-full bg-accent/20 blur-xl" />
          <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="none" stroke="var(--stroke)" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="44" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round"
              strokeDasharray={276.5}
              strokeDashoffset={276.5 - (276.5 * progress) / 100}
              style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0.16,1,0.3,1)' }}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center font-display text-xl font-bold text-text-hi">
            {progress}%
          </span>
        </div>
        <p className="font-display mt-6 text-lg font-semibold text-text-hi">{statusLine}</p>
        <p className="mt-1 text-sm text-text-lo">This usually takes under a minute.</p>
        <button onClick={onCancel} className="btn-ghost mt-6 py-2 text-sm">Cancel</button>
      </div>
    </div>
  );
}

function Result({ reel, still, onAnother }) {
  const ratio = reel.format === '1:1' ? '1 / 1' : reel.format === '16:9' ? '16 / 9' : '9 / 16';

  const onShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My PetReel', text: 'Look at my pet, in motion!', url: window.location.href });
      } catch { /* user cancelled */ }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="relative mx-auto max-w-4xl">
      <Confetti />
      <div className="mb-6 text-center">
        <h2 className="font-display text-2xl font-bold">Meet your Reel ✨</h2>
        <p className="mt-1 text-text-lo">{reel.motion} · {reel.format}</p>
      </div>

      <div className="grid items-start gap-6 sm:grid-cols-[1fr_auto_1fr]">
        <figure className="text-center">
          <div className="overflow-hidden rounded-token ring-1 ring-stroke" style={{ aspectRatio: ratio }}>
            {still?.url ? <img src={still.url} alt="Before" className="h-full w-full object-cover" /> : null}
          </div>
          <figcaption className="mt-2 text-xs uppercase tracking-widest text-text-lo">Before</figcaption>
        </figure>

        <div className="hidden self-center text-2xl text-accent sm:block">→</div>

        <figure className="text-center">
          <div className="overflow-hidden rounded-token ring-2 ring-accent shadow-glow" style={{ aspectRatio: ratio }}>
            <SmartVideo videoSrc={reel.videoSrc} poster={reel.poster} className="h-full w-full" ariaLabel="Your animated Reel" />
          </div>
          <figcaption className="mt-2 text-xs uppercase tracking-widest text-accent">After</figcaption>
        </figure>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a href={reel.videoSrc || '#'} download className="btn-accent">
          <IconDownload width={18} height={18} /> Download
        </a>
        <button onClick={onShare} className="btn-ghost">
          <IconShare width={18} height={18} /> Share
        </button>
        <button onClick={onAnother} className="btn-ghost">Make another</button>
      </div>
    </div>
  );
}
