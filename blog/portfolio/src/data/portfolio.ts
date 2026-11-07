// Bilingual page copy. Source of truth: Resume_ZH/EN (2026-11-07) for experience, research and
// awards; timeline.ts for project dates, images and links; public posts and repo READMEs.
import { TIMELINE, type TimelineNode } from './timeline';
import type { T } from '../i18n';
import mienPoster from '../assets/mien-poster.webp';
import mienDemo from '../assets/mien-demo.mp4';
import logoChainsea from '../assets/logo-chainsea.webp';
import logoMcu from '../assets/logo-mcu.webp';

const BLOG = 'https://reedlin2002.github.io';
const GH = 'https://github.com/reedlin2002';

export const CONTACT = { email: 'kanewolf98@gmail.com', github: GH, blog: `${BLOG}/` };

const t = (zh: string, en: string): T => ({ zh, en });

export const UI = {
  nav: {
    about: t('關於', 'About'),
    experience: t('經歷', 'Experience'),
    milestones: t('里程碑', 'Milestones'),
    research: t('研究', 'Research'),
    projects: t('作品', 'Projects'),
    awards: t('獎項', 'Awards'),
    blog: t('部落格', 'Blog')
  },
  skip: t('跳至主要內容', 'Skip to content'),
  themeToLight: t('切換為淺色模式', 'Switch to light mode'),
  themeToDark: t('切換為深色模式', 'Switch to dark mode'),
  langLabel: t('語言', 'Language'),
  showAll: (n: number) => t(`顯示全部 ${n} 則`, `Show all ${n}`),
  collapse: t('收合', 'Show less'),
  whatIDid: t('我做了什麼', 'What I did'),
  projectsLead: t('Side projects 與黑客松作品，每個都附文章或程式碼。', 'Side projects and hackathon work, each with a write-up or source code.'),
  moreProjects: t('其他作品', 'More projects'),
  certifications: t('證照', 'Certifications'),
  zoom: t('放大檢視', 'Enlarge'),
  replay: t('重新播放', 'Replay'),
  close: t('關閉', 'Close'),
  tech: t('使用技術', 'Tech stack'),
  contact: t('聯絡方式', 'Contact'),
  link: { article: t('文章', 'Article'), github: t('GitHub', 'GitHub'), site: t('Demo', 'Demo') }
};

export const ABOUT = {
  name: t('林立人', 'Lin Li-Ren'),
  altName: t('Lin Li-Ren', '林立人'),
  role: t('軟體設計工程師 · 電腦視覺', 'Software Engineer · Computer Vision'),
  // "|" marks where a Chinese line may wrap, so words like 工程師 or 機器學習 never split.
  paragraphs: [
    t('我是林立人，|目前在程曦資訊|擔任軟體設計工程師，|用 React、TypeScript 與 Capacitor |開發跨平台 App。|熟悉需求分析、|問題排查|與版本發布流程，|重視產品的實用性|與可維護性。',
      'I’m Lin Li-Ren, a software design engineer at ChainSea, building cross-platform apps with React, TypeScript and Capacitor. I work across requirements analysis, troubleshooting and release, with an emphasis on practical, maintainable products.'),
    t('大學就讀|銘傳大學|人工智慧應用學系，|曾從事機器學習、|深度學習|與電腦視覺專題研究，|以 UAV 空拍影像|建立海灘垃圾的|實例分割|與監測流程。',
      'I majored in Applied Artificial Intelligence at Ming Chuan University, where my research covered machine learning, deep learning and computer vision: a UAV-based instance segmentation pipeline for monitoring beach litter.')
  ],
  notes: { before: t('我也持續做 side project，|並把專案的設計取捨|', 'I also build side projects and write up the decisions behind them in my '), lead: t('寫成', ''), link: t('技術筆記', 'technical notes'), after: t('。', '.') }
};

export interface Role { title: T; period: T; bullets: T[] }
export interface ExperienceItem { org: T; logo: string; period: T; roles: Role[]; tags?: string[] }

export const EXPERIENCE: ExperienceItem[] = [
  {
    org: t('程曦資訊整合股份有限公司', 'ChainSea Information Integration Co., Ltd.'),
    logo: logoChainsea,
    period: t('2025.08 – 至今', 'Aug 2025 – Present'),
    roles: [
      {
        title: t('軟體設計工程師', 'Software Design Engineer'),
        period: t('2025.12 – 至今', 'Dec 2025 – Present'),
        bullets: [
          t('使用 React、TypeScript 與 Capacitor 開發並維護跨平台數位名片 App，實作電子名片、聯絡人管理、名片掃描等核心功能。', 'Developed and maintained a cross-platform digital business card app with React, TypeScript and Capacitor, implementing digital cards, contact management and business card scanning.'),
          t('與後端工程師合作整合 GraphQL API 與身分驗證服務，改善跨平台應用的操作流程、導頁體驗與功能整合。', 'Integrated GraphQL APIs and authentication services with backend engineers, improving workflows, navigation and cross-platform feature integration.'),
          t('與 QA、DevOps、後端團隊合作排查缺陷、重現問題、驗證修正成果，協助維持開發及發布過程的穩定性。', 'Worked with QA, DevOps and backend teams to investigate defects, reproduce issues and verify fixes, keeping the app stable through development and release.'),
          t('管理 App Build 版本及內部測試發布（TestFlight、Android APK）；以 Firebase App Distribution 開發 CD 自動化腳本，把重複的手動分發簡化為指令式流程。', 'Managed builds and internal test releases via TestFlight and Android APKs; wrote CD scripts on Firebase App Distribution that turned manual distribution into a single command.'),
          t('使用 Gemini 與 Replit 開發 AI 面試系統原型，展示自動產生面試題目、候選人互動與 AI 輔助評估流程。', 'Built an AI interview prototype with Gemini and Replit: generated questions, candidate interaction and AI-assisted evaluation.'),
          t('撰寫 AI 輔助軟體開發教材，包含授課簡報與實作練習，涵蓋 AI Coding、前後端開發、資料庫整合與基礎網站部署。', 'Authored AI-assisted development course materials — slides and hands-on exercises on AI coding, frontend and backend, databases and basic deployment.')
        ]
      },
      {
        title: t('創新研發部實習生', 'AI Intern, Innovation R&D'),
        period: t('2025.08 – 2025.12', 'Aug 2025 – Dec 2025'),
        bullets: [
          t('以創新研發部首批實習生身分參與研發，研究新興 AI 開發工具、工作流程與實際應用情境。', 'Joined the department’s first intern cohort, researching emerging AI development tools, workflows and use cases.'),
          t('研究靜態應用程式安全測試（SAST）、ESLint 與相依套件弱點掃描。', 'Researched static application security testing (SAST), ESLint and dependency vulnerability scanning.'),
          t('參與前端開發初期工作、技術原型驗證，以及新平台與開發方式的可行性研究。', 'Contributed to early frontend work, prototype validation and feasibility studies for new platforms.')
        ]
      }
    ],
    tags: ['React', 'TypeScript', 'Capacitor', 'GraphQL', 'Firebase', 'TestFlight', 'Gemini']
  },
  {
    org: t('銘傳大學', 'Ming Chuan University'),
    logo: logoMcu,
    period: t('2021 – 2025', '2021 – 2025'),
    roles: [
      {
        title: t('人工智慧應用學系｜學士', 'B.S. in Applied Artificial Intelligence'),
        period: t('2025.06 畢業', 'Graduated Jun 2025'),
        bullets: [
          t('主修人工智慧應用，專題研究涵蓋機器學習、深度學習與電腦視覺。', 'Majored in Applied AI, with research spanning machine learning, deep learning and computer vision.'),
          t('大學專題「澎湖海灘垃圾自動監測系統」（2023.05 – 2025.02），獲專題研究優等獎與國科會大專學生研究計畫補助。', 'Undergraduate research project “Penghu Beach Litter Monitoring System” (May 2023 – Feb 2025): Excellence Award in Undergraduate Research and an NSTC undergraduate research grant.')
        ]
      }
    ],
    tags: ['Python', 'C++', 'Machine Learning', 'Deep Learning', 'Computer Vision']
  }
];

export interface Milestone { date: string; text: T; href?: string }

export const MILESTONES: Milestone[] = [
  { date: '2026.10', text: t('發布 mien：GitHub 個人頁 README 的視覺化編輯器。', 'Released mien, a visual editor for GitHub profile READMEs.'), href: 'https://mien.kanewolf98.workers.dev/' },
  { date: '2026.09', text: t('重做智慧旅程規劃，改以地圖為主體編輯行程。', 'Rebuilt Smart Trip Planner around a map-first editor.'), href: `${BLOG}/2026/09/28/smart-trip-planner/` },
  { date: '2026.05', text: t('參加黑客松，獨立完成 MapGo 前端 Prototype。', 'Built the MapGo front-end prototype at a hackathon.'), href: `${BLOG}/2026/09/28/mapgo-hackathon/` },
  { date: '2025.12', text: t('轉任程曦資訊軟體設計工程師。', 'Became a Software Design Engineer at ChainSea.') },
  { date: '2025.08', text: t('加入程曦資訊，成為創新研發部首批實習生。', 'Joined ChainSea as part of the Innovation R&D department’s first intern cohort.') },
  { date: '2025.06', text: t('銘傳大學人工智慧應用學系畢業，獲專題研究優等獎。', 'Graduated from Ming Chuan University with the Excellence Award in Undergraduate Research.') },
  { date: '2024.12', text: t('專題於第 13 屆 5+1 系聯合資訊展展出。', 'Exhibited the research project at the 13th 5+1 Joint Information Exhibition.') },
  { date: '2024.10', text: t('專題獲全國大專校院智慧創新暨跨域整合創作競賽「值得注目獎」。', 'Won the Noteworthy Award at the National University Smart Innovation and Interdisciplinary Integration Competition.') },
  { date: '2024', text: t('專題研究獲國科會 113 年度大專學生研究計畫補助。', 'Received an NSTC undergraduate research project grant.') }
];

export const RESEARCH = {
  title: t('澎湖海灘垃圾自動監測系統', 'Penghu Beach Litter Monitoring System'),
  meta: [t('2023.05 – 2025.02', 'May 2023 – Feb 2025'), t('大學專題 · 五人團隊', 'Undergraduate research · team of five')],
  intro: t('與澎湖海洋公民基金會合作，用 UAV 空拍影像自動辨識保麗龍、寶特瓶、木材、浮標與浮球五類海灘垃圾，並換算成海灘清潔指數（CCI）與塑膠豐度指數（PAI）。',
    'With the Penghu Ocean Citizen Foundation, we used UAV footage to detect five kinds of beach litter — styrofoam, PET bottles, wood, buoys and floats — and turned the results into Clean Coast Index (CCI) and Plastic Abundance Index (PAI) figures.'),
  did: [
    t('處理 UAV 航拍影片：影格擷取、影像取樣與 OpenCV 全景拼接，並處理影像重疊區域。', 'Processed UAV footage: frame extraction, sampling and OpenCV panorama stitching, including overlapping regions.'),
    t('建置、整理與標註影像資料集，轉換分割標籤，實作複製貼上、旋轉與縮放資料增強，改善類別分布不均。', 'Built and annotated the image dataset, converted segmentation labels, and applied copy-paste, rotation and scaling augmentation to address class imbalance.'),
    t('微調 CenterMask2 實例分割模型，以 IoU、AP、Precision、Recall、F1-Score 與混淆矩陣評估表現。', 'Fine-tuned a CenterMask2 instance segmentation model, evaluated with IoU, AP, precision, recall, F1-score and confusion matrices.'),
    t('重建分割結果、邊界框與偵測輸出，視覺化垃圾分布，並依團隊的量化方法呈現 CCI 與 PAI。', 'Reconstructed masks, boxes and detections to visualize litter distribution, and presented CCI and PAI with the team’s quantitative method.')
  ],
  tags: ['Python', 'OpenCV', 'PyTorch', 'Detectron2', 'CenterMask2'],
  links: [
    { label: t('GitHub', 'GitHub'), href: `${GH}/project` },
    { label: t('技術筆記', 'Technical notes'), href: `${BLOG}/2026/08/23/uav-vision-notes/` },
    { label: t('重構筆記', 'Refactor notes'), href: `${BLOG}/2026/09/28/uav-analysis-refactor/` }
  ],
  steps: [
    { label: t('空拍影格', 'UAV frame'), caption: t('UAV 航拍影片擷取的影格', 'A frame extracted from UAV footage') },
    { label: t('切片推論', 'Tiled inference'), caption: t('以 7 × 5 重疊切片逐塊送進模型', 'Overlapping 7 × 5 tiles fed to the model one by one') },
    { label: t('分割輸出', 'Segmentation'), caption: t('拼接全景上的實例分割輸出（2024 系統）', 'Instance segmentation on the stitched panorama (2024 system)') }
  ]
};

export interface Project { id: string; title: T; kind: T; summary: T; tags: string[]; video?: { src: string; poster: string } }

const PERSONAL = t('個人專案', 'Personal project');

export const PROJECTS: Project[] = [
  {
    id: 'trip-planner', title: t('智慧旅程規劃', 'Smart Trip Planner'), kind: PERSONAL,
    summary: t('AI 排出行程初稿後，加景點時列出多繞時間最少的三個插入位置，可選只插入、重排當天或跨天調整，預覽後才套用、也能復原。', 'After AI drafts an itinerary, adding a place lists the three insertion points with the least detour. Choose insert only, reorder the day or rebalance across days, preview, then apply — with undo.'),
    tags: ['React', 'TypeScript', 'MapLibre GL', 'OpenFreeMap']
  },
  {
    id: 'mien', title: t('mien：GitHub 個人頁 README 視覺化編輯器', 'mien: a visual editor for GitHub profile READMEs'), kind: PERSONAL,
    summary: t('拖拉小工具排出 GitHub 個人頁，複製即用、不用寫 Markdown。畫布只允許 GitHub 實際排得出的版面，每次修改由 CI 送官方轉換服務檢查。', 'Drag widgets onto a canvas and copy the result — no Markdown, no login. The canvas only allows layouts GitHub can render, and CI checks every change against GitHub’s own renderer.'),
    tags: ['React', 'TypeScript', 'GitHub Actions'],
    video: { src: mienDemo, poster: mienPoster }
  },
  {
    id: 'mapgo', title: t('玩點任務地圖 MapGo', 'MapGo: a metro mission map'), kind: t('黑客松 · 團隊提案', 'Hackathon · team proposal'),
    summary: t('我獨立完成前端 Prototype：以畫面狀態機串起六個畫面與可重置的主線，PWA 預先快取，離線也能完整展示。', 'I built the front-end prototype on my own: a screen state machine with a resettable demo path, plus a PWA precache so the whole demo runs offline.'),
    tags: ['React', 'TypeScript', 'PWA']
  },
  {
    id: 'twstock-agent', title: t('010401 Finance 台股 AI 分析助手', '010401 Finance: a Taiwan stock analysis assistant'), kind: PERSONAL,
    summary: t('先在本地算好均線、KD、MACD、RSI 與停損停利參考價，AI 只根據這份資料寫摘要；串接 LINE 推播，GitHub Actions 自動產出 Android 安裝檔。', 'Moving averages, KD, MACD, RSI and stop/target prices are computed locally first; the AI only summarizes that data. LINE push alerts, and GitHub Actions builds the Android APK.'),
    tags: ['React', 'Capacitor', 'Python', 'LINE API']
  },
  {
    id: 'atm-finder', title: t('台灣 ATM Finder', 'Taiwan ATM Finder'), kind: PERSONAL,
    summary: t('Python 資料管線整併多個官方來源並做品質檢查；Flutter App 離線優先，ATM 能力欄位分成支援／不支援／未知。', 'A Python pipeline merges official sources behind quality checks; the offline-first Flutter app marks each ATM capability as supported, unsupported or unknown.'),
    tags: ['Python', 'Flutter', 'Data Pipeline']
  },
  {
    id: 'urlhealthmonitor', title: t('UrlHealthMonitor', 'UrlHealthMonitor'), kind: PERSONAL,
    summary: t('.NET 背景服務定時檢查網址並存入 SQLite，同一程式切換監控、儀表板與 CLI 模式，附 xUnit 測試與 Docker 部署。', 'A .NET background service checks URLs on a schedule and stores results in SQLite; one program switches between monitor, dashboard and CLI modes, with xUnit tests and Docker.'),
    tags: ['.NET', 'SQLite', 'xUnit', 'Docker']
  }
];

export const MORE_PROJECTS: { id: string; title: T; summary: T }[] = [
  { id: 'localai', title: t('LocalAIAgentAPI', 'LocalAIAgentAPI'), summary: t('.NET 8 Web API 整合本地推論：ONNX 影像分類、Tesseract OCR 與 Ollama 文字生成。', '.NET 8 Web API with local inference: ONNX image classification, Tesseract OCR and Ollama text generation.') },
  { id: 'nfc-test', title: t('NFC-test：讓手機假裝成一張 NFC 卡片', 'NFC-test: making a phone act as an NFC card'), summary: t('Android HCE 的 APDU 狀態機與 vCard 容量計算；實測確認 iOS 只能當接收端，正式產品因此改用實體卡片。', 'An Android HCE APDU state machine and vCard capacity math; testing showed iOS can only read, so the product moved to physical cards.') },
  { id: 'grad-lab-skills', title: t('tw-grad-lab-skills', 'tw-grad-lab-skills'), summary: t('把找研究所實驗室的流程整理成 Agent Skills，官方資訊與社群評價分開標示。', 'Agent Skills for researching graduate labs, keeping official information and community reviews clearly separated.') }
];

export interface Award { date: string; title: T; detail: T }

export const AWARDS: Award[] = [
  { date: '2025.06', title: t('專題研究優等獎', 'Excellence Award in Undergraduate Research'), detail: t('銘傳大學', 'Ming Chuan University') },
  { date: '2024.12', title: t('第 13 屆 5+1 系聯合資訊展', '13th 5+1 Joint Information Exhibition'), detail: t('「人工智慧與大數據應用」類展出', 'Exhibited in the AI & Big Data category') },
  { date: '2024.10', title: t('值得注目獎', 'Noteworthy Award'), detail: t('全國大專校院智慧創新暨跨域整合創作競賽 · 數位永續科技組', 'National University Smart Innovation and Interdisciplinary Integration Competition · Digital Sustainability Technology') },
  { date: '2024', title: t('國科會 113 年度大專學生研究計畫', 'NSTC Undergraduate Research Project Grant'), detail: t('專題團隊成員 · 計畫編號 113-2813-C-130-043-E', 'Project team member · Grant No. 113-2813-C-130-043-E') }
];

export const CERTIFICATIONS: Award[] = [
  { date: '2024.12', title: t('企業電子化資料分析師（巨量資料處理與分析）', 'Enterprise Data Analyst (Big Data Processing and Analysis)'), detail: t('電腦技能基金會', 'Computer Skills Foundation') },
  { date: '2024.02', title: t('TQC+ 網頁程式設計 HTML5', 'TQC+ Web Programming: HTML5'), detail: t('電腦技能基金會', 'Computer Skills Foundation') }
];

export function node(id: string): TimelineNode {
  const found = TIMELINE.find(item => item.id === id);
  if (!found) throw new Error(`Missing timeline node: ${id}`);
  return found;
}
