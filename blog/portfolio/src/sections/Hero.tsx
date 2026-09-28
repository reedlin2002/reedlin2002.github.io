import { useEffect, useMemo, useRef, useState } from 'react';
import DecryptedText from '../components/reactbits/DecryptedText';
import { useReducedMotion } from '../lib/media';
import { FRAME, TILE, frameTiles } from '../lib/tiles';
import frame from '../assets/frame.webp';
import result2024 from '../assets/result-2024.webp';

type Step = 0 | 1 | 2;

const STEPS: { label: string; caption: string }[] = [
  { label: '01 輸入影格', caption: '輸入：專題 repo 裡保留的 3840 × 2160 UAV 影格。' },
  {
    label: '02 切片 7 × 5',
    caption: '切片：inference.py 的重疊切法，步長 576 × 432，共 35 格，最後一格貼齊影像邊緣。'
  },
  { label: '03 2024 輸出', caption: '輸出：2024 年系統實際跑出的結果——拼接全景上的實例分割遮罩與類別標籤。' }
];

const COUNTS = [
  { name: '寶特瓶', value: 128 },
  { name: '保麗龍', value: 82 },
  { name: '浮標', value: 49 },
  { name: '木頭', value: 5 },
  { name: '浮球', value: 0 }
];

const SCAN_MS = 70;

function Decrypt({ text, reduced }: { text: string; reduced: boolean }) {
  if (reduced) return <>{text}</>;
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        <DecryptedText
          text={text}
          animateOn="view"
          sequential
          speed={70}
          characters="░▒▓█"
          className="dt-on"
          encryptedClassName="dt-off"
        />
      </span>
    </>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  const tiles = useMemo(() => frameTiles(), []);
  const [step, setStep] = useState<Step>(0);
  const [scanned, setScanned] = useState(0);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach(id => window.clearTimeout(id));
    timers.current = [];
  };

  const runScan = (thenShowResult: boolean) => {
    clearTimers();
    setStep(1);
    if (reduced) {
      setScanned(tiles.length);
      if (thenShowResult) setStep(2);
      return;
    }
    setScanned(0);
    tiles.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setScanned(i + 1), SCAN_MS * (i + 1)));
    });
    if (thenShowResult) {
      timers.current.push(window.setTimeout(() => setStep(2), SCAN_MS * tiles.length + 700));
    }
  };

  // Autoplay once: frame, then the tile scan, then the real 2024 output.
  useEffect(() => {
    if (reduced) {
      setScanned(tiles.length);
      setStep(2);
      return;
    }
    timers.current.push(window.setTimeout(() => runScan(true), 1100));
    return clearTimers;
  }, [reduced]);

  const choose = (next: Step) => {
    clearTimers();
    if (next === 1) {
      runScan(false);
      return;
    }
    setScanned(next === 2 ? tiles.length : 0);
    setStep(next);
  };

  const current = step === 1 && scanned > 0 && scanned <= tiles.length ? tiles[scanned - 1] : null;

  return (
    <header className="hero" id="top">
      <div className="hero-text">
        <p className="kicker">PORTFOLIO · 研究 × 工程</p>
        <h1 className="hero-name">
          <Decrypt text="林立人" reduced={reduced} />{' '}
          <span className="hero-name-en" lang="en">
            <Decrypt text="Jerry Lin" reduced={reduced} />
          </span>
        </h1>
        <ul className="hero-roles">
          <li className="is-research">銘傳大學｜人工智慧應用學系</li>
          <li className="is-engineering">程曦資訊整合股份有限公司｜軟體設計工程師</li>
        </ul>
        <p className="hero-intro">
          {'大學期間以 UAV 航拍與實例分割累積電腦視覺研究經驗；進入業界後，投入跨平台 App 的產品開發與 Android／iOS 整合，' +
            '同時持續透過 Side Projects、開源貢獻與技術寫作探索新的方法。'}
        </p>
        <p className="hero-intro">
          這裡整理我的研究、競賽與展覽、產品開發及個人實作歷程，並附上可查閱的程式碼、文章與公開紀錄。
        </p>
        <div className="hero-legend">
          <a className="legend-chip is-research cursor-target" href="#timeline">
            研究
          </a>
          <span className="legend-x" aria-hidden="true">
            ×
          </span>
          <a className="legend-chip is-engineering cursor-target" href="#timeline">
            工程
          </a>
        </div>
      </div>

      <figure className="stage">
        <div className="stage-head">
          <span className="mono stage-title">PIPELINE</span>
          <div className="stage-steps" role="group" aria-label="切換流程階段">
            {STEPS.map((s, i) => (
              <button
                key={s.label}
                type="button"
                className={`step-pill cursor-target${step === i ? ' is-active' : ''}`}
                aria-pressed={step === i}
                onClick={() => choose(i as Step)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="stage-view">
          <span className="bracket tl" aria-hidden="true" />
          <span className="bracket tr" aria-hidden="true" />
          <span className="bracket bl" aria-hidden="true" />
          <span className="bracket br" aria-hidden="true" />

          <img
            className={`stage-img${step === 2 ? ' is-hidden' : ''}`}
            src={frame}
            alt="專題 repo 保留的 UAV 空拍影格：沙灘上散落的漂流垃圾"
            width={1600}
            height={900}
          />

          <svg
            className={`tile-overlay${step === 1 ? ' is-on' : ''}`}
            viewBox={`0 0 ${FRAME.width} ${FRAME.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {tiles.map(t => {
              const state = t.index < scanned - 1 ? 'done' : t.index === scanned - 1 ? 'now' : 'todo';
              return (
                <rect
                  key={t.index}
                  className={`tile tile-${state}`}
                  x={t.x}
                  y={t.y}
                  width={TILE.width}
                  height={TILE.height}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          <img
            className={`stage-img stage-result${step === 2 ? '' : ' is-hidden'}`}
            src={result2024}
            alt="2024 年系統輸出：海灘全景上以顏色標出的寶特瓶、保麗龍、浮標、木頭等實例分割遮罩"
            width={1644}
            height={722}
          />

          {current && (
            <span className="tile-label mono" aria-hidden="true">
              tile {String(scanned).padStart(2, '0')}/{tiles.length} · ({current.x}, {current.y})
            </span>
          )}
        </div>

        <figcaption className="stage-caption">
          <span>{STEPS[step].caption}</span>
          {step === 2 && (
            <span className="stage-metrics">
              <span className="metric">
                <span className="mono metric-key">CCI</span> 22.24 <span className="metric-note">中度汙染</span>
              </span>
              <span className="metric">
                <span className="mono metric-key">PAI</span> 39.33 <span className="metric-note">高豐度</span>
              </span>
              <span className="metric-counts">
                {COUNTS.map(c => `${c.name} ${c.value}`).join(' · ')}
              </span>
            </span>
          )}
        </figcaption>
      </figure>
    </header>
  );
}
