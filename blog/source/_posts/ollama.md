---
title: 🧠 | 聊天機器人
date: 2025-06-25 23:43:59
tags: [project]
cover: /images/ollama.png
---
#  用 Ollama + LangChain 打造本地 AI 工具型 Agent（含 RAG 文件問答）

> 這是一個我為了學習與實驗所做的小型 side project，目的是了解如何在本地端結合 LLM、LangChain 工具框架與 RAG（檢篩式問答）系統，實作出一個能夠回答問題、查天氣、計算數學，甚至查詢本地知識檔案的智能助手。

---

## 🔧 專案目標

> ✫️ 建立一個 AI 助手系統，具備：

* 多工具整合能力（如計算器、天氣查詢）
* 基於本地文字檔的知識問答功能（RAG）
* 使用自己裝好模型的 Ollama + LangChain Agent 結構

---

## 系統流程圖

```mermaid
使用者輸入問題
    ↓
判斷是否需呼叫工具？
    ↓
【需要工具的流程】                                           【不需要工具的流程】
LangChain Agent 分析                 直接呼叫 LLM → LLM 生成回答 → 輸出結果給使用者
    ↓
選擇對應 Tool
    ├ Calculator Tool
    │
    ├ Get Weather Tool  
    │
    └ RAG Tool
        ├ TextLoader 載入檔案
        ├ Text Splitter 切段
        ├ HuggingFaceEmbeddings 向量化
        └ FAISS 向量資料庫檢索
    ↓
Ollama LLM (Mistral)
    ↓
生成回答
    ↓
輸出結果給使用者

```

---

## 套件與技術

| 技術                                      | 用途               |
| --------------------------------------- | ---------------- |
| [LangChain](https://www.langchain.com/) | 組合 Agent 與工具     |
| [Ollama](https://ollama.com/) (Mistral) | 本地執行的大語言模型       |
| `Tool` (LangChain)                      | 包裝可被 Agent 呼叫的功能 |
| `RetrievalQA`                           | 建立基於文字檔的問答鏈      |
| `FAISS`                                 | 高效的向量資料庫         |
| `HuggingFaceEmbeddings`                 | 將文本轉換為向量的埋入模型    |
| `TextLoader`, `CharacterTextSplitter`   | 處理本地文件內容         |

---

### 核心程式

```python
# ⭐️ LLM 模型（使用 Ollama + Mistral）
llm = OllamaLLM(model="mistral")

# ⭐️ 建立工具：Calculator / Get Weather
def calculator(query): return str(eval(query))
def get_weather(city): return {"台北":"晴天30度"}.get(city, "查無資料")

# ⭐️ RAG 工具：透過 FAISS 向量庫查詢本地 data.txt
def build_rag_tool():
    loader = TextLoader("data.txt")
    docs = loader.load()
    splits = CharacterTextSplitter(chunk_size=500).split_documents(docs)
    embeddings = HuggingFaceEmbeddings()
    vectorstore = FAISS.from_documents(splits, embeddings)
    retriever = vectorstore.as_retriever()
    rag_chain = RetrievalQA.from_chain_type(llm, retriever=retriever)
    return Tool(name="rag_tool", func=rag_chain.run, description="查詢本地知識文件")
```

### 整合 Tool 與 Agent

```python
tools = [
    Tool.from_function("calculator", calculator, "數學計算"),
    Tool.from_function("get_weather", get_weather, "天氣查詢"),
    build_rag_tool()
]

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent_type=AgentType.CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    handle_parsing_errors=True,
    verbose=False
)
```

---

## 測試

### 查詢天氣：台北

```bash
❓請輸入問題：查台北天氣
🧩 使用 [Agent] 處理中...

Action: get_weather
Action Input: 'Taipei'
Observation: 晴天，30 度
Final Answer: 晴天，30 度
```

<div id="gallery1">
  <a href="/images/ollama-Taipei.png">
    <img src="/images/ollama-Taipei.png" alt="查詢天氣：台北" style="max-width: 600px;">
  </a>
</div>

---

### 查詢天氣：高雄

```bash
❓請輸入問題：高雄幾度

Action: get_weather
Action Input: '高雄'
Observation: 小雨，27 度
Final Answer: 高雄今天是小雨且27度。
```
<div id="gallery2">
  <a href="/images/ollama-KAO.png">
    <img src="/images/ollama-KAO.png" alt="查詢天氣：高雄" style="max-width: 600px;">
  </a>
</div>

---

### 數學運算

```bash
❓請輸入問題：12 * 3 + 5 是多少？

Action: calculator
Action Input: '12 * 3 + 5'
Observation: 45
Final Answer: 結果為45。
```

<div id="gallery3">
  <a href="/images/ollama-math.png">
    <img src="/images/ollama-math.png" alt="數學運算" style="max-width: 600px;">
  </a>
</div>

---

### 問文件內容

```bash
❓請輸入問題：文件內容有提到什麼？

Action: rag_tool
Observation: 文件提到了台灣、台北、自然風景、語言（台語、閩南語、客家話）、夜市與珍珠奶茶等。
Final Answer: 這份文件提到了台灣、台北、自然風景、文化與語言、以及夜市文化。
```

<div id="gallery4">
  <a href="/images/ollama-RAG.png">
    <img src="/images/ollama-RAG.png" alt="問文件內容" style="max-width: 600px;">
  </a>
</div>

---

### 自然對話

```bash
❓請輸入問題：你好

💬 使用 LLM 直接回答...
🤖 回答：您好！讓我有幸為您提供服務。如果您有任何問題，請隨時告知，我會盡力幫助您解決。
```

<div id="gallery5">
  <a href="/images/ollama-LLM.png">
    <img src="/images/ollama-LLM.png" alt="自然對話" style="max-width: 600px;">
  </a>
</div>

---

## 📁 結構

```
my-ollama/
│
├── main.py
├── data.txt       ← 本地知識庫文字檔
├── .venv/         ← 虛擬環境
├── requirements.txt
```

---


技術包含：  
Python、LangChain、Ollama、Mistral 模型、FAISS、HuggingFace Embeddings、RetrievalQA、自訂工具函數（Calculator、Get Weather）

## 📝 心得
> 第一次接觸LLM、LangChain、Agent 花了2、3天完成這個小應用。
這個 project 幫助我：

* 熟悉 LangChain 中 Tool/Agent 的用法
* 練習本地模型 Ollama 的載入與使用
* 理解 RAG 的流程從文件切分到檢篩的設計邏輯

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/css/lightgallery-bundle.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/lightgallery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lightgallery@2.7.1/plugins/zoom/lg-zoom.min.js"></script>
<script>
    lightGallery(document.getElementById("gallery1"), {
    plugins: [lgZoom],
    speed: 300,
    zoom: true
    });
    lightGallery(document.getElementById("gallery2"), {
    plugins: [lgZoom],
    speed: 300,
    zoom: true
    });
    lightGallery(document.getElementById("gallery3"), {
    plugins: [lgZoom],
    speed: 300,
    zoom: true
    });
    lightGallery(document.getElementById("gallery4"), {
    plugins: [lgZoom],
    speed: 300,
    zoom: true
    });
    lightGallery(document.getElementById("gallery5"), {
    plugins: [lgZoom],
    speed: 300,
    zoom: true
    });
</script>