import { useEffect, useRef, useState } from 'react';
import { FRAME, TILE, frameTiles } from '../lib/tiles';
import { RESEARCH, UI } from '../data/portfolio';
import { useT } from '../i18n';
import frame from '../assets/frame.webp';
import result2024 from '../assets/result-2024.webp';

const tiles = frameTiles();
const FRAME_MS = 2200;
const TILE_MS = 90;
const RESULT_MS = 4200;
const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Real project assets only: the UAV frame, the exact tiles the pipeline cuts, and the 2024 output.
export default function Pipeline() {
  const tr = useT();
  const [step, setStep] = useState(reducedMotion ? 2 : 0);
  const [scanned, setScanned] = useState(reducedMotion ? tiles.length : 0);
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
    if (step === 1 && scanned < tiles.length) {
      const id = window.setTimeout(() => setScanned(n => n + 1), TILE_MS);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      if (step === 0) { setScanned(0); setStep(1); }
      else if (step === 1) setStep(2);
      else setStep(0);
    }, step === 0 ? FRAME_MS : step === 1 ? 500 : RESULT_MS);
    return () => window.clearTimeout(id);
  }, [auto, visible, step, scanned]);

  const choose = (index: number) => {
    setAuto(false);
    setStep(index);
    setScanned(tiles.length);
  };

  const isResult = step === 2;
  const current = RESEARCH.steps[step];
  return <figure className="stage" ref={root}>
    <div className="stage-view" id="research-artifact">
      <img className="stage-img" style={{ objectFit: isResult ? 'contain' : 'cover' }} src={isResult ? result2024 : frame} alt={tr(current.caption)} width={isResult ? 1644 : 1600} height={isResult ? 722 : 900} loading="lazy" />
      {step === 1 && <svg className="tile-overlay" viewBox={`0 0 ${FRAME.width} ${FRAME.height}`} preserveAspectRatio="none" aria-hidden="true">
        {tiles.slice(0, scanned).map(tile => <rect className={tile.index === scanned - 1 && scanned < tiles.length ? 'tile is-now' : 'tile'} key={tile.index} x={tile.x} y={tile.y} width={TILE.width} height={TILE.height} vectorEffect="non-scaling-stroke" />)}
      </svg>}
      <ol className="stage-progress" aria-hidden="true">{RESEARCH.steps.map((s, i) => <li key={s.label.en} className={i === step ? 'is-active' : i < step ? 'is-done' : ''} />)}</ol>
    </div>
    <div className="stage-foot">
      <figcaption aria-live="polite">{tr(current.caption)}</figcaption>
      <div className="stage-steps" role="group" aria-label={tr(RESEARCH.title)}>
        {RESEARCH.steps.map((s, index) => <button type="button" className={step === index ? 'is-active' : ''} key={s.label.en} onClick={() => choose(index)} aria-pressed={step === index} aria-controls="research-artifact">{tr(s.label)}</button>)}
        {!auto && !reducedMotion && <button type="button" className="stage-replay" onClick={() => { setStep(0); setScanned(0); setAuto(true); }} aria-label={tr(UI.replay)} title={tr(UI.replay)}>↻</button>}
      </div>
    </div>
  </figure>;
}
