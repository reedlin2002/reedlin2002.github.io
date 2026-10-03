// Single source of truth for the timeline. Dates and facts come from the
// application documents (v1.8: autobiography and supporting materials), the public
// repos, the blog posts and items the author confirmed; nothing here is estimated.
// Items without a known date are left out.

import capstone from '../assets/capstone.webp';
import refactor from '../assets/refactor.webp';
import uavNotes from '../assets/uav-notes.webp';
import urlHealthMonitor from '../assets/urlhealthmonitor.webp';
import localAi from '../assets/localai.webp';
import mapgo from '../assets/mapgo.webp';
import atm from '../assets/atm.webp';
import callerId from '../assets/callerid.webp';
import app from '../assets/app.webp';
import twstock from '../assets/twstock.webp';
import tripPlanner from '../assets/trip-planner.webp';
import mien from '../assets/mien.webp';

export type Track = 'research' | 'engineering';

export interface NodeLink {
  kind: 'article' | 'github' | 'site';
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
    body: '與澎湖海洋公民基金會合作，用 UAV 空拍影像建立垃圾量化流程：CenterMask2 實例分割辨識五類垃圾，再換算成海灘清潔指數（CCI）與塑膠豐度指數（PAI）。五人團隊中，我負責資料處理、模型訓練與評估，並自己寫了少數類別的資料增強程式。',
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
    body: '同題研究獲補助（計畫編號 113-2813-C-130-043-E）；由團隊組長提出申請，賈叢林教授指導。',
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
    body: '以「海灘垃圾自動監測系統」參加數位永續科技組，隊名「環保鷹眼隊」。',
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
    id: 'cert-data',
    track: 'research',
    date: '2024.12',
    sortKey: '2024-12-28',
    tag: '證照',
    title: '企業電子化資料分析師（巨量資料處理與分析）',
    body: '財團法人中華民國電腦技能基金會。',
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
    body: '第一輪交給 coding agent，結果做過頭；第二輪由我定方向。過程中找到兩個會直接影響數字的問題：影像最下方 240 px 從沒送進模型，貼邊的完整物件也會被扣掉。改成重疊切片加去重、補上行為測試，舊的訓練環境則刻意不升級，先保住可比較的基準。',
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
    id: 'cert-html5',
    track: 'engineering',
    date: '2024.02',
    sortKey: '2024-02-02',
    tag: '證照',
    title: 'TQC+ 網頁程式設計 HTML5（第 2 版）',
    body: '財團法人中華民國電腦技能基金會。',
    links: [],
    compact: true
  },
  {
    id: 'urlhealthmonitor',
    track: 'engineering',
    date: '2025.07',
    sortKey: '2025-07-05',
    tag: 'Side Project',
    title: 'UrlHealthMonitor',
    body: '第一次寫 .NET 後端：背景服務定時檢查網址，結果存進 SQLite。同一個程式依啟動參數切換背景監控、儀表板與命令列三種模式，附 xUnit 測試，用 Docker 部署。',
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
    body: '以部門首批實習生的身分加入，參與新團隊的技術研究與第一版產品開發，接觸 SA/SD、AI 輔助開發、Git Flow 與靜態分析。',
    links: [],
    compact: true
  },
  {
    id: 'app-dev',
    track: 'engineering',
    date: '2025.08–至今',
    sortKey: '2025-08-02',
    tag: '產品開發',
    title: '數位名片 App 開發',
    body: '從第一版開始參與，負責 Android／iOS 雙平台前端（React、TypeScript、Vite、Capacitor），以同一套程式碼維護兩個平台：確認需求、實作、串接後端、測試，到協助送審。以 v1.1.2 版為例：',
    image: { src: app, alt: '數位名片 App 的登入與 NFC 卡片綁定畫面（產品名稱已遮蔽）', fit: 'contain' },
    links: [],
    stats: [
      { value: 9, label: '功能模組' },
      { value: 37, label: '畫面' },
      { value: 98, label: '後端 API' }
    ],
    cases: [
      {
        title: 'LINE 服務頁一鍵開啟 App',
        detail: '兩邊路由不同，Android 在特定環境打不開 → 建立中介網址與路由對應、比對 APK 簽章 → 直接開到對應頁，並固定排查順序'
      },
      {
        title: '推播通知',
        detail: 'Android 正常、iOS 收不到 → 先寫清楚通知規格，再用 Android 的結果縮小範圍 → 鎖定並修正 APNs 設定'
      },
      {
        title: 'NFC 卡片綁定',
        detail: '雙平台能力不同、實機常感應中斷 → 先做 Prototype 驗證，用 Logcat 找中斷原因 → 收斂為實體卡片＋白名單，中斷明顯減少'
      }
    ]
  },
  {
    id: 'fulltime',
    track: 'engineering',
    date: '2025.12',
    sortKey: '2025-12-01',
    tag: '工作',
    title: '轉任軟體設計工程師',
    body: '實習結束後轉為正職，工作範圍從功能實作擴大到需求釐清、跨平台整合、測試與版本發佈。',
    links: [],
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
    body: 'Android HCE 的 APDU 狀態機、vCard 容量計算。實測確認 iOS 不開放第三方 App 模擬卡片、只能當接收端，這個結論讓正式產品改用實體 NFC 卡片。',
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
    body: 'Python 資料管線整併多個官方來源，通過品質檢查才發佈；Flutter App 離線優先、不需登入。ATM 能力欄位分成「確認支援／確認不支援／未知」三種，未知不會被當成支援。',
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
  },
  {
    id: 'twstock-agent',
    track: 'engineering',
    date: '2026.07',
    sortKey: '2026-07-19',
    tag: 'Side Project',
    title: '010401 Finance 台股 AI 分析助手',
    body: '原則是「先有資料，再問 AI」：在本地算好均線、KD、MACD、RSI 與停損停利參考價，AI 只能根據這份資料寫摘要。另外串接 LINE 官方帳號推播，並用 GitHub Actions 自動產出 Android 安裝檔。',
    image: { src: twstock, alt: '010401 Finance 的自選股、個股分析與股價走勢畫面', fit: 'contain' },
    links: [
      { kind: 'article', href: `${BLOG}/2026/07/19/twstock-agent/` },
      { kind: 'github', href: `${GH}/twstock-agent` }
    ]
  },
  {
    id: 'trip-planner',
    track: 'engineering',
    date: '2026.09',
    sortKey: '2026-09-28',
    tag: 'Side Project',
    title: '智慧旅程規劃',
    body: '五月 Travel Planner 的重做版，改以地圖為主體。AI 排出初稿後，加景點時會列出多繞時間最少的三個插入位置，可選只插入、重排當天或跨天調整，預覽確認後才套用、也能復原；不需帳號，行程用分享連結帶走。',
    image: {
      src: tripPlanner,
      alt: '智慧旅程規劃：把名古屋城加進行程時，列出最省時的三個插入位置與三種改動幅度',
      fit: 'contain'
    },
    links: [{ kind: 'article', href: `${BLOG}/2026/09/28/smart-trip-planner/` }]
  },
  {
    id: 'mien',
    track: 'engineering',
    date: '2026.10',
    sortKey: '2026-10-01',
    tag: 'Side Project',
    title: 'mien：GitHub 個人頁 README 視覺化編輯器',
    body: '像排投影片一樣，把統計卡、語言分布、橫幅拖進畫布，複製貼上就完成，不用寫 Markdown、也不用登入。畫布只允許 GitHub 真正排得出來的版面，每次修改都由 CI 送進 GitHub 官方的轉換服務檢查。',
    image: { src: mien, alt: 'mien 編輯器：左側小工具、中間畫布、右側設定', fit: 'contain' },
    links: [
      { kind: 'site', href: 'https://mien.kanewolf98.workers.dev/' },
      { kind: 'github', href: `${GH}/mien` }
    ]
  }
];

// Array.prototype.sort is stable, so entries sharing a sortKey keep the order above.
export const TIMELINE = [...nodes].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

export const LINK_LABEL: Record<NodeLink['kind'], string> = {
  article: '文章',
  github: 'GitHub',
  site: '官網'
};

export const CONTACT = {
  github: GH,
  blog: `${BLOG}/`,
  email: 'kanewolf98@gmail.com'
};
