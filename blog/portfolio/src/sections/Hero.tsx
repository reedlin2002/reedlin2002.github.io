import { useState } from 'react';
import { FRAME, TILE, frameTiles } from '../lib/tiles';
import frame from '../assets/frame.webp';
import result2024 from '../assets/result-2024.webp';

const STEPS = [
  { label: '分割輸出', caption: '專題系統的全景實例分割輸出（2024）' },
  { label: '輸入影格', caption: 'UAV 空拍影格' },
  { label: '重疊切片', caption: '重構後的 7 × 5 重疊切片（2026）' }
];
const tiles = frameTiles();

export default function Pipeline() {
  const [step, setStep] = useState(0);
  const isResult = step === 0;
  return <figure className="stage">
    <div className="stage-view" id="research-artifact">
      <img className="stage-img" style={{ objectFit: isResult ? 'contain' : 'cover' }} src={isResult ? result2024 : frame} alt={isResult ? '專題系統輸出：海灘全景上的垃圾實例分割遮罩與類別標籤' : 'UAV 空拍影格：沙灘上散落的漂流垃圾'} width={isResult ? 1644 : 1600} height={isResult ? 722 : 900} loading="lazy" />
      {step === 2 && <svg className="tile-overlay" viewBox={`0 0 ${FRAME.width} ${FRAME.height}`} preserveAspectRatio="none" aria-hidden="true">{tiles.map(tile => <rect className="tile" key={tile.index} x={tile.x} y={tile.y} width={TILE.width} height={TILE.height} vectorEffect="non-scaling-stroke" />)}</svg>}
    </div>
    <div className="stage-foot">
      <figcaption aria-live="polite">{STEPS[step].caption}</figcaption>
      <div className="stage-steps" role="group" aria-label="切換專題影像">
        {STEPS.map((item, index) => <button type="button" className={step === index ? 'is-active' : ''} key={item.label} onClick={() => setStep(index)} aria-pressed={step === index} aria-controls="research-artifact">{item.label}</button>)}
      </div>
    </div>
  </figure>;
}
