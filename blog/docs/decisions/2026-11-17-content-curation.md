# Decision: 公開內容以「有依據、已驗證、與文件一致」為準；下架用 drafts，不刪除

**Date**: 2026-11-17
**Status**: Accepted（使用者已確認內容並授權提交與部署）

## Context

Portfolio 的 header 與自介連到部落格首頁，研究區直接連到空拍相關文章與專題 repo，所以從 Portfolio 出發，一到兩次點擊就會讀到部落格文章。這次逐篇對照專題論文、各專案 repo 與既有規則，發現幾類問題：

- **不符身分規則**：tw-grad-lab-skills 一文提到個人規劃，與 `2026-09-28-about-page-identity-disclosure.md` 的邊界不符；Portfolio 的「其他作品」也列了它。
- **尚未驗證**：uav-analysis-refactor 描述的重構版沒有用真實模型跑過；文中對專題程式的描述，也與論文附錄一的分工、Portfolio 的角色說明不完全一致。Portfolio 研究區的動畫用了重構版的 7×5 重疊切片，但頁面上的結果是 2024 系統（論文表 5.2：3840×2160 切成 24 張）跑出來的。
- **與論文不符**：uav-vision-notes 的拼接段落寫的是 Siamese network 學特徵描述子與低紋理場景；論文 8.2 節記載的是「以自監督學習估計單應性矩陣，驗證效果不如預期」，2.2 節則寫海灘影像特徵紋理豐富。另有數句結論沒有出處。
- **沒量測過的成效說法**：twstock-agent 的「降低幻覺」。
- **內容不完整**：LocalAIAgentAPI 是早期的學習日誌，有一段只列問題沒有回答；但專案本身仍要保留。
- **用語**：MapGo 一個小節標題把重點放在沒做的數量上；文章內容本身與 repo 一致。

## Decision

- 下架一律用「移到 `source/_drafts/`」，不刪除。下架：tw-grad-lab-skills、uav-analysis-refactor、LocalAIAgentAPI。LocalAIAgentAPI 只下架文章，專案仍列在首頁卡片與 Portfolio，連結只留 GitHub。
- MapGo 保留，只改一個小節標題。
- uav-vision-notes 與 twstock-agent 保留並修正：沒有出處或沒量測過的結論，改成有出處的說法或拿掉；拼接段落改寫成論文記載的實際經過。
- 新增〈大學專題：澎湖海灘垃圾自動監測系統的開發與應用〉，內容只取自申請文件的專題摘要與專題論文，圖取自論文。依部落格身分規則，不寫指導教授姓名、獎項全名與計畫編號。
- Portfolio 研究區：連結改為專題介紹／GitHub／技術筆記；動畫第二步改用論文圖 5.5 的真實輸出；`og:image` 從重構文章的標題卡換成專題輸出圖。
- GitHub 端的調整與各文件本身的文字，由使用者決定，不由 agent 逕行處理。

## Consequences

- 好處：從 Portfolio 點出去的每個連結，內容都能對回專題論文或 repo；網站第一次有一頁完整介紹專題。
- 好處：下架可逆，把檔案移回 `_posts/` 即可。重構文章補上真實模型的驗證結果後，可以用更完整的版本重新上線。
- 代價：三個舊網址會變成 404。
- 代價：Portfolio 研究區少了逐塊掃描的動畫效果。
- 未解：專題 repo 的預設分支目前仍是重構版，要在 GitHub 端處理。
