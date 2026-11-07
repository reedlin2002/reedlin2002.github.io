# Academic × Engineering × Field Notes 改版

日期：2026-11-07。範圍：本地實作與驗證，不推送、不部署。

## Phase 1 — Audit

### Current state

- Blog 是 Hexo 7 + 自訂 cactus 主題，EJS / Stylus / vanilla JS；文章來自 `source/_posts/`，About 是 `source/about/index.md`，首頁專案來自 `source/_data/projects.json`。
- Portfolio 是獨立 Vite + React + TypeScript 子專案。`portfolio/src/data/timeline.ts` 保存 22 個研究／工程節點，圖片為本地 WebP。Vite 輸出到 `source/portfolio/`，Hexo `skip_render: portfolio/**` 原樣複製，產物按既有決策納入版本控制。
- Blog 使用 PJAX，只替換 `main.content` 與 title；Portfolio 沒有同樣的容器，跨站內應用導覽必須完整載入，不能交給 PJAX。
- 根目錄 scripts 有 Hexo build、Portfolio build，沒有 lint script 或前端 test runner。Portfolio build 已包含 `tsc --noEmit`。Worker 有獨立 Node tests。
- 部署是 Hexo git deploy 到既有 GitHub Pages repository 的 main。此次不改 URL、permalink、skip_render 或 deploy 設定。

### Strengths

- 墨綠底、嫩綠 accent、等寬小標、筆記式編號列表有辨識度；深淺主題、搜尋、主題資料夾與文章閱讀介面值得保留。
- 公開文章提供真實程式片段、截圖、技術取捨與限制，不只有工具清單。
- 既有 Portfolio 有專題輸入影格、歷史分割輸出、重疊切片解說、個人與團隊角色、正職／實習日期、教育及獎項。
- 圖片已有 WebP；部分 lazy loading、reduced motion、skip link 與 44px 操作目標已存在。

### Problems / 30 秒與 3 分鐘評估

- 首頁第一屏是「持續探索，持續記錄」，沒有職稱、教育或研究案例。30 秒內可以理解這是技術 Blog，難以判斷作者的工程職責與研究背景。
- 「作品」導到首頁尾端四個 repo 連結，沒有連入 `/portfolio/`；其中兩個只連 GitHub 個人頁，不是特定專案證據。
- Portfolio 的研究與工程按鈕都指向同一條時間軸，缺少分類入口、研究案例與工作摘要。390px 下 main 約 12,619px 高，重要案例散落在 22 個節點中，3 分鐘閱讀成本偏高。
- Portfolio 的藍／橘霓虹、方格背景、解碼文字、客製游標與全屏 Hero 和 Blog 品牌不同；JS 約 500.75KB（gzip 170.82KB，既有 build）含 gsap / motion。
- 現有 About 有可信摘要，但課程、CV PDF、正式實驗表格不在 repository。不能補成論文或研究助理經歷。
- 2024 系統輸出與 2026 切片示意放在同一互動展示中，需清楚區分版本；歷史 CCI / PAI 值不是模型準確率。重構尚未以原模型完成 GPU smoke test，不能說精度已提升。
- Portfolio 現有 `noindex, nofollow` 是身分曝光決策，不能為追求 SEO 默默移除。導覽公開連入 Portfolio 是本次使用者明確要求，但 noindex 並非存取控制。
- Blog meta JSON-LD 使用模板字串，含引號標題可能破壞 JSON；canonical fallback 可能錯指首頁。新增頁面銜接時一併修正。
- 桌面已目視檢查兩站；既有 Portfolio 390px、Blog 768px 未觀察到水平溢出。仍需在改版後檢查 360/390/768/1440、深淺色、鍵盤與 reduced motion。

### Reference comparison

實際瀏覽 [You-Zhe Xie](https://www.youzhexie.me/)（2026-11-07）：網頁擷取工具最初失敗，但 Chrome 成功開啟並檢查首頁、Experience / Publications / Projects 的可見內容。

- 首屏將姓名、當前身分、機構與研究問題放在一起，接著是 CV、成績單、Email、Scholar、GitHub 等證據入口。借鑑「先定位，再證據」，不移植其學術身分或成就。
- Experience 將學歷與工作／研究經驗按日期整理；News 獨立呈現近期進展。本站沒有足夠高頻學術進展，不新增空的 News。
- Publications 在題名旁列作者、作者角色、發表場域與專案／論文／程式連結。本站改用 Research case，明確寫五人團隊與我的工作，不新增 Publications 區。
- Projects 提供精選與全部層次，以及可展開的說明。本站採「三個精選案例＋完整時間軸」，讓第一輪閱讀有界限。
- 參考站以寬行距、留白與字級建立層級；本站保留墨綠筆記本，使用細線、編號、圖片與編輯式橫列，不複製其紫色、圖片、原始碼或文案。

## Phase 2 — Design plan

### Site structure / hierarchy

| 入口 | 用途 | 內容順序 |
|---|---|---|
| `/` | 30 秒背景摘要＋持續更新的筆記 | 職稱／方向 → 精選成果 → 原有 Field Notes 列表與主題探索 → 其他 repo |
| `/portfolio/#research` | 核心研究案例 | 個人角色 → 問題／方法 → 歷史輸出／公開程式 → 評估與限制 |
| `/portfolio/#experience` | 工程工作摘要 | 正職／實習 → 跨平台責任 → 公開 Prototype／技術文章 |
| `/portfolio/#projects` | 工程案例 | AI Travel Planner、MapGo；每個案例交代貢獻、決策、證據與限制 |
| `/portfolio/#education` | 學術背景 | 已確認學歷／畢業時間、研究興趣；CV 待補 |
| `/portfolio/#timeline` | 深入完整履歷 | 保留 22 個既有項目，收在可展開的完整時間軸 |
| `/about/` | 公開背景與聯絡 | 沿用 Lin 身分，新增案例交叉連結 |
| `/archives/`、文章、搜尋、tags | Blog | 保留文章與路由；重要文章附回案例的入口 |

### Components / content / visual

- `source/_data/profile.json` 供 Hexo 與 React 共用公開簡介、教育與精選摘要；詳細案例用 typed data，重用既有 timeline 日期／資產。
- 保留 React / Hexo 邊界，不增加 router、UI framework 或動畫套件。
- Hero 不再依賴解碼動畫傳達身分；研究圖保留，但改為使用者主動選擇版本，直接標示歷史輸出與流程示意。
- Portfolio 以墨綠／嫩綠、serif 英文重點、細線分隔、不同寬度的敘事區塊銜接 Blog；移除不必要的入場／游標動畫使用，不刪除授權來源檔案。
- 所有案例先寫實際工作，再提供圖片／文章／repo；限制放在有關結果之後，不以未完成清單開場。
- 首頁不加入全名／公司名；既有 Portfolio 的完整身分與日期保留，noindex 保留。新增公開敘事不放公司內部數量、架構或未證實成效。
- Desktop 採寬主欄＋窄摘要欄；Tablet 改為一欄／兩欄；Mobile 單欄，導覽可換行、圖片完整顯示、避免 hover 才能讀到核心資訊。
- Skip links、原生 details、可見 focus、語意標題、圖片 alt、reduced motion、印刷樣式；分享 metadata 與安全 JSON 序列化。

### Content sources and gaps

| 敘述 | 本次可查證來源 | 邊界 |
|---|---|---|
| 學歷、職稱、日期 | `source/about/index.md`、`timeline.ts` | 不推測入學年、學位英文名稱、GPA／排名 |
| 五人團隊、資料處理／增強／模型訓練 | About、timeline | 團隊整體系統不等同個人全部完成 |
| 重疊切片與測試邊界 | `uav-analysis-refactor.md` | 假 detector 行為測試不代表真實模型精度 |
| UAV 技術方法與評估概念 | `uav-vision-notes.md` | 引用模型論文結果不作為個人實驗數字 |
| MapGo prototype 個人實作、離線 demo | `mapgo-hackathon.md` | 團隊提案；GPS／點數／TDX 是示意，不是上線整合 |
| 旅程地圖、插入預覽／復原 | `smart-trip-planner.md`、既有截圖 | 路徑時間為估算；新版 repo／部署連結待補 |
| 工作整合與 NFC 驗證 | About、`nfc-test.md`、timeline | 公開 prototype 不能取代公司產品整體測試證據 |
| 舊資料量／獎項 | timeline、既有 v1.8 更新紀錄 | 保留既有紀錄；原始分割清單、證書／官方連結待補，不新增量化宣稱 |

待補：可公開 CV PDF、課程／成績（如要公開）、研究資料集版本與切分、baseline／augmentation 對照實驗、每類 Precision / Recall / F1 / AP、mAP 設定、IoU 門檻、原權重與 GPU 驗證結果、圖像授權與實驗日期、個人 commit／分工佐證、新版旅程專案 repo／demo、可公開的工作案例素材。首頁沿用公開商務信箱；Portfolio 原有個人信箱保留，統一信箱需本人決定。

## Phase 3 / 4 — Implementation and validation

### 已完成實作

| 範圍 | 主要檔案 | 改變 |
|---|---|---|
| 首頁資料 | `source/_data/profile.json` | Hexo / React 共用公開簡介與教育背景；三個精選案例入口 |
| 首頁與主題 | `themes/cactus/layout/index.ejs`、`layout/_partial/profile.ejs`、`source/css/_profile.styl`、`source/css/style.styl`、`_config.yml` | 專業定位、背景摘要、精選實作；保留原筆記列表、主題資料夾、舊作品連結、深淺色 |
| Portfolio 架構 | `portfolio/src/App.tsx`、`sections/Overview.tsx`、`sections/Background.tsx` | 明確導覽、職稱／學歷摘要、工作經驗、研究興趣與 CV 待補 |
| 案例內容 | `portfolio/src/data/caseStudies.ts`、`sections/CaseStudies.tsx`、`sections/Hero.tsx` | 研究、AI 旅程規劃、MapGo；實際貢獻／方法／決策／證據／限制；原研究圖片的主動切換 |
| 樣式與效能 | `portfolio/src/editorial.css`、`main.tsx`、`sections/DualTimeline.tsx`、`Practice.tsx`、`Converge.tsx` | Field Notes 配色、字體、細線分層、響應式、印刷；移除頁面對動畫套件的引用，保留來源與授權 |
| Blog 交叉連結 | `source/about/index.md`、四篇文章的 `portfolio_case` front matter、`themes/cactus/layout/post.ejs` | About / 專題重構 / UAV 筆記 / MapGo / 智慧旅程文章可直達案例；文章正文不改寫 |
| 導覽與可存取性 | `themes/cactus/source/js/pjax-init.js`、`landing.js`、`layout/layout.ejs`、`layout/_partial/search.ejs` | Portfolio 使用完整文件導航、skip link、搜尋名稱、資料夾可見文字與可存取名稱一致 |
| SEO | `_config.yml`、`portfolio/index.html`、`themes/cactus/layout/_partial/head.ejs`、`structured-data.ejs`、`scripts/page_title.js` | 首頁 title／description、Portfolio canonical／分享 metadata、安全序列化 JSON-LD；保留 noindex |
| 產物與文件 | `source/portfolio/`、`tools/verify-site.py`、`docs/SDD.md`、`docs/decisions/2026-11-07-portfolio-public-navigation.md` | 依既有方式更新 build 產物，補建置檢查與公開導航決策 |

### 改版前後

| 問題 | 改版前 | 改版後 |
|---|---|---|
| 30 秒身分理解 | 泛用筆記宣言與技術跑馬燈 | Software Engineer / Applied AI & Computer Vision、職稱、學歷與研究入口直接可見 |
| 3 分鐘成果檢索 | 22 個年代排序節點，研究／工程按鈕同目的地 | Research / Experience / Projects / Background 各有穩定 fragment；精選案例先行，完整時間軸可展開 |
| 個人貢獻 | 大多放在卡片段落中 | 研究與工程案例以個人工作開場，明確區分團隊提案、專題系統與個人實作 |
| 證據可讀性 | repo 連結與動態展示分散 | 結果旁附文章／程式／截圖；2024 輸出、2026 示意與待驗證結果分開說明 |
| 品牌 | Blog 墨綠筆記本，Portfolio 藍橘科技視覺 | 保留墨綠、嫩綠、等寬小標與 editorial 字體，跨頁更一致 |
| 前端負擔 | JS 500.75 KB / gzip 170.82 KB | JS 256.79 KB / gzip 82.94 KB（約減少 51.4% gzip） |

30 秒／3 分鐘是資訊架構設計目標，尚未邀請真實教授／面試官進行計時使用者測試，不將其寫成已實證的成效。

### 驗證紀錄

- `npm run build:portfolio`：通過，含 `tsc --noEmit`；Vite 最終輸出 JS 256.79 KB / gzip 82.94 KB，CSS 22.20 KB / gzip 5.45 KB。未增加或更新套件。
- `npm run build`：最終通過且沒有 script load error。驗證工具移到 `tools/`，避免 Hexo 自動把 `scripts/` 下的 Python 檔案當成 JS plugin。
- `python tools/verify-site.py`：17 個 Portfolio 檔案逐位元相同、19 篇文章路由存在、68 個 HTML / 67 個合法 JSON-LD、首頁／About／Portfolio 的本地連結與資產通過。
- `node --test workers/live2d-chat/worker.test.mjs`：39 / 39 通過，未改 Worker 實作。
- 專案未設 lint script / ESLint 設定；沒有聲稱通過不存在的 lint。修改的兩支 theme JS 以 `node --check` 驗證，兩個工作樹的 `git diff --check` 通過。
- Chrome 瀏覽器：首頁／Portfolio 在 360、390、768、1440 寬度檢查無水平溢出；桌面首頁／Portfolio、手機首頁、平板研究段落已目視檢查。深淺主題與 reduced motion 均檢查。
- 實際點擊首頁 CTA → Portfolio 會載入新的 React 文件；MapGo 文章 → `/portfolio/#mapgo` 定位成功；直接開啟 `#timeline` 會展開所有 22 個項目。
- 研究圖切換到 2026 示意時，35 個切片與 `aria-pressed`／說明同步更新；無自動播放。
- 鍵盤 Tab → skip link → Enter 可以進入主要內容；手機選單可展開。搜尋欄取得焦點後輸入 UAV，回傳 3 篇相關文章。
- 最終 public 產物以本地靜態 HTTP server 檢查：首頁 Lighthouse snapshot 通過 40 項／失敗 0；Portfolio 通過 37 項／失敗 0。兩者 Accessibility / Best Practices / SEO 類別分數均為 100。這是 snapshot 模式，不含效能評分，也不證明搜尋引擎可收錄；Portfolio noindex 維持不變。
- 首頁與 Portfolio console 檢查未發現 error / warning。
- 未執行 push、commit、hexo deploy 或任何 Production 部署。原 URL、permalink、deploy、skip_render 設定保留。

### 需要使用者提供

1. 可公開 CV PDF（中／英文）、是否公布成績與修課資料。
2. 原始研究實驗表、資料集切分與版本、評估設定、增強對照、模型權重／GPU 驗證紀錄。這些到齊前不展示精度提升百分比。
3. 研究圖像使用授權、個人分工／commit 證據、獎項可公開的官方佐證。
4. 智慧旅程重做版的 repo／Demo、驗證紀錄；目前保留公開文章與截圖作為證據。
5. 可對外使用的工作案例素材，以及首頁／Portfolio 兩個既有信箱是否統一。

### 只提出建議，未在本次實作

- 完整英文案例與履歷，提供日本／國際審查者更直接的閱讀版本。
- 以同一套資料集與固定權重建立可重現的研究結果頁；完成之後再加入實驗表與比較圖。
- 邀請教授／工程面試官進行 30 秒身分判讀與 3 分鐘成果尋找測試。
- 確認公開版本後，再決定 Portfolio 是否開放索引、CV 下載與結構化 Person 資料。
- 已無引用的動畫套件與舊 Hero CSS 可另做依賴／樣式清理；本次保留 package 與授權來源，避免不必要的工具鏈變動。

### 技術／環境限制與既有狀態

- `themes/cactus` 是獨立 Git 工作樹，上層 repo 將它記為 gitlink，但 `git submodule status` 顯示缺少 mapping；本次未改 Git 組織。後續提交必須同時保留主題內的變更，不能只看上層 diff。
- 本次驗證限 Chrome 與模擬視窗；未進行 Safari／iOS 實機、螢幕閱讀器實聽或真實網路 Core Web Vitals 測量。
- 部分額外的淺色截圖工具呼叫無法完成，已停止等待；淺色仍完成 DOM／版面寬度與 Lighthouse 檢查，不宣稱所有斷點都有可交付截圖。
- 字體、Blog 的部分既有 CDN 與音樂／Live2D 資源仍依賴外部網路。首次建置出現既有 Browserslist 資料較舊的提示，未為此更新 lockfile。
