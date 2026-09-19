---
title: 我終於搞懂二分搜尋：從直覺、邊界到 Search Insert Position
date: 2026-07-18
tags: [演算法, Binary Search, Python, LeetCode]
cover: /images/binary-search-cover-pov.png
---

以前看到二分搜尋（Binary Search），我只記得一句話：**從中間開始找。**

但真的要自己寫時，我才發現問題沒有這麼簡單：`left` 和 `right` 到底代表什麼？為什麼要寫 `mid + 1`？找不到時，為什麼又能直接回傳 `left`？

這篇文章記錄我把二分搜尋一步一步拆開後，終於真正理解它的過程。

<!-- more -->

## 二分搜尋不只是「從中間找」

假設有一排已經排序好的數字：

```text
[1, 3, 5, 7, 9, 12, 15]
```

現在要找 `12`。

一般的逐個搜尋會從 `1` 開始，一個一個往後檢查。二分搜尋則會先看中間：

```text
索引： 0  1  2  3  4   5   6
數字： 1  3  5  7  9  12  15
                   ↑
                 mid = 3
```

中間值是 `7`。因為 `12 > 7`，而且這些數字已經排序，所以 `7` 和它左邊的數字都不可能是答案，可以一次全部排除。

剩下的範圍是：

```text
[9, 12, 15]
```

再看一次中間，就能找到 `12`。

所以二分搜尋真正的核心是：

> 利用資料已排序的特性，每比較一次，就排除一半不可能有答案的範圍。

這也代表二分搜尋不能直接套在未排序的資料上。沒有排序時，看到中間值比較大或比較小，也無法確定答案究竟在哪一邊。

## `left`、`right` 和 `mid` 是什麼？

二分搜尋不是真的把陣列切開或刪除，而是用三個索引標記目前要搜尋的範圍：

- `left`：搜尋範圍最左邊的索引
- `right`：搜尋範圍最右邊的索引
- `mid`：目前搜尋範圍的中間索引

一開始這樣設定：

```python
left = 0
right = len(nums) - 1
```

`right` 必須是 `len(nums) - 1`，因為陣列長度和最後一個索引不一樣。

例如陣列有 7 個元素：

```text
長度：7
索引：0, 1, 2, 3, 4, 5, 6
```

接著計算中間位置：

```python
mid = (left + right) // 2
```

括號不能省略。`(4 + 6) // 2` 的答案是 `5`，但 `4 + 6 // 2` 的答案會變成 `7`，意思完全不同。

## 實際走一次搜尋流程

現在用這組資料尋找 `10`：

```text
nums = [2, 4, 6, 8, 10, 12, 14]
target = 10
```

第一次搜尋：

```text
left = 0
right = 6
mid = (0 + 6) // 2 = 3
nums[3] = 8
```

因為 `8 < 10`，代表索引 `0～3` 都不可能是答案，所以直接把 `left` 移到 `mid` 的下一格：

```python
left = mid + 1  # 4
```

第二次搜尋：

```text
left = 4
right = 6
mid = (4 + 6) // 2 = 5
nums[5] = 12
```

這次 `12 > 10`，代表答案只可能在左邊，因此把 `right` 移到 `mid` 的前一格：

```python
right = mid - 1  # 4
```

第三次搜尋：

```text
left = 4
right = 4
mid = 4
nums[4] = 10
```

找到答案，回傳索引 `4`。

## 為什麼一定是 `mid + 1`？

我一開始很容易把它寫成：

```python
left + 1
```

這裡有兩個問題。

第一，這行只算出結果，沒有把結果存回 `left`，所以 `left` 根本不會改變。

第二，就算寫成 `left = left + 1`，也只往前移動一格，沒有利用二分搜尋可以排除一半資料的優勢。

正確寫法是：

```python
left = mid + 1
```

因為 `mid` 已經檢查過，而且 `mid` 左邊也全部確定太小，所以整段都可以排除。

右邊同樣是：

```python
right = mid - 1
```

## 完整的二分搜尋

把前面的邏輯組合起來：

```python
def binary_search(nums, target):
    left = 0
    right = len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1
```

這段程式只有三種情況：

1. 中間值等於目標：找到答案，`return mid`
2. 中間值太小：答案只可能在右邊，移動 `left`
3. 中間值太大：答案只可能在左邊，移動 `right`

`return -1` 必須放在 `while` 外面。第一次沒有猜中，不代表答案不存在，只代表還要到剩下的那一半繼續找。

只有當 `left > right`，搜尋範圍完全消失後，才能確定真的找不到。

## 為什麼時間複雜度是 `O(log n)`？

如果有 8 筆資料，每次排除一半：

```text
8 → 4 → 2 → 1
```

範圍縮小 3 次就只剩一筆。換個方向看：

```text
2³ = 8
log₂(8) = 3
```

如果有 16 筆資料：

```text
16 → 8 → 4 → 2 → 1
```

會縮小 4 次：

```text
2⁴ = 16
log₂(16) = 4
```

也就是說，`log₂(n)` 可以先白話理解成：

> `n` 可以連續除以 2 幾次，才會縮小成 1？

即使有大約 100 萬筆排序資料，二分搜尋也只需要約 20 個層級。相比之下，逐個搜尋在最壞情況可能要檢查接近 100 萬筆。

實際比較次數可能會比縮小次數多一次，因為剩下最後一筆時仍要檢查它是不是答案。但 Big O 關心的是資料量增加時的成長趨勢，因此這種固定的 `+1` 不會改變 `O(log n)`。

## 延伸：Search Insert Position

LeetCode #35 不只要找出目標，還要求：如果目標不存在，回傳它應該插入的位置。

例如：

```text
nums = [1, 3, 5, 6]
target = 4
```

搜尋過程：

```text
left=0, right=3
mid=1 → nums[1]=3
3 < 4，所以 left=2

left=2, right=3
mid=2 → nums[2]=5
5 > 4，所以 right=1
```

最後變成：

```text
left = 2
right = 1
```

`left > right` 代表搜尋結束，而 `left=2` 剛好就是 `4` 應該插入的位置：

```text
[1, 3, 4, 5, 6]
       ↑
     index 2
```

因此程式和一般二分搜尋幾乎一樣，只有最後一行不同：

```python
def search_insert(nums, target):
    left = 0
    right = len(nums) - 1

    while left <= right:
        mid = (left + right) // 2

        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return left
```

一般二分搜尋找不到時回傳 `-1`；Search Insert Position 則回傳 `left`。

## 幾個容易忽略的邊界

### 目標比所有數字都小

```text
nums = [1, 3, 5, 6]
target = 0
```

最後 `left = 0`，代表插在最前面。

### 目標比所有數字都大

```text
nums = [1, 3, 5, 6]
target = 7
```

最後 `left = 4`，等於 `len(nums)`，代表插在陣列尾端之後。這是合法的插入位置，但不能在插入前直接讀取 `nums[4]`，因為那裡目前還沒有元素。

### 空陣列

```text
nums = []
target = 5
```

初始化後：

```text
left = 0
right = -1
```

`while left <= right` 一開始就是 `False`，所以直接回傳 `left=0`。空陣列的第一個插入位置確實就是索引 `0`。

如果把 `right` 錯寫成 `len(nums)`，程式就可能嘗試讀取不存在的 `nums[0]`，造成 `IndexError`。

## 我這次真正學到的事

我原本以為理解「每次排除一半」就等於會寫二分搜尋，但實際動手後才發現，觀念和程式碼之間還有一段距離。

我踩到的問題包括：

- 把 `len(nums)` 誤認成最後一個索引
- 忘記 `mid` 必須在每一輪重新計算
- 寫了 `left + 1`，卻沒有真的更新 `left`
- 忘記應該從 `mid + 1` 開始，而不是只移動一格
- 在還沒找完時使用 `return`，提早結束整個函式
- 把 Python 的 `elif` 寫成其他語言常見的 `else if`

現在我的理解是：二分搜尋不是背一段模板，而是一直維持一個規則：

> 如果答案存在，它一定還在 `left` 到 `right` 之間。

每次比較 `nums[mid]`，都是在安全地縮小這個可能範圍。當範圍消失，就代表找不到；在 Search Insert Position 裡，此時的 `left` 則剛好留下了正確的插入位置。
