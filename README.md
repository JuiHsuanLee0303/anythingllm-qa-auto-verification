# QA 驗證系統

這是一個用於驗證 AnythingLLM 回答品質的工具，支援本地與 Docker 部署。  
本系統可自動化比對問答、計算語意相似度，並產生統計圖表與報告。

## 功能特點

- **自動化驗證問答流程**
- **多維度相似度分析**（BERT Score、Cosine Similarity）
- **自動生成統計圖表**（分佈圖、箱型圖、散點圖）
- **詳細統計報告**（平均值、中位數、標準差等）

---

## 安裝與部署

### 一、傳統本地部署

1. **建立虛擬環境**
    ```bash
    python -m venv venv
    source venv/bin/activate  # Linux/macOS
    # 或
    .\venv\Scripts\activate   # Windows
    ```

2. **安裝相依套件**
    ```bash
    pip install -r requirements.txt
    ```

3. **設定 API 金鑰**
    - 在專案根目錄建立 `.env` 檔案，內容如下：
      ```
      API_KEY="your_anythingllm_api_key"
      ```

4. **啟動 Web 伺服器**
    ```bash
    python app.py
    ```
    - 開啟瀏覽器進入 [http://127.0.0.1:5001](http://127.0.0.1:5001)

5. **命令列模式**
    ```bash
    python main.py -w <工作區名稱> [-e <Excel檔案>] [其他選項]
    ```

---

### 二、Docker 部署

1. **建置映像檔**
    ```bash
    docker build -t qa-verification .
    ```

2. **建立 `.env` 檔案**
    - 在專案根目錄建立 `.env`，內容如下：
      ```
      API_KEY=your_anythingllm_api_key
      ```

3. **啟動容器**
    ```bash
    docker run --env-file .env -p 5001:5001 qa-verification
    ```
    - 預設 Web 介面會在 [http://localhost:5001](http://localhost:5001)

4. **掛載檔案（選用）**
    - 若需上傳/下載檔案，可掛載本機目錄：
      ```bash
      docker run --env-file .env -p 5001:5001 -v $(pwd)/uploads:/app/uploads qa-verification
      ```

---

## 參數與輸出

- 主要參數請參考 `main.py` 的 `parse_arguments`。
- 輸出目錄預設為 `output`，可於 `config.yaml` 調整。
- 產出檔案：
  - `similarity_boxplot.png`：相似度分數箱型圖
  - `similarity_scatter.png`：兩種相似度指標的散點圖
  - `similarity_summary.txt`：詳細統計報告

---

## 注意事項

1. 請確認 `.env` 檔案未被加入版本控制。
2. Excel 檔案格式需正確。
3. 處理大量數據時需耐心等候。

---

## 常見錯誤處理

- Excel 檔案不存在
- API 連線失敗
- 數據格式錯誤
- 檔案寫入權限問題

---

## 聯絡方式

如有問題請開 issue 或聯絡專案維護者。
