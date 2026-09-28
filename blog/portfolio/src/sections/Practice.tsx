import ScrollReveal from '../components/reactbits/ScrollReveal';
import { useReducedMotion } from '../lib/media';
import { CONTACT } from '../data/timeline';

// Wording follows the autobiography (v1.4), sections 壹-一 and 肆-一／二.
const STEPS = [
  { no: '01', title: '釐清問題', body: '遇到陌生的技術，先把要解決的問題定義清楚。' },
  { no: '02', title: '做出最小實作', body: '先建立一個可以執行的最小版本。' },
  { no: '03', title: '回頭理解原理', body: '透過文件、實驗結果與錯誤訊息，弄懂它為什麼有效、有哪些限制。' },
  { no: '04', title: '整理成文件', body: '把過程寫下來，留給自己與團隊重複使用。' }
];

const QUOTE = '當一個概念無法用自己的方式清楚說明時，通常也代表理解仍有缺口。';

export default function Practice() {
  const reduced = useReducedMotion();

  return (
    <section className="practice" aria-labelledby="practice-title">
      <div className="section-head">
        <p className="kicker">HOW I LEARN</p>
        <h2 id="practice-title" className="section-title">
          先做出來，再回頭弄懂
        </h2>
      </div>

      <ol className="loop">
        {STEPS.map(step => (
          <li className="loop-step" key={step.no}>
            <span className="mono loop-no">{step.no}</span>
            <span className="loop-title">{step.title}</span>
            <span className="loop-body">{step.body}</span>
          </li>
        ))}
      </ol>

      <p className="practice-ai">
        {'近一年也持續研究 AI 輔助開發——Claude Code、Codex、MCP、Skills 與規格驅動開發（SDD）。' +
          '比起工具本身，我更在意它們怎麼被放進工程流程：需求怎麼變成規格，產生的程式碼怎麼驗證與維護。' +
          '時間軸上的專題重構，就是一次實際的例子。'}
      </p>

      <blockquote className="quote">
        {reduced ? (
          <p className="scroll-reveal-text">{QUOTE}</p>
        ) : (
          <ScrollReveal splitBy="char" baseOpacity={0.12} baseRotation={2} blurStrength={6}>
            {QUOTE}
          </ScrollReveal>
        )}
        <a className="btn cursor-target is-article quote-link" href={CONTACT.blog}>
          技術部落格
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </blockquote>
    </section>
  );
}
