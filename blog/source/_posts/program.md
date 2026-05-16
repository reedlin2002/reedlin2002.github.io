---
title: 📕 | PDF Reader
date: 2025-06-09 21:10:31
tags: [project]
cover: https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800
---

# PDF Reader

> 這是一個利用 RAG（Retrieval-Augmented Generation），做的 PDF 閱讀工具，方便從 PDF 文件中查詢資訊。

---


## 技術架構

- 使用 Streamlit 做前端互動頁面，讓使用者上傳 PDF 並輸入問題。
- 使用 PyPDF2 讀取 PDF 內容，jieba 進行分段。
- 使用 SentenceTransformer 將文本轉成向量，再用 FAISS 建立向量搜尋索引。
- 利用 Hugging Face 中文問答模型，從搜尋到的相關段落中找答案。
- 將答案與參考段落顯示給使用者。

RAG 技術透過檢索（Retrieval）+ 增強上下文（Augmentation）+ 生成回答（Generation）三步驟，讓模型根據提供的內容產出準確的答案。

---

## 🧩 RAG 流程 (簡易)

```
提問 → 檢索相關內容 → 合併為上下文 → 模型生成回答
```

### 1. Retrieval（檢索）

* 將 PDF 切成段落並建立向量表示（TF-IDF 或 embedding）
* 使用 cosine similarity 找出與問題最相關的段落

### 2. Augmentation（增強）

* 將相關段落合併成上下文內容
* 與問題一起輸入給模型

### 3. Generation（生成）

* 使用 Hugging Face 的中文 QA 模型回答問題

---

## 系統流程圖

```
[PDF 上傳] → [文字解析] → [中文分段]
                        ↓
           [段落向量化（TF-IDF）]
                        ↓
         [使用者提問 → 問題向量化]
                        ↓
         [計算相似度 → 取前 3 段]
                        ↓
        [合併上下文 + question]
                        ↓
         [丟進 HuggingFace QA 模型]
                        ↓
                 [產生回答]
```

---

## 程式

```python
# 建立段落的 TF-IDF 向量庫
chunk_vectors = vectorizer.fit_transform(chunks)

# 將使用者問題向量化
query_vec = vectorizer.transform([user_question])

# 計算問題與各段落相似度
similarities = cosine_similarity(query_vec, chunk_vectors)[0]

# 取得前三個最高相似度段落索引
top_indices = similarities.argsort()[-3:][::-1]

# 聚合成上下文
top_chunks = [chunks[i] for i in top_indices]
context = "\n".join(top_chunks)

# 丟給問答模型產生答案
result = qa_pipeline({"question": user_question, "context": context})

```

技術包含：  
Python、Streamlit、PyPDF2、jieba、SentenceTransformers、FAISS、Hugging Face Transformers

## 📝 心得
> **備註**：這個程式是我學習 RAG 技術的初步嘗試，所以還有很多能夠優化的地方，請多指教。