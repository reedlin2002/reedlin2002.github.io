# CLAUDE.md — Agent Rules for Hexo

## 文件管理規則 (Document Management Rules)

### 核心原則

**每次 plan 或 code 變更，Agent 必須同步更新相關文件。禁止只改 code 不更新文件。**

---

## 1. Plan 文件 (每次必寫)

每次開始一個 feature、bugfix、refactor 之前，Agent **必須**先在 docs/plans/ 建立 plan 文件。

### 檔名格式
docs/plans/YYYY-MM-DD-<kebab-case-title>.md

範例：
docs/plans/2026-05-14-login-refactor.md
docs/plans/2026-05-18-aicard-collect-fix.md

### Plan 文件格式

markdown
# <Feature/Task Title>

## Scope
<一句話描述這次變更的目的>

## Files Impacted
- <ClassName or path>
- <ClassName or path>

## DB Impact
<none | 描述 schema/migration 變更>

## Risk
<潛在風險或相容性問題>

## SDD Update
- <哪個 sequence/flow 需要更新>
- <哪個 component diagram 需要更新>

## Story Status
- [ ] In Progress
- [ ] Code Done
- [ ] Docs Updated
- [ ] SDD Updated
- [ ] Review Ready

---

## 2. SDD (Software Design Document) 同步規則

**禁止**：code 改了，SDD 沒更新。

每次修改以下項目時，**必須**同步更新 `docs/SDD.md`：

| 變更類型 | 必須更新的 SDD 區塊 |
|---|---|
| 新增 API endpoint | API 清單、sequence diagram |
| 修改 service 邏輯 | component 說明、flow diagram |
| 修改 DB schema | ER diagram、table 說明 |
| 新增/修改 JWT/Auth 流程 | auth sequence diagram |
| 新增第三方整合 | integration diagram |

---

## 3. Decision Log 更新規則

當做出以下決策時，**必須**在 docs/decisions/ 新增或更新 decision 記錄：

- 架構方向的選擇（例：為何選擇 Redis 而非 DB queue）
- API 設計取捨
- 安全性相關的設計選擇
- 打破既有慣例的實作方式

### Decision 檔名格式
docs/decisions/YYYY-MM-DD-<short-title>.md

### Decision 文件格式

markdown
# Decision: <Title>

**Date**: YYYY-MM-DD
**Status**: Accepted | Superseded | Deprecated

## Context
<為什麼需要做這個決定>

## Decision
<做了什麼決定>

## Consequences
<這個決定帶來的影響，包含好處與壞處>

---

## 4. Story Status 更新規則

每個 plan 文件的 Story Status checklist **必須**即時更新：

- 開始實作時：勾選 In Progress
- code 完成時：勾選 Code Done
- 文件更新後：勾選 Docs Updated
- SDD 更新後：勾選 SDD Updated
- 準備 review 時：勾選 Review Ready

---

## 5. Agent 工作流程 Checklist

每次任務結束前，Agent **必須**確認以下項目：

[ ] docs/plans/YYYY-MM-DD-<title>.md 已建立
[ ] 所有受影響的 SDD 區塊已更新
[ ] 如有架構決策，docs/decisions/ 已更新
[ ] Plan 文件的 Story Status 已更新至最新狀態
[ ] 沒有只改 code 而沒有對應文件更新的情況

---

## 6. 文件目錄結構

docs/
├── SDD.md                          # 主要軟體設計文件
├── plans/                          # 每次任務的 plan
│   └── YYYY-MM-DD-<title>.md
├── decisions/                      # Architecture Decision Records
│   └── YYYY-MM-DD-<title>.md
├── aicard-api-data-specification-prd.md
└── aicard-collect-notification-matrix.md