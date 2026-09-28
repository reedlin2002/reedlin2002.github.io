import { CONTACT } from '../data/timeline';

export default function Converge() {
  return (
    <section className="converge" aria-labelledby="converge-title">
      <svg className="converge-lines" viewBox="0 0 800 220" preserveAspectRatio="none" aria-hidden="true">
        <path className="line-research" d="M200 0 C200 110, 400 110, 400 220" />
        <path className="line-engineering" d="M600 0 C600 110, 400 110, 400 220" />
      </svg>

      <p className="kicker converge-kicker">NEXT</p>
      <h2 id="converge-title" className="converge-title">
        希望成為能同時理解研究方法
        <br />
        與工程落地的工程師。
      </h2>

      <div className="converge-links">
        <a className="btn cursor-target is-github" href={CONTACT.github}>
          GitHub
        </a>
        <a className="btn cursor-target is-article" href={CONTACT.blog}>
          部落格
        </a>
        <a className="btn cursor-target is-mail" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </a>
      </div>

      <footer className="site-foot">
        <span>影像來自大學專題的 UAV 空拍資料與系統輸出。</span>
        <span>
          動畫元件取自 <a href="https://reactbits.dev">React Bits</a>（MIT + Commons Clause）。
        </span>
      </footer>
    </section>
  );
}
