---
title: 🌐 | 網站健康監控平台
date: 2025-07-05 21:44:35
tags: [project]
cover: /images/monitor.png
---
# 🚀 .NET URL Health Monitor - 以 Docker 部署的網站監控服務

> 這是一個基於 .NET 8 的 URL 健康檢查服務，提供即時監控結果與可視化儀表板，支援 Docker 容器化部署。

►  「 [GITHUB](https://github.com/reedlin2002/UrlHealthMonitor) 」

---

## 💡 專案緣起

在現代化的網站運維中，服務的可用性監控至關重要。在日常網站維運中，我們常需要定期檢查多個 URL 的可用性，並記錄歷史狀態供追蹤。本專案希望：

- 自動化監控：每 30 秒自動檢查所有註冊的 URL
- 視覺化儀表板：以簡易 Web UI 呈現最近監控結果
- 簡易管理：CLI 指令快速管理監控清單、使用 SQLite 儲存歷史資料
- 提供容器化部署：Docker 一鍵部署，跨平台支援

---

## 🛠️ 專案技術

🟢 後端核心
> 框架：.NET 8 Worker Service + ASP.NET Minimal API
語言：C#（Async/Await + 依賴注入）
資料庫：SQLite 輕量級資料庫

🟡 測試與品質
> 測試框架：xUnit + FluentAssertions
開發方法：採用 TDD 思維

🟣 前端
> 介面：簡易 Web Dashboard
技術：HTML5 + CSS3 + Vanilla JavaScript


🟠 部署運維
> 容器化：Docker
環境支援：Linux / Windows / macOS

---

## ⚙️ 執行方式

### 開發模式 (本機執行)

```
dotnet run -- add <URL>       # 新增要監控的 URL
dotnet run -- list            # 列出所有 URL
dotnet run -- remove <ID>     # 移除指定 URL
dotnet run -- serve           # 啟動 Web UI
```

打開 http://localhost:5000 查看 Dashboard。

### Docker 部署


```
# 建置映像
docker build -t urlhealthmonitor .
```

```
# 執行容器
docker run -d -p 5001:5000 --name urlhealthmonitor urlhealthmonitor
```

打開 http://localhost:5001 查看 Dashboard。

---

## 🌐 實際示範

<div id="gallery">
  <a href="/images/UrlHealthMonitor-01.png">
    <img src="/images/UrlHealthMonitor-01.png" alt="記帳頁面" style="max-width: 600px;">
  </a>
</div>


---

## 🧪 TDD 測試

### 測試
```
dotnet test
```

測試範圍：
- HTTP 請求狀態檢查
- 超時處理
- 資料庫操作

---

## 🚀 未來擴展

- RESTful API 支援
- 整合通知 (EMAIL / LINE)
- 監控數據視覺化

---

技術與應用方法：
.NET 8、C#（Async/Await + 依賴注入）、SQLite、xUnit + FluentAssertions（TDD 開發流程）、Docker、HttpClient（網站監控）、CLI 、JavaScript + HTML/CSS

## 📝 心得
> 針對TDD、HTTP協議這兩個技術練習了這個「HTTP狀態碼偵測器」，在撰寫程式碼的過程中因為使用的是很久沒碰的 C# 一開始確實有些生疏，經常忘記變數宣告的語法規則，但隨著練習逐漸找回手感。在Docker部屬上，常常遇到檔案不知道放哪裡的問題，不過經過一番ChatGPT的協助和一番研究也是弄好了～也靠著TDD學會了更可靠的程式碼，先用測試再寫功能，確保程式碼符合預期，減少BUG，培養良好的開發習慣


<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lightgallery-bundle.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/lightgallery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/plugins/zoom/lg-zoom.min.js"></script>
<script>
  lightGallery(document.getElementById("gallery"), {
    plugins: [lgZoom],
    speed: 300,
    zoom: true
  });
</script>