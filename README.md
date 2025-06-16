# QA 驗證系統

這是一個用於驗證 AnythingLLM 回答品質的工具。該系統可以：
1. 從 Excel 文件中讀取標準問答對
2. 將問題發送給 AnythingLLM 獲取回答
3. 比較 AnythingLLM 回答與標準答案的語意相似度
4. 生成詳細的統計分析和視覺化圖表

## 功能特點

- **自動化流程**
  - 自動化驗證問答流程
- **多維度相似度分析**
  - BERT Score：評估語意層面的相似度
  - Cosine Similarity：評估詞彙和句法層面的相似度
- **自動生成統計圖表**
  - 分佈圖：顯示相似度分數的分佈情況
  - 箱型圖：顯示統計分佈特徵
  - 散點圖：展示兩種相似度指標的關係
- **詳細統計報告**
  - 平均值、中位數、標準差等統計指標
  - 相似度分數的判斷標準說明

## 安裝要求

```bash
# 建議使用uv
uv venv
source ./.venv/bin/activate
pip install -r requirements.txt
```

## 使用方法

1. 準備 Excel 文件
   - 第一行：問題
   - 第二行：標準答案
   - 第三行：留空（自動填充 LLM 回答）
   - 第四行：留空（自動填充 BERT Score）
   - 第五行：留空（自動填充 Cosine Similarity）
   
   *備註：不需要表頭。*

2. 設置環境變數
   - 創建 `.env` 文件
   - 添加以下配置：
     ```
     API_KEY=your_api_key
     ANYTHINGLLM_URL=your_llm_api_url
     ```

   *備註：API金鑰從 AnythingLLM 系統中生成*

3. 運行程序
   ```bash
   python main.py
   ```

## 相似度分數說明

### BERT Score
- 0.9-1.0：極高的語意相似度，幾乎完全相同
- 0.8-0.9：很高的語意相似度，表達方式不同但核心意思相同
- 0.7-0.8：較高的語意相似度，主要意思相同但有些細節差異
- 0.6-0.7：中等語意相似度，有部分共同點但差異較大
- 0.5-0.6：較低的語意相似度，只有少量相關內容
- 0-0.5：很低的語意相似度，幾乎不相關

### Cosine Similarity
- 0.9-1.0：幾乎完全相同的向量方向
- 0.7-0.9：非常相似的向量方向
- 0.5-0.7：中等相似度
- 0.3-0.5：較低相似度
- 0-0.3：幾乎不相關

## 輸出文件

程序會在 `similarity_charts` 目錄下生成以下文件：
- `similarity_distributions.png`：相似度分數分佈圖
- `similarity_boxplot.png`：相似度分數箱型圖
- `similarity_scatter.png`：兩種相似度指標的散點圖
- `similarity_summary.txt`：詳細的統計報告

## 注意事項

1. 確保 Excel 文件格式正確
2. 檢查環境變數配置
4. 處理大量數據時可能需要較長時間

## 錯誤處理

程序會處理以下常見錯誤：
- Excel 文件不存在
- API 連接失敗
- 數據格式錯誤
- 文件寫入權限問題
