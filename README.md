# 物語3 猜拳查詢（GitHub Pages / PWA）

## 這版更新
1. **對應招式已重新驗證與修正**
   - 以「使用招式」為絕對正確來源
   - 按規則 `力量 > 速度 > 技巧 > 力量`
   - 共修正 `280` 筆對應招式
   - 差異明細在 `validation_report.csv`

2. **UI 改為更接近 App 的手機版**
   - 搜尋列固定在上方
   - 結果卡片可直接展開
   - 篩選按鈕：全部 / 只看使用招式 / 只看對應招式
   - 適合手機單手搜尋

## 上 GitHub Pages
1. 把整個資料夾內容上傳到 repository 根目錄
2. 到 Settings → Pages
3. 選 Deploy from a branch
4. Branch 選 main，資料夾選 / (root)
5. 儲存後等待部署

## 重要檔案
- `data.json`：修正後主資料
- `validation_report.csv`：對應招式修正清單
