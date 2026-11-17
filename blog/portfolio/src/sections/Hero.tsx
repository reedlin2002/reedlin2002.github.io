import { useEffect, useRef, useState } from 'react';
import { RESEARCH, UI } from '../data/portfolio';
import { useT } from '../i18n';
import frame from '../assets/frame.webp';
import tileOutput from '../assets/tile-output.webp';
import result2024 from '../assets/result-2024.webp';

// Real project assets only, in pipeline order: a UAV frame, the model's output on one
// 640 × 480 tile (thesis fig. 5.5), and the 2024 output on the stitched panorama.
const SLIDES = [
  { src: frame, width: 1600, height: 900, fit: 'cover', ms: 2200 },
  { src: tileOutput, width: 640, height: 480, fit: 'contain', ms: 2800 },
  { src: result2024, width: 1644, height: 722, fit: 'contain', ms: 4200 }
] as const;
const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Pipeline() {
  const tr = useT();
  const [step, setStep] = useState(reducedMotion ? SLIDES.length - 1 : 0);
  const [auto, setAuto] = useState(!reducedMotion);
  const [visible, setVisible] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!auto || !visible) return;
    const id = window.setTimeout(() => setStep(s => (s + 1) % SLIDES.length), SLIDES[step].ms);
    return () => window.clearTimeout(id);
  }, [auto, visible, step]);

  const choose = (index: number) => {
    setAuto(false);
    setStep(index);
  };

  const slide = SLIDES[step];
  const current = RESEARCH.steps[step];
  return <figure className="stage" ref={root}>
    <div className="stage-view" id="research-artifact">
      <img className="stage-img" style={{ objectFit: slide.fit }} src={slide.src} alt={tr(current.caption)} width={slide.width} height={slide.height} loading="lazy" />
      <ol className="stage-progress" aria-hidden="true">{RESEARCH.steps.map((s, i) => <li key={s.label.en} className={i === step ? 'is-active' : i < step ? 'is-done' : ''} />)}</ol>
    </div>
    <div className="stage-foot">
      <figcaption aria-live="polite">{tr(current.caption)}</figcaption>
      <div className="stage-steps" role="group" aria-label={tr(RESEARCH.title)}>
        {RESEARCH.steps.map((s, index) => <button type="button" className={step === index ? 'is-active' : ''} key={s.label.en} onClick={() => choose(index)} aria-pressed={step === index} aria-controls="research-artifact">{tr(s.label)}</button>)}
        {!auto && !reducedMotion && <button type="button" className="stage-replay" onClick={() => { setStep(0); setAuto(true); }} aria-label={tr(UI.replay)} title={tr(UI.replay)}>↻</button>}
      </div>
    </div>
  </figure>;
}
