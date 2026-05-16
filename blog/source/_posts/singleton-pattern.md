---
title: 單例模式 Singleton_pattern
date: 2025-07-13 16:16:17
tags: [技術筆記,(作者自學用)]
hidden: true
cover: https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800
---
# 單例模式 (Singleton Pattern)

## 為什麼需要 Singleton？

在開發大型系統時，我們經常會遇到這樣的需求：某些資源應該在整個應用程式中保持唯一性。

舉個實際例子，假設你在開發一個分散式系統，多個模組都需要記錄 Log。如果每個模組都各自創建 Logger 實例：

- Log 訊息會分散在不同的物件中，難以統一管理和追蹤
- 無法維持一致的設定（例如 Log 等級、輸出格式）
- 記憶體中會存在多個相同功能的物件，造成資源浪費

這時候我們希望有一個全域的 Logger 管理者，所有模組都向它發送 Log 訊息。

**Singleton 的核心思想：確保一個類別在整個系統中只有一個實例，並提供全域的存取點。**

## 沒有使用 Singleton 的情況

來看看傳統的實作方式會產生什麼問題：

```python
class Logger:
    def log(self, msg):
        print(f"[LOG] {msg}")

# 模組 A
logger_a = Logger()
logger_a.log("A 模組初始化完成")

# 模組 B
logger_b = Logger()
logger_b.log("B 模組初始化完成")

print("logger_a is logger_b:", logger_a is logger_b)
```

執行結果：
```
[LOG] A 模組初始化完成
[LOG] B 模組初始化完成
logger_a is logger_b: False
```

可以看到，每次實例化都會產生不同的物件，這違背了我們想要統一管理的初衷。

## 使用 Singleton Pattern

接下來實作 Singleton 版本：

```python
class SingletonLogger:
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            print("建立 SingletonLogger 實例")
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def log(self, msg):
        print(f"[LOG] {msg}")

# 在不同模組中使用
logger_a = SingletonLogger()
logger_a.log("A 模組初始化完成")

logger_b = SingletonLogger()
logger_b.log("B 模組初始化完成")

print("logger_a is logger_b:", logger_a is logger_b)
```

執行結果：
```
建立 SingletonLogger 實例
[LOG] A 模組初始化完成
[LOG] B 模組初始化完成
logger_a is logger_b: True
```

可以看到，不論在哪個模組中實例化，都會得到相同的物件參考。

## 實作細節說明

在這個實作中，我們重寫了 `__new__` 方法來控制物件的創建過程：

1. 使用類別變數 `_instance` 來儲存唯一的實例
2. 在 `__new__` 中檢查是否已經存在實例
3. 如果不存在，則創建新實例；如果存在，則回傳現有實例

這種做法確保了無論呼叫多少次建構子，都只會有一個實例存在。

## 適用場景

Singleton 適合用於以下情況：

**建議使用：**
- 日誌系統（Logger）
- 設定檔管理器（Configuration Manager）
- 資料庫連線池（Database Connection Pool）
- 快取管理器（Cache Manager）
- 執行緒池（Thread Pool）

**不建議使用：**
- 一般業務邏輯物件
- 需要多個不同狀態的物件
- 會影響單元測試的情況

## 注意事項

使用 Singleton 時需要注意：

1. **執行緒安全性**：在多執行緒環境中，需要考慮同步問題
2. **測試困難**：Singleton 會在測試之間保持狀態，可能影響測試的獨立性
3. **過度使用**：不要把所有東西都做成 Singleton，這會增加系統耦合度

Singleton 是一個有用的設計模式，但要在適當的場景下使用，避免為了使用設計模式而使用設計模式。

---
