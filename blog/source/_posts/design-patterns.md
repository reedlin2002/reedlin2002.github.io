---
title: 設計模式 (Software design pattern) 
date: 2025-07-12 14:36:56
tags: [技術筆記,(作者自學用)]
cover: /images/design_pattern.png
---
# Python 設計模式

這篇文章紀錄四種我學習過的 Python 設計模式，包含簡單範例、使用情境與心得。

> **四種模式**
> 1. 單例模式 (Singleton)
> 2. 工廠模式 (Factory)
> 3. 策略模式 (Strategy)
> 4. 觀察者模式 (Observer)

---

## 🟢 單例模式 Singleton Pattern

### 概念
確保一個類別在全程只存在唯一一個實例。

### 使用情境
- 設定檔管理
- 資源共用 (e.g., 日誌 Logger)
- 全域狀態控制

### 範例程式碼
```python
class SingletonLogger:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            print("建立 SingletonLogger 實例")
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        print("執行 __init__()")

# 測試
log1 = SingletonLogger()
log2 = SingletonLogger()
print("log1 is log2:", log1 is log2)
```

執行輸出
```scss
建立 SingletonLogger 實例
執行 __init__()
執行 __init__()
log1 is log2: True
```
> 在單例模式中，第一次建立 SingletonLogger() 時，會產生唯一一個「全域實例」。
後面不管呼叫幾次 SingletonLogger()，都會回傳同一個物件，記憶體位置完全相同。
也就是說：
整個程式只會有一個 Logger，大家共用這個唯一的「盒子」。

---

## 🟢 工廠模式 Factory Pattern
### 概念
將「建立物件的邏輯」抽離到工廠方法，統一管理實例化流程。

### 使用情境
* 根據參數決定建立哪個子類別
* 解耦「建立物件」與「使用物件」

### 範例程式碼
```python
class Dog:
    def speak(self):
        return "Woof"

class Cat:
    def speak(self):
        return "Meow"

class AnimalFactory:
    animal_classes = {
        "dog": Dog,
        "cat": Cat
    }

    @staticmethod
    def create_animal(animal_type):
        if animal_type in AnimalFactory.animal_classes:
            return AnimalFactory.animal_classes[animal_type]()
        else:
            raise ValueError("未知的動物種類")

# 測試
animal = AnimalFactory.create_animal("dog")
print(animal.speak())
```
執行輸出
```scss
Woof
```
> 在工廠模式中，每次呼叫 AnimalFactory.create_animal()，都會根據你給的參數，產生一個新的動物物件。
同一種動物（例如 Dog）呼叫多次，也會創建多個不同的 Dog 實例，彼此互不影響。
也就是說：
工廠就像流水線，每次都造出新的產品，產品彼此獨立。

---

## 🟢 策略模式 Strategy Pattern
### 概念
將「行為策略」封裝為獨立類別，執行時依據情境決定要用哪個策略。

### 使用情境
* 動態切換演算法
* 行為多樣化的系統
```python
class Strategy:
    def execute(self, data):
        pass

class UpperCaseStrategy(Strategy):
    def execute(self, data):
        return data.upper()

class LowerCaseStrategy(Strategy):
    def execute(self, data):
        return data.lower()

class Context:
    def __init__(self, strategy):
        self.strategy = strategy

    def set_strategy(self, strategy):
        self.strategy = strategy

    def execute_strategy(self, data):
        return self.strategy.execute(data)

# 測試
context = Context(UpperCaseStrategy())
print(context.execute_strategy("Hello Strategy"))

context.set_strategy(LowerCaseStrategy())
print(context.execute_strategy("Hello Strategy"))
```
執行輸出
```scss
HELLO STRATEGY
hello strategy
```

> 在策略模式中，每次 CreditCardPayment() 都會建立一個新的「策略物件」，
ShoppingCart() 也每次產生一個新的購物車，
不會共用同一個實例，也就是說：
策略物件和購物車都是獨立的！
---

## 🟢 觀察者模式 Observer Pattern
### 概念
當主題狀態改變時，自動通知所有依賴它的觀察者。

### 使用情境
* 事件通知
* 資料監聽
* 訂閱/發布系統

### 範例程式碼
```python 
class Observer:
    def update(self, message):
        pass

class User(Observer):
    def __init__(self, name):
        self.name = name

    def update(self, message):
        print(f"{self.name} 收到通知: {message}")

class ChatRoom:
    def __init__(self):
        self.observers = []

    def add_observer(self, observer):
        self.observers.append(observer)

    def notify_observers(self, message):
        for observer in self.observers:
            observer.update(message)

# 測試
chat_room = ChatRoom()
user1 = User("小明")
user2 = User("小美")

chat_room.add_observer(user1)
chat_room.add_observer(user2)

chat_room.notify_observers("今天有新活動！")
```
執行輸出
```scss
小明 收到通知: 今天有新活動！
小美 收到通知: 今天有新活動！
```
> 在觀察者模式中，每次 User() 都會建立一個新的「觀察者物件」，
ChatRoom() 也可以建立多個聊天室，彼此沒有關聯。
當聊天室呼叫 notify_observers() 時，會通知它自己「清單裡的觀察者」。
也就是說：
每個聊天室都維護自己的訂閱清單，觀察者和主題都是獨立物件，沒有共享同一個實例。

---

## ✨ 小結
這四種模式是物件導向程式設計中最經典的設計模式：
* 單例：只有一個實例
* 工廠：統一建立流程
* 策略：行為可替換
* 觀察者：自動通知訂閱者

| 設計模式| 主要特點 | 適用情境 | 物件產生方式 |
| :---------: | :---------------: | :----------------: | :------------: |
| **單例模式**  | 保證一個類別只有一個實例，並提供全局唯一的存取點。| 需要全局唯一資源或管理器，例如設定管理、日誌記錄器等。| 第一次建立時創建，之後重複使用同一實例。|
| **工廠模式**  | 封裝物件創建邏輯，根據參數決定要建立哪一種物件，讓使用者不用直接接觸具體類別。 | 需要根據條件動態生成不同類型物件，降低使用者與物件具體類別的耦合。 | 每次呼叫都會新建不同物件。         |
| **策略模式**  | 將算法或行為封裝成獨立物件，並讓它們可互換，使得系統在運行時能動態切換算法。  | 需要靈活切換算法或行為，避免條件分支過多。             | 每次使用時新建策略物件，不同策略互相獨立。 |
| **觀察者模式** | 建立一對多關係，當主題狀態改變時，自動通知所有訂閱者，達成鬆耦合的事件傳遞。  | 事件驅動、發布訂閱系統、即時更新通知等場景。            | 主題與觀察者皆可多次建立，互為獨立物件。  |



未來如果專案規模變大，這些模式能幫助：
* ✅ 降低耦合度（大家不再黏在一起）
> 這些模式會強迫你把各種責任分散開來，
物件之間不需要互相知道彼此內部細節，
就像不同部門只透過「公開的接口」溝通，
大幅減少改一個功能導致整個系統崩潰的風險。

* ✅ 提高可維護性（東西更好修、更好改）
> 有了清晰的模式，每個部分都只負責一種角色，
你要修 bug 或調整邏輯時，可以聚焦在單一地方，
不用像無頭蒼蠅一樣到處追查影響範圍。
也方便新人上手，因為架構清楚一目了然。

* ✅ 提升擴展彈性（新功能不再痛苦）
> 當業務成長、需求變化時，
這些模式讓你用「替換」或「新增」的方式擴展功能，
不必動原本穩定的代碼：

* 工廠模式：多增加一種產品類別即可
* 策略模式：多一個演算法就 plug-in
* 觀察者模式：隨時加訂閱者、移訂閱者
* 單例模式：確保全域只有一個資源

---

技術與應用方法：
Python（OOP 與 Design Pattern）、VS Code（Python Extension）、互動式 CLI（範例測試）

## 📝心得：
> 一開始對 `__new__()`、工廠模式的「字典映射類別」還有策略模式「注入策略物件」這種寫法有點陌生，看起來超抽象，不太確定「為什麼要多繞一層」，但慢慢測試、比對記憶體位置，就理解到它們的用意，這次練習也算是把「抽象的設計模式」變成「具體的練習案例」，實際跑一遍後真的對日後專案會有很大幫助，不管是要降低耦合度、提高可維護性、還是做功能擴展，都比單純 procedural code 更直覺清晰。如果未來要用到更大型的框架（像 Django、Flask、.NET Core），這些模式也能直接套用。
