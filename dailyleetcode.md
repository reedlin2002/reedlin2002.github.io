✅ | 🉑 | 🚫
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
  - 2025/05/07 回歸繼續寫<br>
    > `self.val = val        # 節點的數值，例如 1、2、3`<br>
    > `self.next = next      # 指向下一個節點的指標`
- **D24** 🚫  #21 Merge Two Sorted Lists
  - ListNode(1) -> ListNode(3) -> ListNode(5) <br>
    > `每個節點 (ListNode) 裡面都有：`<br>
    > `.val：存放數值（1、3、5）`<br>
    > `.next：指向下一個節點（或 None 表示結尾）`
- **D25** 🚫  #21 Merge Two Sorted Lists
  - list1 = 1 -> 3 -> 5、list2 = 2 -> 4 -> 6<br>
    > `比較 1 和 2 → 接 1 → list1 向前 → 結果：1`<br>
    > `比較 3 和 2 → 接 2 → list2 向前 → 結果：1 → 2`<br>
    > `比較 3 和 4 → 接 3 → ...`<br>
    > `一直到兩邊都走完 → 合併完成`
- **D26** 🚫  #21 Merge Two Sorted Lists
  - 🔚 dummy 是儲存「整條串列的起點」<br>
    🔧 current.next 是「不斷接節點的位置」
- **D27** 🚫  #21 Merge Two Sorted Lists
  - ✔️ dummy 是假節點，current 是用來構建新串列的指標<br>
  - ✔️ while 迴圈比較 list1 和 list2：<br>
    > `每次比較 .val，把比較小的節點接到 current.next`<br>
    > `然後那邊的 list 移動到下一個節點（list1 = list1.next），再讓 current 自己也往前移（current = current.next）`<br>
  - ✔️ 接剩下沒比完的節點，最後 return dummy.next 而不是 dummy
- **D28** 🉑  #21 Merge Two Sorted Lists
- **D29** ✅  #21 Merge Two Sorted Lists
- **D30** ✅  #21 Merge Two Sorted Lists (review)
