---
title: 關於 Lin
description: Lin 的技術實作與作品：跨平台 App、電腦視覺，以及 AI 輔助開發。
---

<style>
.lin-about { max-width: 960px; margin-inline: auto; }
.lin-about h2, .lin-about h3 { border: 0 !important; padding-left: 0 !important; color: inherit !important; }
.lin-about h2::before, .lin-about h2::after, .lin-about h3::before, .lin-about h3::after { display: none !important; }
.lin-about .about-intro { padding: 20px 0 32px; }
.lin-about .about-intro h2 { margin: 0 0 20px; font-size: clamp(28px, 6vw, 42px); line-height: 1.3; }
.lin-about .about-intro p { max-width: 65ch; font-size: 17px; line-height: 1.9; }
.lin-about .about-section { border-top: 1px solid currentColor; padding: 30px 0; }
.lin-about .about-section h2 { margin-top: 0; }
.lin-about .about-section h3 { margin-top: 26px; }
.lin-about .about-links { display: flex; flex-wrap: wrap; gap: 12px 24px; margin: 20px 0 0; }
.lin-about .about-links a { display: inline-flex; align-items: center; min-height: 44px; text-underline-offset: 5px; }
.lin-about .about-image { width: 100%; height: auto; margin: 24px 0 12px; border-radius: 4px; }
.lin-about .about-caption, .lin-about .about-stack { font-size: 13px; line-height: 1.7; }
.lin-about .about-project { padding: 22px 0; }
.lin-about .about-project + .about-project { border-top: 1px solid currentColor; }
.lin-about .about-project h3 { margin: 0 0 10px; }
.lin-about .about-project p { margin: 0 0 10px; }
@media (max-width: 500px) { .lin-about .about-section { padding: 24px 0; } .lin-about .about-intro p { font-size: 16px; } }
</style>

<div class="lin-about">
<section class="about-intro" id="intro">

## 你好，我是 Lin

我做跨平台 App，也做電腦視覺與 AI 相關的實作。從需求釐清、介面開發到原生能力整合、問題排查與版本發布，我在意的是功能能不能解決問題，以及之後能不能持續維護。

這裡整理我的作品、技術筆記與設計取捨。除了記下怎麼做，我也想說清楚為什麼這樣做，以及方法有哪些限制。

<nav class="about-links" aria-label="關於頁章節"><a href="#practice">技術實作</a><a href="#research">研究專題</a><a href="#selected-projects">精選作品</a><a href="/archives/">所有文章</a></nav>
</section>

<section class="about-section" id="practice">

## 技術實作

### 跨平台 App 與原生整合

使用 React、TypeScript、Vite 與 Capacitor 開發 Android／iOS App，串接 GraphQL API，處理 Deep Link、推播通知與 NFC 等原生能力。遇到平台差異時，先用小型 Prototype 驗證，再決定正式流程。

### 電腦視覺與資料處理

使用 Python、OpenCV 與 PyTorch 處理影像資料，涵蓋標註整理、資料增強、模型微調與評估。實作過 Detectron2／CenterMask2 的實例分割流程，也關注模型在不同影像條件下的表現。

### AI 工具與軟體工程

使用 Claude Code、Codex、MCP 與 Skills 輔助開發，持續整理規格驅動開發的工作方式。重點是讓需求、實作與驗證對得起來，讓產生的程式碼能被理解與維護。

</section>

<section class="about-section" id="research">

## 研究專題

### 海灘垃圾自動監測

以 UAV 空拍影像建立海灘垃圾監測流程，透過 CenterMask2 辨識保麗龍、寶特瓶、木材、浮標與浮球，再依團隊的量化方法呈現海灘清潔指數（CCI）與塑膠豐度指數（PAI）。

我參與影格擷取、影像取樣與 OpenCV 全景拼接，整理與標註資料，實作少數類別的資料增強，並進行模型微調、評估與結果視覺化。

<img class="about-image" src="/images/beach-litter-monitoring-output.jpg" alt="海灘全景影像上的垃圾實例分割結果" loading="lazy">
<p class="about-caption">專題系統的實際輸出，取自專題論文。</p>
<div class="about-links"><a href="/2026/11/17/beach-litter-monitoring/">專題介紹</a><a href="/2026/08/23/uav-vision-notes/">技術筆記</a></div>

</section>

<section class="about-section" id="selected-projects">

## 精選作品

<div class="about-project">

### 智慧旅程規劃

以地圖編輯行程。AI 產生初稿後，加入景點時列出多繞時間較少的插入位置，預覽確認才套用，也能復原。

<p class="about-stack">React · TypeScript · MapLibre GL</p>
<div class="about-links"><a href="/2026/09/28/smart-trip-planner/">設計與實作</a></div>
</div>

<div class="about-project">

### mien

GitHub 個人頁 README 的視覺化編輯器。用拖拉小工具的方式排版，再複製產生的內容。

<p class="about-stack">React · TypeScript · GitHub Actions</p>
<div class="about-links"><a href="https://mien.kanewolf98.workers.dev/">試用 mien</a></div>
</div>

<div class="about-project">

### UrlHealthMonitor

網站可用性與回應時間監控。由背景服務定時檢查並存入 SQLite，搭配 xUnit 測試與 Docker 部署。

<p class="about-stack">.NET · SQLite · Docker</p>
<div class="about-links"><a href="/2025/07/05/UrlHealthMonitor/">設計與實作</a></div>
</div>

<div class="about-links"><a href="/#projects">更多作品</a></div>
</section>

<section class="about-section">

## 目前關注

- **模型的跨環境穩定性**：除了單一資料集的結果，也想理解拍攝高度、物件尺寸與背景變化如何影響辨識。
- **可驗證的 AI 開發流程**：把需求寫清楚，建立合適的檢查方式，再讓工具協助實作。
- **介面與系統的取捨**：從使用情境出發，用 Prototype 釐清平台能力與操作流程。

相關實作與學習過程會持續整理在[技術文章](/archives/)裡。

</section>
</div>
