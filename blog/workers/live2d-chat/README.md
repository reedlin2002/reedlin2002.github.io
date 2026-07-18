# Live2D 聊天代理 Worker — 部署步驟（約 10 分鐘，全免費）

前端的看板娘聊天框會 POST 到這個 Cloudflare Worker，由它持 API key 轉呼叫 OpenRouter。
**endpoint 沒設定之前，看板娘會用離線劇本回覆，不影響網站其他功能。**

## 1. 拿 OpenRouter API key
1. 到 https://openrouter.ai 註冊（GitHub 登入即可）
2. Keys → Create Key，複製（`sk-or-v1-...`）
3. 免費模型不需要儲值；預設用 `google/gemini-2.0-flash-exp:free`

## 2. 部署 Worker（Dashboard 免 CLI）
1. https://dash.cloudflare.com → Workers & Pages → Create → Workers 分頁 → 選 **「Start with Hello World!」** 範本
   （**不要**選「Import a repository」——那條路才會問 build command；本 worker 是零依賴單檔，不需要任何建置）
2. 名稱取 `live2d-chat`（網址會是 `https://live2d-chat.<你的子網域>.workers.dev`）→ Deploy
3. 點 Edit code 開線上編輯器，把範本全刪、貼上本目錄的 `worker.js` 全文 → Deploy

> 想用 CLI 的話（等價做法）：
> ```bash
> cd workers/live2d-chat
> npx wrangler login
> npx wrangler deploy                          # 讀本目錄的 wrangler.jsonc
> npx wrangler secret put OPENROUTER_API_KEY  # 貼上 key
> ```

## 3. 設定環境變數
Worker → Settings → Variables and Secrets：
| 名稱 | 類型 | 值 |
|---|---|---|
| `OPENROUTER_API_KEY` | **Secret** | 步驟 1 的 key（必填） |
| `MODEL` | Text | 選填，預設 `meta-llama/llama-3.3-70b-instruct:free`；`google/gemma-4-31b-it:free` 也可（worker 會自動把人設併入 user 訊息，因 gemma 不支援 system role）；清單見 openrouter.ai/models?q=free |
| `SYSTEM_PROMPT` | Text | 選填，覆寫人設（預設人設在 worker.js 裡） |
| `ALLOWED_ORIGINS` | Text | 選填，預設已含正式站 + localhost:4000 |

## 4. 接上部落格
`themes/cactus/_config.yml`：
```yaml
live2d_chat:
  endpoint: https://live2d-chat.<你的子網域>.workers.dev
```
然後 `npx hexo clean && npx hexo generate && npx hexo deploy`。

## 驗證
```bash
curl -X POST https://live2d-chat.<你的子網域>.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"你好，你是誰？"}]}'
# 應回 {"reply":"..."}
```

## 免費額度概況
- Cloudflare Workers：100,000 請求/天
- OpenRouter 免費模型：有速率限制（約 20 req/min、每日上限），個人部落格綽綽有餘；被限流時她會說連不上，稍等即可
