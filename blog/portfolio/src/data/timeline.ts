// Single source of truth for the timeline. Dates and facts come from the
// application autobiography (v1.4), the public repos, the blog posts and items the
// author confirmed; nothing here is estimated. Items without a known date are left out.

import capstone from '../assets/capstone.webp';
import refactor from '../assets/refactor.webp';
import uavNotes from '../assets/uav-notes.webp';
import urlHealthMonitor from '../assets/urlhealthmonitor.webp';
import localAi from '../assets/localai.webp';
import mapgo from '../assets/mapgo.webp';
import atm from '../assets/atm.webp';
import callerId from '../assets/callerid.webp';

export type Track = 'research' | 'engineering';

export interface NodeLink {
  kind: 'article' | 'github';
  href: string;
}

export interface NodeStat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  separator?: string;
}

export interface NodeCase {
  title: string;
  detail: string;
}

export interface TimelineNode {
  id: string;
  track: Track;
  date: string;
  sortKey: string;
  // What kind of entry this is: 競賽, Side Project, 內部 Demo, …
  tag: string;
  title: string;
  body: string;
  // fit 'contain' for UI screenshots, which must not be cropped; photos default to 'cover'.
  image?: { src: string; alt: string; caption?: string; fit?: 'contain' };
  links: NodeLink[];
  stats?: NodeStat[];
  cases?: NodeCase[];
  // One-line card: awards, milestones and other entries without an image.
  compact?: boolean;
}

const BLOG = 'https://reedlin2002.github.io';
const GH = 'https://github.com/reedlin2002';

export const TRACK_LABEL: Record<Track, { zh: string; en: string }> = {
  research: { zh: '研究', en: 'RESEARCH' },
  engineering: { zh: '工程', en: 'ENGINEERING' }
};

const nodes: TimelineNode[] = [
  // ---------- research ----------
  {
    id: 'capstone',
    track: 'research',
    date: '2023.05–2025.02',
    sortKey: '2023-05-01',
    tag: '專題研究',
    title: '大學專題：澎湖海灘垃圾自動監測系統',
    body: '與澎湖海洋公民基金會合作，用 UAV 空拍影像、CenterMask2 實例分割建立垃圾量化流程。五人團隊中，我負責電腦視覺模型的訓練、測試與實驗。',
    image: { src: capstone, alt: '專題系統輸出：拼接全景上的實例分割遮罩', caption: '專題系統的實際輸出' },
    links: [{ kind: 'github', href: `${GH}/project` }],
    stats: [
      { value: 4709, label: '訓練影像', separator: ',' },
      { value: 523, label: '測試影像' },
      { value: 7, label: '實例標註', prefix: '約 ', suffix: ' 萬' }
    ]
  },
  {
    id: 'nstc',
    track: 'research',
    date: '2024',
    sortKey: '2024-07-01',
    tag: '研究計畫',
    title: '國科會 113 年度大專學生研究計畫',
    body: '同題研究獲補助；由團隊組長提出申請，賈叢林教授指導。',
    links: [],
    compact: true
  },
  {
    id: 'award-2024',
    track: 'research',
    date: '2024.10',
    sortKey: '2024-10-20',
    tag: '競賽',
    title: '全國大專校院智慧創新暨跨域整合創作競賽「值得注目獎」',
    body: '以「環保鷹眼隊」參賽，入圍數位永續科技類。',
    links: [],
    compact: true
  },
  {
    id: 'expo',
    track: 'research',
    date: '2024.12',
    sortKey: '2024-12-01',
    tag: '展覽',
    title: '第 13 屆 5+1 系聯合資訊展',
    body: '以「沿海環境保護的新途徑：澎湖海灘垃圾自動監測系統的開發與應用」於「人工智慧與大數據應用」類展出。',
    links: [],
    compact: true
  },
  {
    id: 'graduate',
    track: 'research',
    date: '2025.06',
    sortKey: '2025-06-06',
    tag: '學歷・獎項',
    title: '大學畢業・專題研究優等獎',
    body: '銘傳大學人工智慧應用學系。',
    links: [],
    compact: true
  },
  {
    id: 'refactor',
    track: 'research',
    date: '2026.07–08',
    sortKey: '2026-07-26',
    tag: '重構',
    title: '重構兩年前的專題程式碼',
    body: '第一輪交給 coding agent，結果做過頭；第二輪由我定方向：先定領域詞彙、重疊切片加上去重、補上行為測試，並刻意不升級模型框架。',
    image: { src: refactor, alt: '真實 UAV 影格上的 7 × 5 重疊切片格線', caption: '重構後的切片方式' },
    links: [
      { kind: 'article', href: `${BLOG}/2026/09/28/uav-analysis-refactor/` },
      { kind: 'github', href: `${GH}/project` }
    ]
  },
  {
    id: 'uav-notes',
    track: 'research',
    date: '2026.08',
    sortKey: '2026-08-23',
    tag: '寫作',
    title: '空拍影像辨識技術地圖',
    body: '分割策略、CenterMask2 架構、IoU 與 mAP，以及影像拼接的技術取捨。',
    image: { src: uavNotes, alt: '文章封面：空拍影像辨識技術地圖' },
    links: [{ kind: 'article', href: `${BLOG}/2026/08/23/uav-vision-notes/` }]
  },

  // ---------- engineering ----------
  {
    id: 'urlhealthmonitor',
    track: 'engineering',
    date: '2025.07',
    sortKey: '2025-07-05',
    tag: 'Side Project',
    title: 'UrlHealthMonitor',
    body: '第一次寫 .NET 後端：背景服務定時檢查網址，結果存進 SQLite，再用 Docker 部署。',
    image: { src: urlHealthMonitor, alt: 'UrlHealthMonitor 的 Dashboard 實際執行畫面', fit: 'contain' },
    links: [
      { kind: 'article', href: `${BLOG}/2025/07/05/UrlHealthMonitor/` },
      { kind: 'github', href: `${GH}/UrlHealthMonitor` }
    ]
  },
  {
    id: 'localai',
    track: 'engineering',
    date: '2025.07',
    sortKey: '2025-07-19',
    tag: 'Side Project',
    title: 'LocalAIAgentAPI',
    body: '在 .NET 8 Web API 裡整合本地推論：ONNX 影像分類、Tesseract OCR，以及透過 Ollama 的文字生成。',
    image: { src: localAi, alt: 'LocalAIAgentAPI 的測試頁：選擇圖片分類、文字生成、OCR 等模型' },
    links: [
      { kind: 'article', href: `${BLOG}/2025/07/19/LocalAIAgentAPI/` },
      { kind: 'github', href: `${GH}/Local_API_AI` }
    ]
  },
  {
    id: 'intern',
    track: 'engineering',
    date: '2025.08',
    sortKey: '2025-08-01',
    tag: '工作',
    title: '加入程曦資訊整合，擔任創新研發部 AI 實習生',
    body: '參與新團隊的技術研究與第一版產品開發，接觸 SA/SD、AI 輔助開發、Git Flow 與靜態分析。',
    links: [],
    compact: true
  },
  {
    id: 'fulltime',
    track: 'engineering',
    date: '2025.12',
    sortKey: '2025-12-01',
    tag: '工作',
    title: '轉任軟體設計工程師',
    body: '實習結束後轉為正職。',
    links: [],
    compact: true
  },
  {
    id: 'app-dev',
    track: 'engineering',
    date: '2025–至今',
    sortKey: '2025-12-02',
    tag: '產品開發',
    title: '跨平台 App 開發',
    body: '從第一版開始參與，負責 Android／iOS 雙平台前端（React、TypeScript、Vite、Capacitor）與原生平台整合。',
    links: [],
    stats: [
      { value: 15, label: '主要功能模組' },
      { value: 92, label: 'GraphQL API 操作' },
      { value: 236, label: 'React 元件' },
      { value: 79, label: 'custom hooks' }
    ],
    cases: [
      {
        title: 'Deep Link／Universal Links',
        detail: 'LIFF、Firebase Hosting、Android App Links、iOS Universal Links、route mapping'
      },
      { title: 'FCM 跨平台推播', detail: 'Device Token 註冊與解除、APNs 排查' },
      { title: 'NFC 實機整合', detail: '實體 Tag、UID 驗證、NDEF' }
    ]
  },
  {
    id: 'travel-planner',
    track: 'engineering',
    date: '2026.05',
    sortKey: '2026-05-16',
    tag: 'Side Project',
    title: 'Travel Planner',
    body: 'React＋Google Maps＋Gemini 的行程規劃工具；為了應付 Gemini 免費額度的 429，做了模型 fallback。',
    links: [{ kind: 'article', href: `${BLOG}/2026/05/16/travel-planner-side-project/` }],
    compact: true
  },
  {
    id: 'mapgo',
    track: 'engineering',
    date: '2026.05',
    sortKey: '2026-05-16',
    tag: '黑客松 Prototype',
    title: '玩點任務地圖 MapGo',
    body: '黑客松 prototype：畫面狀態機、用按鈕模擬抵達、整包預先快取，離線也能完整 demo。',
    image: { src: mapgo, alt: 'MapGo 的首頁、任務詳情與捷運路線畫面', fit: 'contain' },
    links: [
      { kind: 'article', href: `${BLOG}/2026/09/28/mapgo-hackathon/` },
      { kind: 'github', href: `${GH}/MapGo` }
    ]
  },
  {
    id: 'nfc-test',
    track: 'engineering',
    date: '2026.05',
    sortKey: '2026-05-31',
    tag: 'Prototype',
    title: 'NFC-test：讓手機假裝成一張 NFC 卡片',
    body: 'Android HCE 的 APDU 狀態機、vCard 容量計算，以及 Android 與 iPhone 在 NFC 能力上的不對稱。',
    links: [
      { kind: 'article', href: `${BLOG}/2026/05/31/nfc-test/` },
      { kind: 'github', href: `${GH}/NFC-test` }
    ],
    compact: true
  },
  {
    id: 'atm-finder',
    track: 'engineering',
    date: '2026.07',
    sortKey: '2026-07-26',
    tag: 'Side Project',
    title: '台灣 ATM Finder',
    body: 'Flutter App，離線優先、不需登入：ATM 據點搜尋、條件篩選、收藏、地圖與導航。',
    image: { src: atm, alt: '台灣 ATM Finder 的使用說明與篩選條件畫面', fit: 'contain' },
    links: [{ kind: 'github', href: `${GH}/atm_Location` }]
  },
  {
    id: 'grad-lab-skills',
    track: 'engineering',
    date: '2026.07',
    sortKey: '2026-07-27',
    tag: 'AI 工作流',
    title: 'tw-grad-lab-skills',
    body: '把找研究所實驗室的流程整理成 Agent Skills，官方資訊與社群評價分開標示，查不到就寫「未知」。',
    links: [
      { kind: 'article', href: `${BLOG}/2026/07/27/tw-grad-lab-skills/` },
      { kind: 'github', href: `${GH}/tw-grad-lab-skills` }
    ],
    compact: true
  },
  {
    id: 'caller-id',
    track: 'engineering',
    date: '2026.09',
    sortKey: '2026-09-19',
    tag: '寫作',
    title: '來電畫面上那行字，是誰決定的？',
    body: 'iOS 來電辨識其實是一條只取第一個命中的短路鏈；從它推導出「身分」與「關係」兩種資料的邊界。',
    image: { src: callerId, alt: '文章圖：iOS 來電辨識的短路鏈，第三層命中後其餘不再呼叫', fit: 'contain' },
    links: [{ kind: 'article', href: `${BLOG}/2026/09/19/ios-caller-id-resolution-chain/` }]
  }
];

// Array.prototype.sort is stable, so entries sharing a sortKey keep the order above.
export const TIMELINE = [...nodes].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

export const LINK_LABEL: Record<NodeLink['kind'], string> = {
  article: '文章',
  github: 'GitHub'
};

export const CONTACT = {
  github: GH,
  blog: `${BLOG}/`,
  email: 'kanewolf98@gmail.com'
};
