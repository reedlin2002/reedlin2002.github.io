// Copy for the self-introduction page. Facts come from timeline.ts (application docs v1.8),
// source/about/index.md, the public posts and the repo READMEs; nothing is estimated.
import { TIMELINE, type TimelineNode } from './timeline';
import mienPoster from '../assets/mien-poster.webp';
import mienDemo from '../assets/mien-demo.mp4';

const BLOG = 'https://reedlin2002.github.io';
const GH = 'https://github.com/reedlin2002';

export const CONTACT = { email: 'kanewolf98@gmail.com', github: GH, blog: `${BLOG}/` };

export interface Link { label: string; href: string }

export interface ExperienceItem {
  org: string;
  mark: string;
  period: string;
  roles: { title: string; period: string }[];
  summary: string;
  highlights?: { title: string; detail: string }[];
  tags?: string[];
  links?: Link[];
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    org: '程曦資訊整合股份有限公司',
    mark: '程',
    period: '2025.08 – Present',
    roles: [
      { title: '軟體設計工程師', period: '2025.12 – Present' },
      { title: '創新研發部 AI 實習生（部門首批）', period: '2025.08' }
    ],
    summary: '從第一版開始參與數位名片 App，以同一套 React／TypeScript／Capacitor 程式碼維護 Android 與 iOS：需求確認、實作、GraphQL API 串接、測試到協助送審。',
    highlights: [
      { title: 'LINE 服務頁一鍵開啟 App', detail: '建立中介網址與路由對應、比對 APK 簽章，讓 App Links／Universal Links 直接開到對應頁' },
      { title: 'iOS 推播', detail: '先寫清楚通知規格，用 Android 的結果縮小範圍，鎖定並修正 APNs 設定' },
      { title: 'NFC 卡片綁定', detail: '先做 Prototype 驗證雙平台能力，用 Logcat 找出感應中斷原因，收斂為實體卡片＋白名單' }
    ],
    tags: ['React', 'TypeScript', 'Vite', 'Capacitor', 'GraphQL', 'FCM / APNs', 'NFC'],
    links: [
      { label: 'NFC Prototype', href: `${BLOG}/2026/05/31/nfc-test/` },
      { label: 'iOS 來電辨識', href: `${BLOG}/2026/09/19/ios-caller-id-resolution-chain/` }
    ]
  },
  {
    org: '銘傳大學 人工智慧應用學系',
    mark: '銘',
    period: '2021 – 2025',
    roles: [{ title: '學士', period: '2025.06 畢業' }],
    summary: '大學專題「澎湖海灘垃圾自動監測系統」，以 UAV 空拍影像與實例分割量化海灘垃圾，獲專題研究優等獎。',
    links: [{ label: '研究專題', href: '#research' }]
  }
];

export interface NewsItem { date: string; text: string; href?: string }

export const NEWS: NewsItem[] = [
  { date: '2026.10', text: '發布 mien：GitHub 個人頁 README 的視覺化編輯器。', href: 'https://mien.kanewolf98.workers.dev/' },
  { date: '2026.09', text: '完成智慧旅程規劃重做版，改以地圖為主體編輯行程。', href: `${BLOG}/2026/09/28/smart-trip-planner/` },
  { date: '2026.07', text: '重構大學專題程式碼，找出影像底部 240 px 從未送進模型等兩個影響計數的問題。', href: `${BLOG}/2026/09/28/uav-analysis-refactor/` },
  { date: '2026.05', text: '黑客松：在團隊提案中獨立完成 MapGo 前端 Prototype。', href: `${BLOG}/2026/09/28/mapgo-hackathon/` },
  { date: '2025.12', text: '轉任程曦資訊軟體設計工程師。' },
  { date: '2025.08', text: '加入程曦資訊創新研發部，成為部門首批 AI 實習生。' },
  { date: '2025.06', text: '銘傳大學人工智慧應用學系畢業，專題獲專題研究優等獎。' },
  { date: '2024.12', text: '專題於第 13 屆 5+1 系聯合資訊展「人工智慧與大數據應用」類展出。' },
  { date: '2024.10', text: '「海灘垃圾自動監測系統」獲全國大專校院智慧創新暨跨域整合創作競賽「值得注目獎」。' },
  { date: '2024', text: '專題研究獲國科會 113 年度大專學生研究計畫補助（團隊）。' }
];

export interface Project {
  id: string;
  kind: string;
  summary: string;
  tags: string[];
  video?: { src: string; poster: string };
}

export const PROJECTS: Project[] = [
  {
    id: 'trip-planner',
    kind: '個人專案',
    summary: 'AI 排出行程初稿後，加景點時列出多繞時間最少的三個插入位置，可選只插入、重排當天或跨天調整，預覽後才套用、也能復原。',
    tags: ['React', 'TypeScript', 'MapLibre GL', 'OpenFreeMap']
  },
  {
    id: 'mien',
    kind: '個人專案',
    summary: '拖拉小工具排出 GitHub 個人頁，複製即用、不用寫 Markdown。畫布只允許 GitHub 實際排得出的版面，每次修改由 CI 送官方轉換服務檢查。',
    tags: ['React', 'TypeScript', 'GitHub Actions'],
    video: { src: mienDemo, poster: mienPoster }
  },
  {
    id: 'mapgo',
    kind: '黑客松 · 團隊提案',
    summary: '我獨立完成前端 Prototype：以畫面狀態機串起六個畫面與可重置的主線，PWA 預先快取，離線也能完整展示。',
    tags: ['React', 'TypeScript', 'PWA']
  },
  {
    id: 'twstock-agent',
    kind: '個人專案',
    summary: '先在本地算好均線、KD、MACD、RSI 與停損停利參考價，AI 只根據這份資料寫摘要；串接 LINE 推播，GitHub Actions 自動產出 Android 安裝檔。',
    tags: ['React', 'Capacitor', 'Python', 'LINE API']
  },
  {
    id: 'atm-finder',
    kind: '個人專案',
    summary: 'Python 資料管線整併多個官方來源並做品質檢查；Flutter App 離線優先，ATM 能力欄位分成支援／不支援／未知。',
    tags: ['Python', 'Flutter', 'Data Pipeline']
  },
  {
    id: 'urlhealthmonitor',
    kind: '個人專案',
    summary: '.NET 背景服務定時檢查網址並存入 SQLite，同一程式切換監控、儀表板與 CLI 模式，附 xUnit 測試與 Docker 部署。',
    tags: ['.NET', 'SQLite', 'xUnit', 'Docker']
  }
];

export const MORE_PROJECTS: { id: string; summary: string }[] = [
  { id: 'localai', summary: '.NET 8 Web API 整合本地推論：ONNX 影像分類、Tesseract OCR 與 Ollama 文字生成。' },
  { id: 'nfc-test', summary: 'Android HCE 的 APDU 狀態機與 vCard 容量計算；實測確認 iOS 只能當接收端，正式產品因此改用實體卡片。' },
  { id: 'grad-lab-skills', summary: '把找研究所實驗室的流程整理成 Agent Skills，官方資訊與社群評價分開標示。' }
];

export const AWARDS: { date: string; title: string; detail: string }[] = [
  { date: '2025.06', title: '專題研究優等獎', detail: '銘傳大學人工智慧應用學系' },
  { date: '2024.12', title: '第 13 屆 5+1 系聯合資訊展', detail: '「人工智慧與大數據應用」類展出' },
  { date: '2024.10', title: '值得注目獎', detail: '全國大專校院智慧創新暨跨域整合創作競賽 · 數位永續科技組' },
  { date: '2024', title: '國科會 113 年度大專學生研究計畫', detail: '團隊研究獲補助 · 指導教授 賈叢林' }
];

export const CERTIFICATIONS: { date: string; title: string; detail: string }[] = [
  { date: '2024.12', title: '企業電子化資料分析師（巨量資料處理與分析）', detail: '電腦技能基金會' },
  { date: '2024.02', title: 'TQC+ 網頁程式設計 HTML5', detail: '電腦技能基金會' }
];

export function node(id: string): TimelineNode {
  const found = TIMELINE.find(item => item.id === id);
  if (!found) throw new Error(`Missing timeline node: ${id}`);
  return found;
}

export const LINK_LABEL = { article: '文章', github: 'GitHub', site: 'Demo' } as const;
