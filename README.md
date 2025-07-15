<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>QA 驗證系統</title>
    <style>
        body { font-family: 'Noto Sans TC', Arial, sans-serif; line-height: 1.7; margin: 2em; }
        h1, h2, h3 { color: #1a237e; }
        code, pre { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
        .section { margin-bottom: 2em; }
        ul, ol { margin-left: 2em; }
    </style>
</head>
<body>
    <h1>QA 驗證系統</h1>
    <p>這是一個用於驗證 AnythingLLM 回答品質的工具，支援本地與 Docker 部署。<br>
    本系統可自動化比對問答、計算語意相似度，並產生統計圖表與報告。</p>

    <div class="section">
        <h2>功能特點</h2>
        <ul>
            <li>自動化驗證問答流程</li>
            <li>多維度相似度分析（BERT Score、Cosine Similarity）</li>
            <li>自動生成統計圖表（分佈圖、箱型圖、散點圖）</li>
            <li>詳細統計報告（平均值、中位數、標準差等）</li>
        </ul>
    </div>

    <div class="section">
        <h2>安裝與部署</h2>
        <h3>一、傳統本地部署</h3>
        <ol>
            <li>建立虛擬環境
                <pre><code>python -m venv venv
source venv/bin/activate  # Linux/macOS
# 或
.\venv\Scripts\activate   # Windows</code></pre>
            </li>
            <li>安裝相依套件
                <pre><code>pip install -r requirements.txt</code></pre>
            </li>
            <li>設定 API 金鑰
                <pre><code>在專案根目錄建立 .env 檔案，內容如下：
API_KEY="your_anythingllm_api_key"</code></pre>
            </li>
            <li>啟動 Web 伺服器
                <pre><code>python app.py</code></pre>
                <p>開啟瀏覽器進入 <a href="http://127.0.0.1:5001">http://127.0.0.1:5001</a></p>
            </li>
            <li>命令列模式
                <pre><code>python main.py -w &lt;工作區名稱&gt; [-e &lt;Excel檔案&gt;] [其他選項]</code></pre>
            </li>
        </ol>

        <h3>二、Docker 部署</h3>
        <ol>
            <li>建置映像檔
                <pre><code>docker build -t qa-verification .</code></pre>
            </li>
            <li>建立 .env 檔案
                <pre><code>API_KEY=your_anythingllm_api_key</code></pre>
            </li>
            <li>啟動容器
                <pre><code>docker run --env-file .env -p 5001:5001 qa-verification</code></pre>
                <p>預設 Web 介面會在 <a href="http://localhost:5001">http://localhost:5001</a></p>
            </li>
            <li>掛載檔案（選用）
                <pre><code>docker run --env-file .env -p 5001:5001 -v $(pwd)/uploads:/app/uploads qa-verification</code></pre>
            </li>
        </ol>
    </div>

    <div class="section">
        <h2>參數與輸出</h2>
        <ul>
            <li>主要參數請參考 <code>main.py</code> 的 <code>parse_arguments</code>。</li>
            <li>輸出目錄預設為 <code>output</code>，可於 <code>config.yaml</code> 調整。</li>
            <li>產出檔案：
                <ul>
                    <li>similarity_boxplot.png：相似度分數箱型圖</li>
                    <li>similarity_scatter.png：兩種相似度指標的散點圖</li>
                    <li>similarity_summary.txt：詳細統計報告</li>
                </ul>
            </li>
        </ul>
    </div>

    <div class="section">
        <h2>注意事項</h2>
        <ol>
            <li>請確認 <code>.env</code> 檔案未被加入版本控制。</li>
            <li>Excel 檔案格式需正確。</li>
            <li>處理大量數據時需耐心等候。</li>
        </ol>
    </div>

    <div class="section">
        <h2>常見錯誤處理</h2>
        <ul>
            <li>Excel 檔案不存在</li>
            <li>API 連線失敗</li>
            <li>數據格式錯誤</li>
            <li>檔案寫入權限問題</li>
        </ul>
    </div>

    <div class="section">
        <h2>聯絡方式</h2>
        <p>如有問題請開 issue 或聯絡專案維護者。</p>
    </div>
</body>
</html>