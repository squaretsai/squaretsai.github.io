這包是給 HTML 直接讀取的 CSV 資料來源。

檔案用途：
1. pokemon_master.csv：主要寶可夢資料
2. forms_master.csv：型態 / 額外型態資料
3. pokemon_overrides.csv：你手動補資料、修正名稱、覆蓋錯誤時優先讀取的檔案
4. moves_master.csv：招式資料
5. moves_overrides.csv：你手動補招式或修正招式時用
6. type_chart_matrix.csv：屬性相剋表
7. pokemon_damage_calculator_csv_runtime.html：讀這些 CSV 的主程式
8. pokemon_data_runtime_bundle.xlsx：方便你在 Excel 檢查與修改的整合活頁簿

建議流程：
- 平常不要直接改主檔，優先改 pokemon_overrides.csv / moves_overrides.csv
- HTML 會先讀主檔，再讀 overrides，因此同 identifier 的資料可由 overrides 覆蓋
- 把整包放在同一個資料夾或 GitHub Pages 同一路徑即可
- 如果你直接雙擊本機 HTML 而不是透過網站開啟，瀏覽器可能會擋 fetch；此版本也提供手動載入 CSV 的備援方式
