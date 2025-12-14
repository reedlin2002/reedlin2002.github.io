---
title: 📌 | LeetCode 學習記錄
date: 2025-06-06 10:42:24
tags: [leetcode,Daily]
cover: /images/leetcode.jpg
---
程式能力的提升離不開持續的練習。我會在這裡分享：

每日筆記 - 自己對題目的理解與應用
心得分享 - 刷題過程中的進度與收穫

✅　| 🉑　　| 🚫　
--- | --- | --- 
**了解並寫出** | **寫出但不清楚** | **寫不出來**

📌 **LeetCode 記錄**
- **D1** 🉑  #1  Two Sum *(GPT)*
- **D2** 🉑  #9  Palindrome Number *(GPT)*
- **D3** ✅  #13 Roman to Integer *(GPT)*
- **D4** ✅  #1  Two Sum  
- **D5** ☕ **休息**
- **D6** ✅  #9  Palindrome  
  - `[::-1]` ← Python 能用來順序相反
- **D7** 🉑  #14 Longest Common Prefix  
  - `startswith(prefix)` ← 檢查字串是否「以 prefix 開頭」
- **D8** 🉑  #14 Longest Common Prefix  
  - `if not 某東西:` ← 檢查 "某東西" 是否為空，如果是就執行
- **D9** 🉑  #14 Longest Common Prefix  
  - `while not 某東西:` ← 檢查 "某東西" 為 True/False，如果為 False 就執行
- **D10** ✅  #14 Longest Common Prefix
- **D11** ✅  #14 Longest Common Prefix *(複習)*
- **D12** 🚫  #20 Valid Parentheses  
- **D13** 🚫  #20 Valid Parentheses  
  - `{")": "(", "]": "[", "}": "{"}` ← 嘗試理解 mapping 對應關係
- **D14** ☕ **休息**
- **D15** 🚫  #20 Valid Parentheses
  - `{")": "(", "]": "[", "}": "{"}` ← 嘗試理解 mapping 對應關係
- **D16** 🚫  #20 Valid Parentheses
  - `for i in s:` ← 直接遍歷字串中的每個字元
- **D17** 🚫  #20 Valid Parentheses
  - `if i in mapping:` ← 檢查 i 是否是右括號（`)`,`]`, `}`）
  - `mapping[")"]`  ← 會得到 `(`  (從mapping這個對應關係中)
  - `stack[-1]` 意思是stack的堆疊的最上層 EX: `x=[ 10, 20, 30] x[-1]=30 x[-2]=20 x[-3]=10`
- **D18** 🉑  #20 Valid Parentheses
- **D19** 🉑  #20 Valid Parentheses
   - `stack.append`  ← 將資料放入堆疊頂端
   - `stack.pop`     ← 將堆疊頂端資料移除
- **D20** 🉑  #20 Valid Parentheses
- **D21** 🉑  #20 Valid Parentheses
- **D22** ✅  #20 Valid Parentheses
- **D23** 🚫  #21 Merge Two Sorted Lists
  - 2025/05/07 回歸繼續寫
    > self.val = val        # 節點的數值，例如 1、2、3
    > self.next = next      # 指向下一個節點的指標
- **D24** 🚫  #21 Merge Two Sorted Lists
  - ListNode(1) -> ListNode(3) -> ListNode(5)
    > 每個節點 (ListNode) 裡面都有：
    > .val：存放數值（1、3、5）
    > .next：指向下一個節點（或 None 表示結尾）
- **D25** 🚫  #21 Merge Two Sorted Lists
  - list1 = 1 -> 3 -> 5、list2 = 2 -> 4 -> 6
    > 比較 1 和 2 → 接 1 → list1 向前 → 結果：1
    > 比較 3 和 2 → 接 2 → list2 向前 → 結果：1 → 2
    > 比較 3 和 4 → 接 3 → ...
    > 一直到兩邊都走完 → 合併完成
- **D26** 🚫  #21 Merge Two Sorted Lists
  - 🔚 dummy 是儲存「整條串列的起點」<br>
    🔧 current.next 是「不斷接節點的位置」
- **D27** 🚫  #21 Merge Two Sorted Lists
  - ✔️ dummy 是假節點，current 是用來構建新串列的指標
  - ✔️ while 迴圈比較 list1 和 list2：
    > 每次比較 .val，把比較小的節點接到 current.next
    > 然後那邊的 list 移動到下一個節點（list1 = list1.next），再讓 current 自己也往前移（current = current.next）
  - ✔️ 接剩下沒比完的節點，最後 return dummy.next 而不是 dummy
- **D28** 🉑  #21 Merge Two Sorted Lists
- **D29** ✅  #21 Merge Two Sorted Lists
- **D30** ✅  #21 Merge Two Sorted Lists (review)
- **D31** ✅  #75 Sort Colors (Daily Question)
- **D32** 🚫  #26 Remove Duplicates from Sorted Array
  - 目標為輸出不重複結果 (應該是用i、j解決)
- **D33** 🚫  #26 Remove Duplicates from Sorted Array
  - 找出不重複的元素
  - for j in range(1, len(nums)):
    > 從第二個元素開始找 j是掃描指標
  - if nums[j] != nums[i]:
    > 比較當前掃描到的 nums[j] 跟上次保留的 nums[i]
    > 如果不一樣 → 代表找到一個 新的不重複元素
  -  i += 1
     nums[i] = nums[j]
    > 把這個新元素「放到前面」來取代舊的重複元素
- **D34** 🉑  #26 Remove Duplicates from Sorted Array
- **D35** 🉑  #26 Remove Duplicates from Sorted Array
  - 邊掃描、邊把不重複的元素往前搬
      > nums[0] 到 nums[i] 是 不重複且排序好的
- **D36** ✅  #26 Remove Duplicates from Sorted Array
- **D37** 🚫  #27 Remove Element
- **D38** 🉑  #27 Remove Element
  - 就地 (in-place) 移除所有等於 val 的元素，並回傳「移除後的陣列長度」
- **D39** ✅  #27 Remove Element
- **D40** 🚫  #28 Find the Index of the First Occurrence in a String
  - 找出一段小字串，第一次在大字串中出現的位置
- **D41** 🉑  #28 Find the Index of the First Occurrence in a String
  - 判斷
      > haystack = "TCodeLee"
      > haystack[0:3] → 取第 0、1、2 的字 → "TCo"
      > haystack[1:4] → 取第 1、2、3 的字 → "Cod"
- **D42** 🉑  #28 Find the Index of the First Occurrence in a String
  - 假設hatstack:LeetCode , needle:Lee
      > for i in range(len(haystack) - len(needle) + 1): 
      > len(haystack) - len(needle) + 1 = 8 - 3 + 1 = 6 
      > i=0 → haystack[i : i + 3] → haystack[0:3]
      > haystack[0:3] → "Lee" 符合！立刻 return 0
- **D43** ✅  #28 Find the Index of the First Occurrence in a String
- **D44** 🚫  #35 Search Insert Position
  - 找出target 是不是出現在 nums 裡？如果有，回傳它的 index；
    如果沒有，就回傳它應該被插入的位置
- **D45** 🚫  #35 Search Insert Position
  - 經典的「二分搜尋（Binary Search）」應用，時間複雜度是 O(log n)
      > 用來在「已排序的陣列」中找出某個數字 
      > 每次都只看一半，時間複雜度 O(log n)（非常快）
- **D46** 🚫  #35 Search Insert Position
  - 公式 ↓ 
      > nums = [1, 3, 5, 6, 9, 12, 15] , target = 9 
      > 設定 left = 0，right = 6（因為陣列長度是 7）
      > 計算 mid = (left + right) // 2
      > (0 + 6) // 2 = 3 , 看 nums[3] = 6 → 6 < 9,表示 9 在右邊 → 所以更新 left = mid + 1 = 4
      > 再算新的 mid = (4 + 6) // 2 = 5 → nums[5] = 12 → 12 > 9，表示 9 在左邊 → 所以更新 right = mid - 1 = 4
      > 再算新的 mid = (4 + 4) // 2 = 4 → nums[4] = 9 ✅ 找到了！回傳 index 4！
- **D47** 🉑  #35 Search Insert Position
- **D48** 🉑  #35 Search Insert Position
- **D49** ✅  #35 Search Insert Position
- **D50** 🚫  #58 Length of Last Word
  - 目標：找出最後一個單字的長度
- **D51** 🚫  #58 Length of Last Word
  - 研究：.strip() / .split()
      > `.strip()` 是把 開頭和結尾 的空白全部去掉
      > `.split()` 預設是根據「空白」把句子切開成單字
- **D52** 🉑  #58 Length of Last Word
  - 1. 清除左右空白
  - 2. 用空白分割句子成單字陣列
  - 3. 取出最後一個單字，計算長度
- **D53** ✅  #58 Length of Last Word
- **D54** ✅  #66 Plus One
  - 解題：每位數字被分開存在一個 list 中, 回傳 加 1 之後 的結果 (List)
      > `for i in range(x, -1, -1)` → 從最後一個位置往前走，每次走一步，直到第一個元素。
- **D55** ✅  #3423 Maximum Difference Between Adjacent Elements in a Circular Array
  - 解題：求任意兩個相鄰元素之間的最大差值。
      > 取出當前元素 `nums[i]` 和下一個元素 `nums[(i + 1) % n]`
      > 計算絕對值 `abs()` , 然後用 `max()` 找最大的。
- **D56** 🚫  #67 Add Binary
  - 解題：求兩個二進位字串輸出它們相加的結果（二進位格式）。
      > `int(n, 2)`  ➜ 二進位字串 `n` 轉成 十進位整數
      > `bin(m)`     ➜ 把十進位整數 `m` 轉成 二進位字串 
      `(Python 的 bin() 會加上 0b 作為前綴。)`
- **D57** 🉑  #67 Add Binary
- **D58** ✅  #67 Add Binary
- **D59** ✅  #1  Two Sum **(review)**