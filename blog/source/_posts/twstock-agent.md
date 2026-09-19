---
title: 📈 | 010401 Finance 台股 AI 分析助手
date: 2026-07-19 12:59:38
tags: [project]
cover: /images/twstock-agent-cover.jpg
---
# 🚀 010401 Finance - 把台股研究壓縮成一次查詢的 AI 分析 App

> 一款面向台股投資人的 AI 分析 App。把股價走勢、技術指標、法人籌碼、風險控管與 AI 摘要整合在同一個畫面,輸入股票代號,就能得到一份可閱讀、可追蹤、可行動的分析報告。

►  「 [GITHUB](https://github.com/reedlin2002/twstock-agent) 」

> ⚠️ 本專案提供投資研究與資料整理輔助,不構成任何買賣建議或投資邀約。實際交易前請自行判斷風險。

---

## 💡 專案緣起

研究一檔台股,散戶通常要開一堆分頁:看線圖一個網站、查三大法人一個網站、翻新聞又一個網站,最後還要自己在腦中把這些資訊拼起來。這個專案想把「找資料、看技術線、看籌碼、整理觀點」壓縮成一次查詢:

- 輸入 `2330` 或公司名稱,自動抓價格、算指標、補籌碼
- 技術分析不只畫線,還轉成可執行的檢查表與買賣計畫
- AI 只根據 App 整理好的結構化資料寫報告,降低幻覺
- Web 與行動端同一套程式碼,可打包成 Android App

核心理念是:**不是只問 AI,而是先有資料再問 AI**。AI 的角色是研究助理,不是憑空說故事的分析師。

---

## 🛠️ 專案技術

🟢 前端核心
> 框架:React 18 + Vite 6
圖表:Recharts(價格走勢、籌碼柱狀圖)
圖示:lucide-react

🟡 資料來源
> Yahoo Finance:近兩年日線價格、開高低收、成交量
FinMind:三大法人買賣超、融資融券、台股公司清單
Google News RSS / PTT 股板:即時新聞與鄉民風向(選配)

🟣 AI 分析
> OpenRouter API(可換模型),採資料驅動 prompt
Vite dev server 內建 API proxy,統一處理 CORS 與金鑰

🟠 行動端
> Capacitor 8:Android 打包、本地推播、背景任務
到價提醒、自選股資料存在裝置端 localStorage

---

## 📱 功能導覽

以下畫面都是用行動裝置尺寸實際操作 App 的截圖。

### 自選股儀表板

打開 App 首頁就是自選股儀表板:每一檔顯示迷你走勢、動能訊號燈(偏多/偏空/中性)、現價與漲跌幅,持有中的部位還會直接顯示未實現損益。

<div id="gallery">
  <a href="/images/twstock-agent-home.png">
    <img src="/images/twstock-agent-home.png" alt="自選股儀表板" style="max-width: 320px;">
  </a>
</div>

### 個股分析頁

輸入代號查詢後,最上方是股價摘要卡:現價、漲跌、產業別,以及一句由 AI 根據技術面與籌碼面生成的重點摘要。也可以從這裡收藏自選股、寫個人持股紀錄、複製整份報告。

<div id="gallery">
  <a href="/images/twstock-agent-analysis-top.png">
    <img src="/images/twstock-agent-analysis-top.png" alt="個股分析頁" style="max-width: 320px;">
  </a>
</div>

### 走勢圖 + 買賣計畫 Overlay

這是我最喜歡的功能:買賣計畫不是一段文字,而是直接疊在走勢圖上——買點區、停損線、目標價都畫在圖上,和月線 MA20、季線 MA60 放在一起看。圖下方的計畫卡會給出明確狀態(進場/觀望/先不要碰),搭配觀察買點、突破參考、停損與分批停利價位。

所有價位都對齊台股最小升降單位(tick),不會算出掛不出去的價格。

<div id="gallery">
  <a href="/images/twstock-agent-chart.png">
    <img src="/images/twstock-agent-chart.png" alt="走勢圖與買賣計畫" style="max-width: 320px;">
  </a>
</div>

### AI 深入分析

AI 報告分成幾個區塊:買點條件觀察、**個人化進出場**(如果有填持股紀錄,會根據你的成本價與部位計算報酬率、安全距離與建議動作)、五大面向分析(基本面/技術面/籌碼面/消息面/產業)、風險提示,以及引用的新聞來源清單。

<div id="gallery">
  <a href="/images/twstock-agent-ai.png">
    <img src="/images/twstock-agent-ai.png" alt="AI 深入分析" style="max-width: 320px;">
  </a>
</div>

### 趨勢檢查表與進場訊號

「詳細數據」抽屜把技術分析轉成逐項打勾的檢查表:

- **趨勢結構**(Weinstein 階段分析 + Minervini 趨勢樣板):站上季線/半年線、均線多頭排列、年線上彎、距 52 週高低點位置
- **進場訊號**(O'Neil 突破框架 + 台股常用轉折):KD 低檔黃金交叉、站回季線、帶量突破前高、MACD 翻多

<div id="gallery">
  <a href="/images/twstock-agent-checklist.png">
    <img src="/images/twstock-agent-checklist.png" alt="趨勢結構檢查表" style="max-width: 320px;">
  </a>
</div>

### 法人籌碼

FinMind 的籌碼資料整理成柱狀圖與統計卡:三大法人每日買賣超、外資/投信/自營商近 5 日合計、融資融券餘額與增減,下方還有一句白話的籌碼解讀。

<div id="gallery">
  <a href="/images/twstock-agent-chips.png">
    <img src="/images/twstock-agent-chips.png" alt="法人籌碼" style="max-width: 320px;">
  </a>
</div>

---

## 🧠 AI 分析流程:先有資料,再問 AI

整個分析採用資料驅動流程,AI 拿到的不是股票代號,而是 App 已經算好的結構化資料:

1. 使用者輸入股票名稱或代號
2. App 解析台股代號(`.TW` / `.TWO` 自動判斷)
3. 抓取 Yahoo Finance 價格與 FinMind 籌碼資料
4. 前端本地計算技術指標:MA20/60/120/240、KD、MACD、RSI、ATR14、52 週高低點
5. 跑趨勢檢查與觸發訊號,產生交易計畫(進場區間、停損、2R/3R 停利)
6. 組成 `providedData` 交給 AI,AI 只根據提供的資料寫報告
7. App 解析回覆的結構化區塊,分區顯示在畫面上

停損的取法也有講究:取「近 20 日低點、季線 ×0.98、觀察區上緣 ×0.92」中最接近價格的支撐,並確保與假設買價至少相隔 1×ATR 或 3%——太近就放寬停損,而不是把目標灌大,讓 2R/3R 名實相符。

---

## 📲 LINE 整合

除了 App 本體,專案也接上了 LINE 官方帳號:透過 webhook + LIFF 可以在 LINE 裡管理觀察清單,每天定時收到自選股的分析摘要,以 Flex 卡片呈現重點價位與訊號,還會追蹤 AI 過去的看法戰績、在觀點被推翻時主動提醒。

---

## 🔧 其他周邊

- **Python 報告產生器**:`python/taiwan_stock_agent.py 2330` 一行指令產出含 K 線、均線、KD、MACD 的單檔 HTML 分析報告
- **Android 打包**:`npm run android:apk` 一鍵走完 Vite build → Capacitor sync → Gradle assemble

---

## ⚠️ 重要聲明

本 App 產生的內容只供研究、學習與資訊整理使用。技術指標與 AI 分析都可能失準,任何買進、賣出、停損或停利決策,皆應由使用者自行負責。
