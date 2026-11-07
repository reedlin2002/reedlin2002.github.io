import Pipeline from './Hero';

export default function Research() {
  return <section className="wrap block" id="research" aria-labelledby="research-title">
    <h2 id="research-title">Research</h2>
    <article className="research-card">
      <div className="research-media"><Pipeline /></div>
      <div className="research-body">
        <p className="project-meta"><span>2023.05 – 2025.02</span><span>大學專題 · 五人團隊</span></p>
        <h3>澎湖海灘垃圾自動監測系統</h3>
        <p>與澎湖海洋公民基金會合作，以 UAV 空拍影像建立海灘垃圾的自動監測流程：拼接全景、用 CenterMask2 辨識保麗龍、寶特瓶、木材、浮標與浮球五類垃圾，再換算成海灘清潔指數（CCI）與塑膠豐度指數（PAI）。</p>
        <h4>我做了什麼</h4>
        <ul className="did-list">
          <li>負責資料處理：資料集含 4,709 張訓練、523 張測試影像，約 7 萬個實例標註</li>
          <li>自己撰寫少數類別的資料增強程式</li>
          <li>訓練並評估 CenterMask2 實例分割模型</li>
          <li>2026 年重構推論程式：找出影像底部 240 px 從未送進模型、貼邊物件被扣除兩個問題，改成重疊切片＋去重，並補上行為測試</li>
        </ul>
        <ul className="tags" aria-label="使用技術">{['Python', 'PyTorch', 'Detectron2', 'CenterMask2', 'OpenCV'].map(tag => <li key={tag}>{tag}</li>)}</ul>
        <p className="text-links"><a href="https://github.com/reedlin2002/project">GitHub ↗</a><a href="https://reedlin2002.github.io/2026/09/28/uav-analysis-refactor/">重構紀錄 ↗</a><a href="https://reedlin2002.github.io/2026/08/23/uav-vision-notes/">技術筆記 ↗</a></p>
      </div>
    </article>
  </section>;
}
