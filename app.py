import os
import uuid
import argparse
import threading
import queue
import shutil
import time
import pandas as pd
import json
import requests
from flask import Flask, render_template, jsonify, request, Response, send_from_directory
from werkzeug.utils import secure_filename
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from io import BytesIO

# 匯入重構後的核心邏輯
from config import Config
from logger import get_logger, Logger
from main import run_verification

# --- App State & Initialization ---

# 建立上傳資料夾
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 建立輸出資料夾
OUTPUT_FOLDER = 'output'
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024  # 32 MB

# 用於追蹤背景任務的狀態
tasks = {}

# 建立一個給 Flask 應用本身使用的 logger
app_logger = get_logger("FlaskWebApp")

# --- Helper Function for Threading ---

def run_verification_threaded(task_id: str, config: Config, logger, args: argparse.Namespace, advanced_options: dict):
    """在背景執行緒中運行的包裝函式"""
    log_queue = tasks[task_id]['queue']
    try:
        # --- Override config with advanced options from frontend ---
        if advanced_options.get('api_url'):
            config.api.base_url = advanced_options['api_url']
            logger.info(f"使用前端設定的 API URL: {config.api.base_url}")
        
        if advanced_options.get('api_key'):
            config.api.api_key = advanced_options['api_key']
            logger.info("使用前端提供的 API Key。")

        if advanced_options.get('model'):
            config.workspace.model = advanced_options['model']
            logger.info(f"使用前端設定的 LLM 模型: {config.workspace.model}")

        if advanced_options.get('similarity_threshold'):
            config.analyzer.similarity_threshold = float(advanced_options['similarity_threshold'])
            logger.info(f"使用前端設定的相似度閾值: {config.analyzer.similarity_threshold}")
        # --- End of config override ---

        tasks[task_id]['status'] = 'running'
        logger.info(f"Task {task_id}: 驗證流程開始。")
        run_verification(config, logger, args, web_mode=True)
        tasks[task_id]['status'] = 'completed'

        # 將處理完的 Excel 檔案複製到輸出目錄
        final_excel_path = os.path.join(args.output, os.path.basename(args.excel))
        shutil.copy(args.excel, final_excel_path)
        logger.info(f"結果 Excel 已複製到: {final_excel_path}")
        
        logger.info(f"Task {task_id}: 驗證流程成功完成。")
    except Exception as e:
        logger.error(f"Task {task_id}: 驗證流程發生錯誤: {e}", exc_info=True)
        tasks[task_id]['status'] = 'error'
    finally:
        # 發送結束信號
        log_queue.put("<<TASK_DONE>>")

# --- Routes ---

@app.route('/')
def index():
    """提供主頁面並附上快取清除參數"""
    config = Config.load()
    default_api_url = config.api.base_url
    default_api_key = config.api.api_key or ""  # 確保不是 None
    return render_template(
        'index.html', 
        version=time.time(),
        default_api_url=default_api_url,
        default_api_key=default_api_key
    )

@app.route('/stream/<task_id>')
def stream(task_id: str):
    """此端點為客戶端提供 Server-Sent Events (SSE)"""
    log_queue = tasks.get(task_id, {}).get('queue')
    if not log_queue:
        return Response("錯誤：找不到任務佇列或任務不存在。", status=404)

    def event_stream():
        while True:
            message_str = log_queue.get()
            if message_str == "<<TASK_DONE>>":
                break
            
            # 確保傳送給前端的永遠是標準的 JSON 格式
            try:
                # 嘗試解析，如果成功，表示它已經是 JSON 字串
                json.loads(message_str)
                yield f"data: {message_str}\n\n"
            except json.JSONDecodeError:
                # 如果解析失敗，表示它是一個普通字串，我們將其包裝成 JSON
                wrapped_message = json.dumps({"log": message_str})
                yield f"data: {wrapped_message}\n\n"
    
    return Response(event_stream(), mimetype='text/event-stream')

@app.route('/api/results/<task_id>')
def get_results(task_id: str):
    """回傳指定任務的結果檔案列表"""
    results_dir = os.path.join(OUTPUT_FOLDER, task_id)
    if not os.path.isdir(results_dir):
        return jsonify({"error": "找不到結果目錄"}), 404

    files = []
    for filename in os.listdir(results_dir):
        files.append(filename)
    
    return jsonify(files)

@app.route('/api/preview/<task_id>/<path:filename>')
def preview_file(task_id: str, filename: str):
    """根據檔案類型回傳預覽內容"""
    file_path = os.path.join(os.getcwd(), OUTPUT_FOLDER, task_id, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "找不到檔案"}), 404

    try:
        file_ext = os.path.splitext(filename)[1].lower()
        
        if file_ext in ['.png', '.jpg', '.jpeg', '.gif']:
            # 對於圖片，直接回傳檔案的 URL 讓前端 <img> 標籤去載入
            # 注意：這裡回傳的是 HTML，而不是 JSON
            return f'<img src="/outputs/{task_id}/{filename}" style="max-width: 100%; height: auto;">'
        
        elif file_ext == '.txt':
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            # 將純文字包在 <pre> 標籤中以保留格式
            return f'<pre>{content}</pre>'

        elif file_ext in ['.xlsx', '.xls']:
            df = pd.read_excel(file_path)
            # 將 DataFrame 轉換為 HTML 表格
            return df.to_html(classes='table table-striped table-hover', border=0, index=False)
        
        else:
            return '<p>不支援預覽此檔案類型。</p>'

    except Exception as e:
        app_logger.error(f"預覽檔案時發生錯誤: {e}", exc_info=True)
        return '<p style="color: red;">讀取檔案時發生錯誤。</p>', 500

@app.route('/outputs/<task_id>/<path:filename>')
def serve_output_file(task_id: str, filename: str):
    """安全地提供輸出目錄中的檔案"""
    directory = os.path.join(os.getcwd(), OUTPUT_FOLDER, task_id)
    return send_from_directory(directory, filename)

@app.route('/api/validate_connection', methods=['POST'])
def validate_connection():
    """API 端點，用於驗證與 AnythingLLM 的連線。"""
    data = request.json
    api_url = data.get('api_url')
    api_key = data.get('api_key')

    if not api_url or not api_key:
        return jsonify({"success": False, "message": "API URL 和金鑰為必填項"}), 400

    try:
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        # 移除結尾的斜線以確保路徑正確
        validation_url = f"{api_url.rstrip('/')}/api/v1/auth"
        
        response = requests.get(validation_url, headers=headers, timeout=10)
        response.raise_for_status() # 如果狀態碼不是 2xx，則會引發 HTTPError
        
        return jsonify({"success": True, "message": "連線成功！"})

    except requests.exceptions.Timeout:
        return jsonify({"success": False, "message": "連線超時，請檢查 URL 和網路"}), 408
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            return jsonify({"success": False, "message": "認證失敗，API 金鑰無效"}), 401
        else:
            return jsonify({"success": False, "message": f"HTTP 錯誤: {e.response.status_code}"}), 500
    except requests.exceptions.RequestException as e:
        return jsonify({"success": False, "message": f"連線失敗，請檢查 API URL 是否正確"}), 500
    except Exception as e:
        app_logger.error(f"未知的驗證錯誤: {e}", exc_info=True)
        return jsonify({"success": False, "message": "發生未知的伺服器錯誤"}), 500


@app.route('/api/download_example')
def download_example():
    """API 端點，用於下載 Excel 範例檔案"""
    try:
        # 建立範例數據
        example_data = [
            ['什麼是 Python？', 'Python 是一種高級程式語言，以其簡潔的語法和強大的功能而聞名。它支援多種程式設計範式，包括程序式、物件導向和函數式程式設計。Python 被廣泛應用於網頁開發、數據分析、人工智慧、自動化腳本等領域。'],
            ['機器學習的主要類型有哪些？', '機器學習主要分為三種類型：1) 監督式學習：使用標記的訓練數據來學習輸入和輸出之間的映射關係，如分類和回歸問題。2) 非監督式學習：處理未標記的數據，發現數據中的隱藏模式，如聚類和降維。3) 強化學習：通過與環境互動來學習最佳策略，如遊戲AI和機器人控制。'],
            ['什麼是深度學習？', '深度學習是機器學習的一個子集，使用多層神經網路來學習數據的複雜模式。它能夠自動提取特徵，並在圖像識別、自然語言處理、語音識別等領域表現出色。深度學習的核心是多層感知機和各種神經網路架構，如卷積神經網路(CNN)、循環神經網路(RNN)和變壓器(Transformer)。'],
            ['什麼是 API？', 'API（應用程式介面）是一組定義了軟體組件如何相互通信的規則和協議。它允許不同的應用程式之間進行數據交換和功能調用。API 可以是 RESTful、GraphQL、SOAP 等不同類型，並提供標準化的方式來訪問服務和數據。'],
            ['什麼是資料庫？', '資料庫是一個有組織的數據集合，用於存儲、管理和檢索信息。常見的資料庫類型包括：1) 關聯式資料庫：如 MySQL、PostgreSQL，使用表格結構存儲數據。2) NoSQL 資料庫：如 MongoDB、Redis，支援更靈活的數據結構。3) 圖形資料庫：如 Neo4j，專門處理複雜的關係數據。'],
            ['什麼是容器化技術？', '容器化技術是一種虛擬化方法，將應用程式及其依賴項打包在一個標準化的單元中。Docker 是最流行的容器化平台，它提供了一致的運行環境，確保應用程式在不同環境中都能正常運行。容器化技術提高了部署效率、資源利用率和應用程式的可移植性。'],
            ['什麼是微服務架構？', '微服務架構是一種將應用程式分解為小型、獨立服務的設計模式。每個服務負責特定的業務功能，可以獨立開發、部署和擴展。微服務架構的優點包括：更好的可維護性、技術多樣性、獨立部署和故障隔離。但同時也帶來了分散式系統的複雜性挑戰。']
        ]

        # 建立 Excel 工作簿
        wb = Workbook()
        ws = wb.active
        ws.title = "問答集範例"

        # 設定標題樣式
        center_alignment = Alignment(horizontal="center", vertical="center")

        # 寫入數據並設定樣式
        for row_idx, row_data in enumerate(example_data, 1):
            for col_idx, cell_value in enumerate(row_data, 1):
                cell = ws.cell(row=row_idx, column=col_idx, value=cell_value)
                
                # 自動調整欄寬
                if col_idx == 1:  # 問題欄
                    ws.column_dimensions[cell.column_letter].width = 25
                elif col_idx == 2:  # 標準答案欄
                    ws.column_dimensions[cell.column_letter].width = 60
                else:  # 其他欄位
                    ws.column_dimensions[cell.column_letter].width = 15

        # 設定行高
        for row in range(1, len(example_data) + 1):
            if row == 1:
                ws.row_dimensions[row].height = 30
            else:
                ws.row_dimensions[row].height = 80

        # 將 Excel 檔案保存到記憶體
        excel_file = BytesIO()
        wb.save(excel_file)
        excel_file.seek(0)

        # 回傳檔案
        return Response(
            excel_file.getvalue(),
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            headers={'Content-Disposition': 'attachment; filename=qa_example.xlsx'}
        )

    except Exception as e:
        app_logger.error(f"生成範例檔案時發生錯誤: {e}", exc_info=True)
        return jsonify({"error": "生成範例檔案時發生錯誤"}), 500


@app.route('/api/verify', methods=['POST'])
def verify():
    """
    API 端點，用於啟動 QA 驗證流程。
    """
    app_logger.info("--- /api/verify 請求處理開始 ---")
    app_logger.info(f"收到的表單欄位: {list(request.form.keys())}")
    app_logger.info(f"收到的檔案: {list(request.files.keys())}")

    workspace = request.form.get('workspace')
    if not workspace:
        app_logger.warning("驗證失敗：工作區名稱為空。")
        return jsonify({"error": "工作區名稱為必要欄位"}), 400
    app_logger.info("驗證通過：工作區名稱存在。")

    if 'excel_file' not in request.files:
        app_logger.warning("驗證失敗：請求中找不到 'excel_file'。")
        return jsonify({"error": "請求中未包含 Excel 檔案"}), 400
    app_logger.info("驗證通過：'excel_file' 欄位存在。")

    excel_file = request.files['excel_file']
    app_logger.info(f"收到的 Excel 檔案物件: {excel_file}")
    app_logger.info(f"收到的 Excel 檔案名稱: '{excel_file.filename}'")

    if excel_file.filename == '':
        app_logger.warning("驗證失敗：Excel 檔案名稱為空字串。")
        return jsonify({"error": "未選擇 Excel 檔案"}), 400
    app_logger.info("驗證通過：Excel 檔案名稱不為空。")

    # --- 儲存上傳的檔案 ---
    task_id = str(uuid.uuid4())
    session_folder = os.path.join(app.config['UPLOAD_FOLDER'], task_id)
    os.makedirs(session_folder, exist_ok=True)

    excel_path = os.path.join(session_folder, secure_filename(excel_file.filename))
    excel_file.save(excel_path)
    
    log_path = os.path.join(session_folder, 'task.log')

    # (Zip file handling logic can be added here)
    doc_dir_path = None

    # --- 執行驗證 ---
    try:
        config = Config.load()
        log_queue = queue.Queue()
        logger = get_logger(
            name=f"task-{task_id}", 
            session_log_file=log_path, 
            log_queue=log_queue, 
            force_new=True
        )

        # 讀取進階設定
        advanced_options = {
            'api_url': request.form.get('api_url'),
            'api_key': request.form.get('api_key'),
            'model': request.form.get('model'),
            'similarity_threshold': request.form.get('similarity_threshold')
        }

        # 建立一個與 parse_arguments 輸出相容的命名空間物件
        args = argparse.Namespace(
            workspace=workspace,
            excel=excel_path,
            directory=doc_dir_path, # 待實現
            output=os.path.join('output', task_id), # 為每個 session 建立獨立的輸出
            # Allow potential overrides from form later
            model=advanced_options.get('model') or config.workspace.model,
            similarityThreshold=advanced_options.get('similarity_threshold') or config.analyzer.similarity_threshold
        )
        
        tasks[task_id] = {'status': 'pending', 'log_path': log_path, 'queue': log_queue}
        
        # 在背景執行緒中啟動驗證
        thread = threading.Thread(
            target=run_verification_threaded,
            args=(task_id, config, logger, args, advanced_options)
        )
        thread.start()

        return jsonify({
            "message": "驗證流程已啟動",
            "task_id": task_id
        })

    except Exception as e:
        # 在實際應用中，應使用 logger 記錄錯誤
        tasks[task_id]['status'] = 'error'
        print(f"啟動驗證時發生錯誤: {e}")
        return jsonify({"error": "伺服器內部錯誤"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001) 