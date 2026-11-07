import { CONTACT } from '../data/portfolio';

const NAV = [
  ['about', 'About'], ['experience', 'Experience'], ['news', 'News'],
  ['research', 'Research'], ['projects', 'Projects'], ['awards', 'Awards']
];

export function SiteHeader() {
  return <header className="site-header">
    <div className="wrap site-header-inner">
      <a className="brand" href="#about">林立人</a>
      <nav aria-label="頁面區塊">
        {NAV.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        <a className="nav-blog" href={CONTACT.blog}>Blog ↗</a>
      </nav>
    </div>
  </header>;
}

export default function About() {
  return <section className="wrap about" id="about" aria-labelledby="about-title">
    <h1 id="about-title">林立人 <span lang="en">Jerry Lin</span></h1>
    <p className="about-role" lang="en">Software Engineer · Computer Vision</p>
    <div className="about-body">
      <p>我是林立人，目前在程曦資訊擔任軟體設計工程師，用 React、TypeScript 與 Capacitor 開發跨平台 App，負責 Android／iOS 的原生功能整合，例如 Deep Link、推播與 NFC。</p>
      <p>畢業於銘傳大學人工智慧應用學系。大學專題以 UAV 空拍影像做海灘垃圾的實例分割，我負責資料處理、少數類別的資料增強與 CenterMask2 模型訓練；兩年後再回頭重構推論程式，找出影響計數的切片問題。</p>
      <p>我也持續做 side project，並把專案的設計取捨寫成<a href={CONTACT.blog}>技術筆記</a>。</p>
    </div>
    <ul className="about-contact" aria-label="聯絡方式">
      <li><a href={`mailto:${CONTACT.email}`}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3z M3 6l9 7 9-7" /></svg>{CONTACT.email}</a></li>
      <li><a href={CONTACT.github}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4 1.4-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" /></svg>reedlin2002</a></li>
    </ul>
  </section>;
}
