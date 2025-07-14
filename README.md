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

**請先確保系統中有安裝Python**

1. 創建虛擬環境

使用uv：

```bash
uv venv
```

使用python：

```bash
python -m venv venv
```

2. 進入虛擬環境

使用uv：

```bash
# Linux
source ./.venv/bin/activate
# Windows
./.venv/Script/activate
```

使用python：

```bash
# Linux
source venv/bin/activate
# Windows
./venv/Script/activate
```

3. 安裝必要套件

使用uv：

```bash
uv pip install -r requirements.txt
```

使用python：

```bash
pip install -r requirements.txt
```

## 使用方法

本系統提供兩種操作模式：現代化的 Web 操作介面與傳統的命令列模式。

### 模式一：Web 操作介面 (建議)

透過網頁介面，您可以輕鬆上傳檔案、啟動驗證並即時查看進度。

1.  **安裝相依套件**
    ```bash
    # 建議使用 uv (比 pip 更快)
    uv pip install -r requirements.txt
    
    # 或使用 pip
    pip install -r requirements.txt
    ```

2.  **設定 API 金鑰**
    在專案根目錄建立一個 `.env` 檔案，並填入您的 AnythingLLM API 金鑰：
    ```
    API_KEY="your_anythingllm_api_key"
    ```

3.  **啟動 Web 伺服器**
    ```bash
    python app.py
    ```

4.  **開啟瀏覽器**
    伺服器啟動後，在您的瀏覽器中開啟 `http://127.0.0.1:5001` 即可開始使用。

### 模式二：命令列介面

สำหรับผู้ใช้ขั้นสูงที่ต้องการการทำงานอัตโนมัติหรือการรวมเข้ากับสคริปต์อื่น ๆ

1.  **設定組態**
    -   **API 金鑰**: 同上，設定在 `.env` 檔案中。
    -   **其他設定**: 複製 `config.yaml.example` 為 `config.yaml` 並根據需求修改其中的參數。

2.  **執行程式**
    ```bash
    python main.py -w <工作區名稱> [-e <Excel檔案>] [其他選項]
    ```
    詳細參數說明請參考 `main.py` 中的 `parse_arguments` 函式。

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

程序會在 `output` 目錄下生成以下文件：
- 輸出目錄預設為 `output`，可在 `config.yaml` 中修改。
- `similarity_boxplot.png`：相似度分數箱型圖
- `similarity_scatter.png`：兩種相似度指標的散點圖
- `similarity_summary.txt`：詳細的統計報告

## 注意事項

1. 確保 Excel 文件格式正確
2. 檢查 `.env` 中的 API 金鑰是否已設定
3. 處理大量數據時可能需要較長時間

## 錯誤處理

程序會處理以下常見錯誤：
- Excel 文件不存在
- API 連接失敗
- 數據格式錯誤
- 文件寫入權限問題
