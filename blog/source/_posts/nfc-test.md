---
title: 📱 | 用 NFC 讓別人掃你的手機開啟連結 — NFC-test 開發筆記
date: 2026-05-31 20:00:00
tags: [side project, React, NFC, Web API]
cover: https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800
---

# 📱 用 NFC 讓別人掃你的手機開啟連結 — NFC-test 開發筆記

> 不想再傳連結、不想再截圖給別人掃 QR Code，就想直接把手機湊過去——對方的手機一震，連結就開了。這個專案的起點就這麼簡單。

---

## 🎯 專案動機

有時候你想分享一個連結給旁邊的人，最懶的方法是什麼？

- 用 LINE / Messenger 傳 → 還要等對方打開 app
- 截圖 QR Code → 對方還得掃
- 口頭說網址 → 開玩笑嗎

**NFC 才是最懶的方式。** 手機湊近，振動一下，連結直接在對方手機上開啟。

NFC-test 就是這個想法的實驗場：用 React 打造一個 Web App，讓使用者可以輸入任意連結，然後透過 NFC 傳出去，讓旁邊的人掃一下就能開啟。

---

## 🔬 Web NFC API 是什麼

在做這個之前，我以為 NFC 一定要寫 Native App（Android / iOS）才能用。

查了一下才發現有個叫 **Web NFC API** 的東西——直接在瀏覽器裡讀寫 NFC，不需要任何 Native 程式碼。

Web NFC API 提供兩個核心類別：

| 類別 | 用途 |
|------|------|
| `NDEFReader` | 讀取 NFC tag 的資料 |
| `NDEFWriter` | 寫入資料到 NFC tag（舊 API，已合併進 NDEFReader） |

現在的標準是用 `NDEFReader` 同時處理讀寫：

```javascript
const ndef = new NDEFReader();

// 讀取
await ndef.scan();
ndef.addEventListener("reading", ({ message }) => {
  for (const record of message.records) {
    console.log(record.recordType, record.data);
  }
});

// 寫入
await ndef.write({
  records: [{ recordType: "url", data: "https://your-link.com" }]
});
```

### 限制要先知道

Web NFC API **不是所有瀏覽器都支援**，使用前要有心理準備：

- ✅ **Android Chrome** — 支援
- ❌ **iOS Safari / Chrome for iOS** — 不支援（Apple 沒開放）
- ❌ **桌機瀏覽器** — 不支援
- ⚠️ **需要 HTTPS** — HTTP 環境下 API 直接不存在
- ⚠️ **需要使用者手勢觸發** — 不能在頁面載入時自動執行，必須在 click event 內呼叫

---

## 🛠️ 技術棧

專案架構刻意保持簡單，就是個小工具：

- **React** — 前端框架
- **Web NFC API** — 瀏覽器原生，零套件依賴
- **Vite** — 開發環境

---

## ⚙️ 核心實作

### 封裝成 Custom Hook

把 NFC 邏輯抽出來，讓元件保持乾淨：

```javascript
function useNFC() {
  const [status, setStatus] = useState("idle"); // idle | writing | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const isSupported = "NDEFReader" in window;

  const writeURL = async (url) => {
    if (!isSupported) {
      setErrorMsg("此瀏覽器不支援 Web NFC，請使用 Android Chrome");
      setStatus("error");
      return;
    }

    try {
      setStatus("writing");
      const ndef = new NDEFReader();
      await ndef.write({
        records: [{ recordType: "url", data: url }],
      });
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  };

  return { writeURL, status, errorMsg, isSupported };
}
```

### 主畫面元件

```jsx
function App() {
  const [url, setUrl] = useState("");
  const { writeURL, status, errorMsg, isSupported } = useNFC();

  return (
    <div className="container">
      <h1>📱 NFC 連結分享</h1>

      {!isSupported && (
        <p className="warning">⚠️ 請使用 Android Chrome 開啟此頁面</p>
      )}

      <input
        type="url"
        placeholder="輸入你要分享的連結"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={() => writeURL(url)} disabled={status === "writing"}>
        {status === "writing" ? "請將手機靠近 NFC tag..." : "寫入 NFC"}
      </button>

      {status === "success" && <p className="success">✅ 寫入成功！</p>}
      {status === "error" && <p className="error">❌ {errorMsg}</p>}
    </div>
  );
}
```

### 流程圖

```
使用者輸入 URL
      ↓
點擊「寫入 NFC」按鈕
      ↓
NDEFReader.write() 呼叫
      ↓
手機靠近 NFC tag（貼紙/卡片）
      ↓
寫入成功 → 對方掃 tag → 自動開啟連結
```

---

## 📸 Demo

<!-- TODO: 將截圖放到 source/images/ 並替換下方路徑 -->
<!-- 建議命名：nfc-test-main.png、nfc-test-success.png -->

![NFC-test 主畫面](/images/nfc-test-main.png)

![寫入成功畫面](/images/nfc-test-success.png)

---

## 🪲 遇到的問題

### 1. HTTPS 才能用

本機開發時用 `http://localhost` 沒問題，但一旦要在真機測試就必須是 HTTPS。

用 Vite 的話，在 `vite.config.js` 開啟 HTTPS 模式，或是直接部署到 GitHub Pages / Netlify 這類有 HTTPS 的平台測試。

### 2. 必須等使用者點擊才能呼叫

這個限制最一開始沒注意到，寫了個頁面載入後自動呼叫 `ndef.write()` 的邏輯，結果一直丟 `SecurityError`。

Web NFC API 要求 **User Activation**，也就是一定要在使用者觸發的事件（click、touchstart 等）的 call stack 裡面才能呼叫。改成 `onClick` 之後就正常了。

### 3. iOS 完全不支援

沒有辦法，Apple 就是不開放 Web NFC。如果要支援 iOS，只能轉向 React Native + `react-native-nfc-manager`，或是用 QR Code 作為備援。

目前的 workaround：偵測 `"NDEFReader" in window`，iOS 使用者顯示提示說「請用 Android Chrome」或提供 QR Code 替代。

---

## 💡 NFC 還能拿來做什麼

做完這個小工具，腦子裡開始跑各種應用場景：

- **名片 NFC 化** — 把個人網站 / LinkedIn 寫進 NFC tag，附在名片上
- **桌遊活動簽到** — 每個座位貼一張 NFC tag，坐下來掃一下自動簽到
- **實體店促銷** — 貼紙放在產品旁邊，掃了跳到優惠頁
- **家裡的自動化捷徑** — 玄關貼一張 tag，進門掃一下觸發 Home Automation

NFC tag 貼紙超便宜（一張幾塊錢），加上 Web NFC 不需要 Native App，進入門檻比想像中低很多。

---

## 📌 小結

這個專案出發點很小，就是「想讓手機湊近就能分享連結」。但做的過程讓我對 Web NFC API 的能力與限制有了第一手認識。

幾個值得記住的點：

1. **Web NFC = Android Chrome Only**，iOS 繞不過去
2. **必須 HTTPS + User Gesture**，這兩個是硬限制
3. **NDEFReader 可同時讀寫**，API 設計比想像中直覺
4. **NFC tag 很便宜**，玩起來成本很低

如果你也對「實體世界 ×  Web」的互動有興趣，Web NFC 是個很值得玩的 API。

---

► 「 [GITHUB](https://github.com/reedlin2002/NFC-test) 」

---

*技術棧：React / Vite / Web NFC API (NDEFReader)*
