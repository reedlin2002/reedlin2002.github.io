---
title: 用 AI 幫你規劃旅程 — Travel Planner Side Project 開發心得
date: 2026-05-16 20:00:00
tags: [side project, React, TypeScript, AI]
cover: https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800
---

# 用 AI 幫你規劃旅程 — Travel Planner Side Project 開發心得

> 這個 Side Project 的起點很簡單：每次出遊前花在「要去哪裡、怎麼排行程」上的時間，往往比旅遊本身還要長。

---

## 專案簡介

**travel_frontend** 是一個 AI 智慧行程規劃工具，使用者只需要在地圖上選擇起點與終點、輸入旅遊天數、人數和偏好的交通方式，就可以由 AI 自動生成一份完整的旅遊行程表，並且在地圖上可視化路線。

整個前端技術棧：

- **React 18 + TypeScript** — 型別安全優先，Props 和 State 全部嚴格定義
- **Vite** — 開發體驗快，HMR 幾乎即時
- **Google Maps API** — 地點選擇、路線繪製
- **Google Gemini API** — AI 行程生成核心
- **Apollo Client + GraphQL** — 與後端溝通的資料層
- **dnd-kit** — 拖拉排序行程項目
- **Framer Motion** — 頁面切換與微互動動畫
- **i18next** — 中英文雙語支援

---

## 功能設計的思考過程

### 核心迴圈：輸入 → AI → 地圖

最初的 MVP 設計非常直觀：

1. 使用者在地圖上**點選起點與終點**
2. 填入**天數（1-7 天）、人數（1-10 人）、交通方式、旅遊主題**
3. 點擊「生成行程」，AI 回傳帶有時間、地點、停留時長的行程
4. 行程清單與路線同時在地圖上呈現

聽起來很簡單，但實際開發過程中每個環節都有坑。

### AI 整合：Gemini 的 API 配額問題

AI 這塊是最核心也最棘手的部分。我選用了 Google 的 Gemini API，主要是因為有免費額度可以做 MVP 測試。

遇到的第一個問題是 **429 Rate Limit**。Gemini 免費版的配額非常有限，為此實作了一套 **Model Fallback 機制**：

```typescript
const MODEL_CONFIGS = [
  { name: 'gemini-1.5-flash' },       // 主力，配額壓力較低
  { name: 'gemini-1.5-flash-8b' },    // 備援
  { name: 'gemini-2.0-flash-lite' },  // 備援
  { name: 'gemini-2.0-flash' },       // 備援
]
```

依序嘗試，遇到 429 或 404 就自動切換下一個模型。這個設計讓開發階段幾乎不用擔心配額耗盡的問題。

第二個問題是讓 AI **穩定輸出結構化 JSON**。最初直接使用 `responseMimeType: 'application/json'`，但發現不同模型版本的行為不一致，最後改成在 Prompt 裡明確要求 JSON 格式並加上嚴格的欄位規範，搭配前端的 Retry 與驗證邏輯，才讓輸出穩定下來。

### 地圖整合：Google Maps 的坑

地圖這塊主要靠 `@react-google-maps/api` 這個 React wrapper。

比較有趣的設計決策是 **地圖的雙重模式**：
- 行程生成前：顯示「位置選擇地圖」，讓使用者點選起終點
- 行程生成後：切換成「路線可視化地圖」，用有序的 Polyline 把所有景點連起來

這個切換邏輯放在 `App.tsx` 裡，根據 `state.itinerary.itinerary` 是否存在來決定要渲染哪個地圖元件，簡單明瞭。

### 狀態管理：Context API 的邊界

這個專案的狀態管理選擇了 React 原生的 Context API，而不是 Zustand 或 Redux。

核心的 `PlanningContext` 管理著所有規劃參數與行程狀態：

```
startLocation / destinationLocation
days / numberOfPeople / transportationMode / travelTheme
itinerary: { isGenerating, itinerary, error }
```

以 MVP 規模來說這樣夠用，但如果之後功能繼續擴充（例如多行程管理、協作編輯），Context 的 re-render 問題可能需要認真面對。

---

## 比較有趣的技術細節

### dnd-kit 拖拉排序

行程生成後，使用者可以手動拖拉調整景點順序。這個功能用 `@dnd-kit/sortable` 實作，搭配虛擬列表 `@tanstack/react-virtual` 來處理長行程的效能問題。

dnd-kit 的設計哲學是「無頭（headless）」，樣式完全自定義，比 react-beautiful-dnd 靈活很多，但上手成本稍高，需要自己組合 `DndContext`、`SortableContext`、`useSortable` 等 Hook。

### i18n：中英文雙語

一開始沒預期要做多語言，但考慮到之後可能分享給外國朋友用，就順手加了 `i18next`。語言檔放在 `src/i18n/locales/` 下，分為 `zh-TW.json` 和 `en.json`，搭配 `i18next-browser-languagedetector` 自動偵測瀏覽器語言設定。

### Design System Tokens

雖然這只是個人 Side Project，但還是花時間建了一套簡單的 Design Token：

```
src/design-system/tokens/
  colors.ts
  typography.ts
  spacing.ts
  shadows.ts
  borderRadius.ts
  animation.ts
```

這讓後來調整視覺風格時省了很多力，不用滿專案找散落的顏色值。

---

## 踩到的坑與反思

**Prompt 工程比想像中重要**

讓 Gemini 穩定輸出符合預期格式的 JSON，花的時間遠比串接 API 本身多。Prompt 裡要明確說明輸出格式、每個欄位的型別與意義，以及各種邊界情況的處理方式。這讓我意識到，AI Feature 的品質上限很大程度取決於 Prompt 的品質。

**型別安全帶來的摩擦值得**

全程嚴格使用 TypeScript，初期定義 Interface 確實費時，但在後來改動 API Response 結構時，TypeScript 的編譯錯誤直接幫我找到所有受影響的地方。這個投資在中後期完全值回票價。

**過早優化的誘惑**

中途有一段時間很想把 Context 換成 Zustand、把 CSS-in-JS 換成 Tailwind，但最後還是忍住了，專注在把核心功能做穩。Side Project 最容易死在「一直重構、一直換技術」這個迴圈裡。

---

## 目前狀態與後續規劃

MVP 的核心功能基本完成：

- [x] Google Maps 起終點選擇
- [x] AI 行程生成（Gemini）
- [x] 路線可視化
- [x] 行程拖拉排序
- [x] 行程歷史紀錄
- [x] QR Code 分享
- [x] 中英文雙語

後續想加的功能：

- 行程匯出成 PDF / 圖片
- 多日行程的天數切換視圖
- 真實景點的開放時間與票價資訊整合

---

## 小結

做這個 Side Project 的過程讓我對 AI API 整合有了更實際的認識——它不只是呼叫一個 API 那麼簡單，背後的 Prompt 設計、錯誤處理、Fallback 策略，才是讓功能真正可靠的關鍵。

如果你也有「這個工具怎麼還沒人做」的想法，就動手吧。從零到可以用，沒有想像中那麼遠。

---

*技術棧：React 18 / TypeScript / Vite / Google Maps API / Gemini API / Apollo Client / GraphQL / dnd-kit / Framer Motion / i18next*
