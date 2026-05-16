---
title: 🤖 | 記帳小管家
date: 2025-06-18 12:10:35
tags: [project]
cover: /images/expenses_1.png
---
# 一個結合 React 前端與 Flask 後端的個人記帳專案
> 基於 Flask + React，快速打造可視化、具本地儲存功能的個人記帳工具，部署在 Render 免費平台。
<div id="gallery">
  <a href="/images/expenses_1.png">
    <img src="/images/expenses_1.png" alt="記帳頁面" style="max-width: 600px;">
  </a>
</div>

----------------------------

## 執行目標

希望做出一款簡單的記帳小工具，具有以下功能：

* 支援每日紀錄多筆支出
* 直覺的欄位輸入介面
* 統計支出、圖表呈現
* 可依週切換檢視區間
* 支援本地儲存（localStorage）
* 無須登入註冊，輕量、單機可用

## 技術使用

* **Flask**: Python 後端 Web Framework
* **HTML + React (CDN)**: 前端創建主畫面
* **Babel (CDN)**: 讓我們直接在 HTML 中操作 JSX
* **CSS**: 自定義樣式
* **Render.com**: 免費部署 Platform

### Flask 後端

```python
# python
from flask import Flask, render_template  # 匯入 Flask 框架與頁面渲染函式
import os  # 匯入 os 模組，用於抓取環境變數

app = Flask(__name__)  # 初始化 Flask 應用

@app.route("/")  # 當用戶訪問根目錄 `/` 時
def index():
    return render_template("index.html")  # 回傳前端頁面（templates/index.html）

if __name__ == "__main__":
    # 讓 Flask 可以在本地測試，也能被 Render 部署（抓環境變數 PORT）
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
```
### 前端 HTML + React

```html
<!-- index.html -->
<link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">

<!-- React & Babel CDN -->
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

<!-- Chart.js for data visualization -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- 載入應用程式主程式 -->
<script type="text/babel" src="{{ url_for('static', filename='js/app.js') }}"></script>
```

> React 使用 CDN 形式加載，用 `babel` 直接執行 JSX 程式

## React 應用程式 core
### 資料儲存方式
| 元件            | 功能說明                      |
| ------------- | ------------------------- |
| `App`         | 主控元件，負責整體狀態與資料流處理         |
| `ExpenseForm` | 表單元件，讓使用者輸入支出項目與金額        |
| `ExpenseList` | 顯示當日支出紀錄，並可即時動態更新         |
| `WeeklyChart` | 使用柱狀圖呈現每日支出金額，支援週次切換與點擊查看 |

### 架構設計
* 資料儲存：所有紀錄保存在 localStorage，依照日期分類。
* 畫面互動：輸入資料即時更新列表與圖表，並保留在本地。
* 視覺化統計：使用 Chart.js 呈現每日總支出，支援週次切換與點擊查看。


技術包含：
Python、Flask、HTML、React、Babel、JavaScript、Chart.js、CSS、localStorage、Render.com

## 📝 心得
> 這是一個簡單的 Flask + React 應用，Side Project。


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