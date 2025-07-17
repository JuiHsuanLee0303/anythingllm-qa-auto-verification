// 多語系支援
const i18n = {
    // 繁體中文
    'zh-TW': {
        // 頁面標題
        'page_title': 'QA 自動化驗證系統',
        'page_subtitle': '上傳您的檔案以開始品質分析',
        
        // 步驟標題
        'step_1_title': '步驟 1：AnythingLLM 連線設定',
        'step_2_title': '步驟 2：選擇工作區',
        'step_3_title': '步驟 3：選擇驗證模式',
        'step_4_title': '步驟 4：上傳驗證問答集 (Excel)',
        'step_4_single_title': '步驟 4：輸入問題',
        'step_4_single_answer_title': '步驟 4：輸入標準答案',
        
        // 連線設定
        'api_url_label': 'API URL',
        'api_key_label': 'API 金鑰 (API Key)',
        'api_url_placeholder': '例如：http://localhost:3001',
        'api_key_placeholder': '請輸入您的 API 金鑰',
        'validate_connection': '🔗 驗證連線',
        'save_settings': '💾 儲存設定',
        'connection_status': '未驗證',
        'connection_status_verified': '已驗證',
        'connection_status_failed': '驗證失敗',
        
        // 進階設定
        'advanced_settings': '⚙️ 進階設定',
        'model_label': 'LLM 模型',
        'model_placeholder': '例如：llama3.1:8b-instruct-fp16',
        'similarity_threshold_label': '相似度閾值',
        'similarity_threshold_placeholder': '例如：0.7',
        
        // 工作區
        'workspace_label': '選擇工作區',
        'workspace_placeholder': '請先驗證連線以載入工作區列表',
        'refresh_workspaces': '🔄 重新載入',
        'workspace_help': '請先完成步驟 1 的連線驗證，系統會自動載入可用的工作區列表',
        
        // 驗證模式
        'validation_mode_label': '選擇驗證模式',
        'excel_mode': '📊 Excel 批次驗證',
        'single_mode': '✏️ 單筆文字驗證',
        
        // 檔案上傳
        'excel_file_label': '上傳驗證問答集 (Excel)',
        'excel_format_help': '📋 Excel 格式說明',
        'single_question_label': '輸入問題',
        'single_answer_label': '輸入標準答案',
        'single_question_placeholder': '請輸入要驗證的問題...',
        'single_answer_placeholder': '請輸入預期的標準答案...',
        
        // Excel 格式說明
        'excel_format_title': '📝 Excel 檔案格式說明',
        'excel_format_desc': '請準備一個 Excel 檔案 (.xlsx)，包含以下必要欄位：',
        'field_name': '欄位名稱',
        'description': '說明',
        'required': '是否必填',
        'example': '範例',
        'question_field': '問題',
        'answer_field': '標準答案',
        'question_desc': '要驗證的問題內容',
        'answer_desc': '預期的標準答案',
        'required_text': '必填',
        'question_example': '什麼是機器學習？',
        'answer_example': '機器學習是人工智慧的一個分支...',
        
        // 範例表格
        'example_table_title': '📊 範例表格',
        'python_question': '什麼是 Python？',
        'python_answer': 'Python 是一種高級程式語言，以其簡潔的語法和強大的功能而聞名。它支援多種程式設計範式，包括程序式、物件導向和函數式程式設計。',
        'ml_question': '機器學習的主要類型有哪些？',
        'ml_answer': '機器學習主要分為三種類型：監督式學習、非監督式學習和強化學習。監督式學習使用標記的訓練數據，非監督式學習處理未標記的數據，強化學習通過與環境互動來學習。',
        'dl_question': '什麼是深度學習？',
        'dl_answer': '深度學習是機器學習的一個子集，使用多層神經網路來學習數據的複雜模式。它能夠自動提取特徵，並在圖像識別、自然語言處理等領域表現出色。',
        
        // 下載範例
        'download_example_title': '📥 下載範例檔案',
        'download_example_desc': '點擊下方按鈕下載範例 Excel 檔案，您可以參考此格式來準備您的問答集：',
        'download_example_btn': '📄 下載範例 Excel 檔案',
        
        // 使用提示
        'tips_title': '💡 使用提示',
        'tip_1': '確保問題和標準答案欄位都有內容',
        'tip_2': '標準答案建議包含完整的解釋，這樣能獲得更好的相似度評估',
        'tip_3': '可以根據需要添加多個工作表，系統會處理所有工作表',
        'tip_4': '檔案大小建議不超過 50MB',
        'tip_5': '支援的檔案格式：.xlsx, .xlsm, .xltx, .xltm',
        
        // 檔案驗證訊息
        'file_validation_success': '✅ 檔案格式正確',
        'file_validation_error_format': '❌ 不支援的檔案格式',
        'file_validation_error_size': '❌ 檔案太大',
        'file_validation_error_empty': '❌ 檔案是空的',
        'file_validation_supported_formats': '支援的格式',
        'file_validation_max_size': '最大支援',
        
        // 按鈕
        'start_validation': '🚀 開始驗證',
        'theme_toggle': '切換主題',
        
        // 狀態訊息
        'initializing': '正在初始化...',
        'file_preview': '檔案預覽',
        
        // 結果
        'excel_results_title': '📊 Excel 批次驗證結果',
        'single_results_title': '✏️ 單筆驗證結果',
        
        // 頁腳
        'footer_copyright': '© 2025 Jui-Hsuan Lee. All Rights Reserved.',
        
        // 語言切換
        'language': '語言',
        'zh_tw': '繁體中文',
        'en': '英文',
        'es': '西班牙文',
        'ja': '日文',
        'ko': '韓文',
        'zh_cn': '簡體中文'
    },
    
    // 英文
    'en': {
        // 頁面標題
        'page_title': 'QA Automation Verification System',
        'page_subtitle': 'Upload your files to start quality analysis',
        
        // 步驟標題
        'step_1_title': 'Step 1: AnythingLLM Connection Settings',
        'step_2_title': 'Step 2: Select Workspace',
        'step_3_title': 'Step 3: Choose Verification Mode',
        'step_4_title': 'Step 4: Upload Verification Q&A Set (Excel)',
        'step_4_single_title': 'Step 4: Enter Question',
        'step_4_single_answer_title': 'Step 4: Enter Standard Answer',
        
        // 連線設定
        'api_url_label': 'API URL',
        'api_key_label': 'API Key',
        'api_url_placeholder': 'e.g., http://localhost:3001',
        'api_key_placeholder': 'Please enter your API key',
        'validate_connection': '🔗 Validate Connection',
        'save_settings': '💾 Save Settings',
        'connection_status': 'Not Verified',
        'connection_status_verified': 'Verified',
        'connection_status_failed': 'Verification Failed',
        
        // 進階設定
        'advanced_settings': '⚙️ Advanced Settings',
        'model_label': 'LLM Model',
        'model_placeholder': 'e.g., llama3.1:8b-instruct-fp16',
        'similarity_threshold_label': 'Similarity Threshold',
        'similarity_threshold_placeholder': 'e.g., 0.7',
        
        // 工作區
        'workspace_label': 'Select Workspace',
        'workspace_placeholder': 'Please verify connection to load workspace list',
        'refresh_workspaces': '🔄 Reload',
        'workspace_help': 'Please complete Step 1 connection verification first, the system will automatically load available workspace list',
        
        // 驗證模式
        'validation_mode_label': 'Choose Verification Mode',
        'excel_mode': '📊 Excel Batch Verification',
        'single_mode': '✏️ Single Text Verification',
        
        // 檔案上傳
        'excel_file_label': 'Upload Verification Q&A Set (Excel)',
        'excel_format_help': '📋 Excel Format Guide',
        'single_question_label': 'Enter Question',
        'single_answer_label': 'Enter Standard Answer',
        'single_question_placeholder': 'Please enter the question to verify...',
        'single_answer_placeholder': 'Please enter the expected standard answer...',
        
        // Excel 格式說明
        'excel_format_title': '📝 Excel File Format Guide',
        'excel_format_desc': 'Please prepare an Excel file (.xlsx) with the following required fields:',
        'field_name': 'Field Name',
        'description': 'Description',
        'required': 'Required',
        'example': 'Example',
        'question_field': 'Question',
        'answer_field': 'Standard Answer',
        'question_desc': 'Question content to verify',
        'answer_desc': 'Expected standard answer',
        'required_text': 'Required',
        'question_example': 'What is machine learning?',
        'answer_example': 'Machine learning is a branch of artificial intelligence...',
        
        // 範例表格
        'example_table_title': '📊 Example Table',
        'python_question': 'What is Python?',
        'python_answer': 'Python is a high-level programming language known for its clean syntax and powerful features. It supports multiple programming paradigms including procedural, object-oriented, and functional programming.',
        'ml_question': 'What are the main types of machine learning?',
        'ml_answer': 'Machine learning is mainly divided into three types: supervised learning, unsupervised learning, and reinforcement learning. Supervised learning uses labeled training data, unsupervised learning processes unlabeled data, and reinforcement learning learns through interaction with the environment.',
        'dl_question': 'What is deep learning?',
        'dl_answer': 'Deep learning is a subset of machine learning that uses multi-layer neural networks to learn complex patterns in data. It can automatically extract features and performs excellently in areas such as image recognition and natural language processing.',
        
        // 下載範例
        'download_example_title': '📥 Download Example File',
        'download_example_desc': 'Click the button below to download an example Excel file. You can refer to this format to prepare your Q&A set:',
        'download_example_btn': '📄 Download Example Excel File',
        
        // 使用提示
        'tips_title': '💡 Usage Tips',
        'tip_1': 'Ensure both question and standard answer fields have content',
        'tip_2': 'Standard answers should include complete explanations for better similarity evaluation',
        'tip_3': 'You can add multiple worksheets as needed, the system will process all worksheets',
        'tip_4': 'File size should not exceed 50MB',
        'tip_5': 'Supported file formats: .xlsx, .xlsm, .xltx, .xltm',
        
        // 檔案驗證訊息
        'file_validation_success': '✅ File format is correct',
        'file_validation_error_format': '❌ Unsupported file format',
        'file_validation_error_size': '❌ File too large',
        'file_validation_error_empty': '❌ File is empty',
        'file_validation_supported_formats': 'Supported formats',
        'file_validation_max_size': 'Maximum supported',
        
        // 按鈕
        'start_validation': '🚀 Start Verification',
        'theme_toggle': 'Toggle Theme',
        
        // 狀態訊息
        'initializing': 'Initializing...',
        'file_preview': 'File Preview',
        
        // 結果
        'excel_results_title': '📊 Excel Batch Verification Results',
        'single_results_title': '✏️ Single Verification Results',
        
        // 頁腳
        'footer_copyright': '© 2025 Jui-Hsuan Lee. All Rights Reserved.',
        
        // 語言切換
        'language': 'Language',
        'zh_tw': 'Traditional Chinese',
        'en': 'English',
        'es': 'Spanish',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh_cn': 'Simplified Chinese'
    },
    // 西班牙文
    'es': {
        'page_title': 'Sistema de Verificación QA',
        'page_subtitle': 'Sube tus archivos para comenzar el análisis de calidad',
        'step_1_title': 'Paso 1: Configuración de conexión AnythingLLM',
        'step_2_title': 'Paso 2: Selecciona el espacio de trabajo',
        'step_3_title': 'Paso 3: Elige el modo de verificación',
        'step_4_title': 'Paso 4: Sube el conjunto de preguntas y respuestas (Excel)',
        'step_4_single_title': 'Paso 4: Ingresa la pregunta',
        'step_4_single_answer_title': 'Paso 4: Ingresa la respuesta estándar',
        'api_url_label': 'API URL',
        'api_key_label': 'Clave API',
        'api_url_placeholder': 'ej: http://localhost:3001',
        'api_key_placeholder': 'Introduce tu clave API',
        'validate_connection': '🔗 Validar conexión',
        'save_settings': '💾 Guardar configuración',
        'connection_status': 'No verificado',
        'connection_status_verified': 'Verificado',
        'connection_status_failed': 'Fallo de verificación',
        'advanced_settings': '⚙️ Configuración avanzada',
        'model_label': 'Modelo LLM',
        'model_placeholder': 'ej: llama3.1:8b-instruct-fp16',
        'similarity_threshold_label': 'Umbral de similitud',
        'similarity_threshold_placeholder': 'ej: 0.7',
        'workspace_label': 'Selecciona el espacio de trabajo',
        'workspace_placeholder': 'Verifica la conexión para cargar la lista de espacios de trabajo',
        'refresh_workspaces': '🔄 Recargar',
        'workspace_help': 'Completa primero la verificación de conexión del Paso 1, el sistema cargará automáticamente la lista de espacios de trabajo disponibles',
        'validation_mode_label': 'Elige el modo de verificación',
        'excel_mode': '📊 Verificación por lote (Excel)',
        'single_mode': '✏️ Verificación individual',
        'excel_file_label': 'Sube el conjunto de preguntas y respuestas (Excel)',
        'excel_format_help': '📋 Guía de formato Excel',
        'single_question_label': 'Ingresa la pregunta',
        'single_answer_label': 'Ingresa la respuesta estándar',
        'single_question_placeholder': 'Introduce la pregunta a verificar...',
        'single_answer_placeholder': 'Introduce la respuesta estándar esperada...',
        'excel_format_title': '📝 Guía de formato de archivo Excel',
        'excel_format_desc': 'Prepara un archivo Excel (.xlsx) con los siguientes campos requeridos:',
        'field_name': 'Nombre del campo',
        'description': 'Descripción',
        'required': 'Requerido',
        'example': 'Ejemplo',
        'question_field': 'Pregunta',
        'answer_field': 'Respuesta estándar',
        'question_desc': 'Contenido de la pregunta a verificar',
        'answer_desc': 'Respuesta estándar esperada',
        'required_text': 'Requerido',
        'question_example': '¿Qué es el aprendizaje automático?',
        'answer_example': 'El aprendizaje automático es una rama de la inteligencia artificial...',
        'example_table_title': '📊 Tabla de ejemplo',
        'python_question': '¿Qué es Python?',
        'python_answer': 'Python es un lenguaje de programación de alto nivel conocido por su sintaxis limpia y potentes características. Soporta múltiples paradigmas de programación, incluyendo procedural, orientado a objetos y funcional.',
        'ml_question': '¿Cuáles son los principales tipos de aprendizaje automático?',
        'ml_answer': 'El aprendizaje automático se divide principalmente en tres tipos: aprendizaje supervisado, no supervisado y por refuerzo. El aprendizaje supervisado utiliza datos etiquetados, el no supervisado procesa datos no etiquetados y el por refuerzo aprende mediante la interacción con el entorno.',
        'dl_question': '¿Qué es el aprendizaje profundo?',
        'dl_answer': 'El aprendizaje profundo es una subcategoría del aprendizaje automático que utiliza redes neuronales de múltiples capas para aprender patrones complejos en los datos. Puede extraer características automáticamente y destaca en áreas como el reconocimiento de imágenes y el procesamiento de lenguaje natural.',
        'download_example_title': '📥 Descargar archivo de ejemplo',
        'download_example_desc': 'Haz clic en el botón de abajo para descargar un archivo Excel de ejemplo. Puedes usar este formato para preparar tu conjunto de preguntas y respuestas:',
        'download_example_btn': '📄 Descargar archivo Excel de ejemplo',
        'tips_title': '💡 Consejos de uso',
        'tip_1': 'Asegúrate de que tanto la pregunta como la respuesta estándar tengan contenido',
        'tip_2': 'Las respuestas estándar deben incluir explicaciones completas para una mejor evaluación de similitud',
        'tip_3': 'Puedes agregar varias hojas según sea necesario, el sistema procesará todas las hojas',
        'tip_4': 'El tamaño del archivo no debe exceder los 10MB',
        'tip_5': 'Formato de archivo soportado: .xlsx',
        'start_validation': '🚀 Iniciar verificación',
        'theme_toggle': 'Cambiar tema',
        'initializing': 'Inicializando...',
        'file_preview': 'Vista previa del archivo',
        'excel_results_title': '📊 Resultados de verificación por lote (Excel)',
        'single_results_title': '✏️ Resultados de verificación individual',
        'footer_copyright': '© 2025 Jui-Hsuan Lee. Todos los derechos reservados.',
        'language': 'Idioma',
        'zh_tw': 'Chino Tradicional',
        'zh_cn': 'Chino Simplificado',
        'en': 'Inglés',
        'es': 'Español',
        'ja': 'Japonés',
        'ko': 'Coreano'
    },
    // 日文
    'ja': {
        'page_title': 'QA検証システム',
        'page_subtitle': 'ファイルをアップロードして品質分析を開始します',
        'step_1_title': 'ステップ1：AnythingLLM接続設定',
        'step_2_title': 'ステップ2：ワークスペースを選択',
        'step_3_title': 'ステップ3：検証モードを選択',
        'step_4_title': 'ステップ4：検証用Q&Aセットをアップロード（Excel）',
        'step_4_single_title': 'ステップ4：質問を入力',
        'step_4_single_answer_title': 'ステップ4：標準回答を入力',
        'api_url_label': 'API URL',
        'api_key_label': 'APIキー',
        'api_url_placeholder': '例：http://localhost:3001',
        'api_key_placeholder': 'APIキーを入力してください',
        'validate_connection': '🔗 接続を検証',
        'save_settings': '💾 設定を保存',
        'connection_status': '未検証',
        'connection_status_verified': '検証済み',
        'connection_status_failed': '検証失敗',
        'advanced_settings': '⚙️ 詳細設定',
        'model_label': 'LLMモデル',
        'model_placeholder': '例：llama3.1:8b-instruct-fp16',
        'similarity_threshold_label': '類似度しきい値',
        'similarity_threshold_placeholder': '例：0.7',
        'workspace_label': 'ワークスペースを選択',
        'workspace_placeholder': '接続を検証してワークスペースリストを読み込んでください',
        'refresh_workspaces': '🔄 再読み込み',
        'workspace_help': 'まずステップ1の接続検証を完了してください。システムが利用可能なワークスペースリストを自動で読み込みます',
        'validation_mode_label': '検証モードを選択',
        'excel_mode': '📊 Excelバッチ検証',
        'single_mode': '✏️ 単一テキスト検証',
        'excel_file_label': '検証用Q&Aセットをアップロード（Excel）',
        'excel_format_help': '📋 Excelフォーマットガイド',
        'single_question_label': '質問を入力',
        'single_answer_label': '標準回答を入力',
        'single_question_placeholder': '検証する質問を入力してください...',
        'single_answer_placeholder': '期待される標準回答を入力してください...',
        'excel_format_title': '📝 Excelファイルフォーマットガイド',
        'excel_format_desc': '以下の必須フィールドを含むExcelファイル（.xlsx）を用意してください：',
        'field_name': 'フィールド名',
        'description': '説明',
        'required': '必須',
        'example': '例',
        'question_field': '質問',
        'answer_field': '標準回答',
        'question_desc': '検証する質問内容',
        'answer_desc': '期待される標準回答',
        'required_text': '必須',
        'question_example': '機械学習とは何ですか？',
        'answer_example': '機械学習は人工知能の一分野です...',
        'example_table_title': '📊 サンプルテーブル',
        'python_question': 'Pythonとは何ですか？',
        'python_answer': 'Pythonは、クリーンな構文と強力な機能で知られる高水準プログラミング言語です。手続き型、オブジェクト指向、関数型など複数のパラダイムをサポートします。',
        'ml_question': '機械学習の主な種類は何ですか？',
        'ml_answer': '機械学習は主に3つのタイプに分かれます：教師あり学習、教師なし学習、強化学習。教師あり学習はラベル付きデータを使用し、教師なし学習はラベルなしデータを処理し、強化学習は環境との相互作用を通じて学習します。',
        'dl_question': 'ディープラーニングとは何ですか？',
        'dl_answer': 'ディープラーニングは機械学習のサブセットであり、多層ニューラルネットワークを使用してデータの複雑なパターンを学習します。特徴を自動的に抽出し、画像認識や自然言語処理などの分野で優れた性能を発揮します。',
        'download_example_title': '📥 サンプルファイルのダウンロード',
        'download_example_desc': '下のボタンをクリックしてサンプルExcelファイルをダウンロードできます。このフォーマットを参考にQ&Aセットを作成してください：',
        'download_example_btn': '📄 サンプルExcelファイルをダウンロード',
        'tips_title': '💡 利用のヒント',
        'tip_1': '質問と標準回答の両方に内容があることを確認してください',
        'tip_2': '標準回答には完全な説明を含めると、より良い類似度評価が得られます',
        'tip_3': '必要に応じて複数のワークシートを追加できます。システムはすべてのワークシートを処理します',
        'tip_4': 'ファイルサイズは10MBを超えないようにしてください',
        'tip_5': 'サポートされているファイル形式：.xlsx',
        'start_validation': '🚀 検証開始',
        'theme_toggle': 'テーマ切替',
        'initializing': '初期化中...',
        'file_preview': 'ファイルプレビュー',
        'excel_results_title': '📊 Excelバッチ検証結果',
        'single_results_title': '✏️ 単一検証結果',
        'footer_copyright': '© 2025 Jui-Hsuan Lee. All Rights Reserved.',
        'language': '言語',
        'zh_tw': '繁体字中国語',
        'zh_cn': '簡体字中国語',
        'en': '英語',
        'es': 'スペイン語',
        'ja': '日本語',
        'ko': '韓国語'
    },
    // 韓文
    'ko': {
        'page_title': 'QA 검증 시스템',
        'page_subtitle': '파일을 업로드하여 품질 분석을 시작하세요',
        'step_1_title': '1단계: AnythingLLM 연결 설정',
        'step_2_title': '2단계: 워크스페이스 선택',
        'step_3_title': '3단계: 검증 모드 선택',
        'step_4_title': '4단계: 검증 Q&A 세트 업로드(Excel)',
        'step_4_single_title': '4단계: 질문 입력',
        'step_4_single_answer_title': '4단계: 표준 답변 입력',
        'api_url_label': 'API URL',
        'api_key_label': 'API 키',
        'api_url_placeholder': '예: http://localhost:3001',
        'api_key_placeholder': 'API 키를 입력하세요',
        'validate_connection': '🔗 연결 검증',
        'save_settings': '💾 설정 저장',
        'connection_status': '미검증',
        'connection_status_verified': '검증됨',
        'connection_status_failed': '검증 실패',
        'advanced_settings': '⚙️ 고급 설정',
        'model_label': 'LLM 모델',
        'model_placeholder': '예: llama3.1:8b-instruct-fp16',
        'similarity_threshold_label': '유사도 임계값',
        'similarity_threshold_placeholder': '예: 0.7',
        'workspace_label': '워크스페이스 선택',
        'workspace_placeholder': '연결을 검증하여 워크스페이스 목록을 불러오세요',
        'refresh_workspaces': '🔄 새로고침',
        'workspace_help': '1단계 연결 검증을 먼저 완료하세요. 시스템이 사용 가능한 워크스페이스 목록을 자동으로 불러옵니다',
        'validation_mode_label': '검증 모드 선택',
        'excel_mode': '📊 Excel 일괄 검증',
        'single_mode': '✏️ 단일 텍스트 검증',
        'excel_file_label': '검증 Q&A 세트 업로드(Excel)',
        'excel_format_help': '📋 Excel 형식 안내',
        'single_question_label': '질문 입력',
        'single_answer_label': '표준 답변 입력',
        'single_question_placeholder': '검증할 질문을 입력하세요...',
        'single_answer_placeholder': '예상 표준 답변을 입력하세요...',
        'excel_format_title': '📝 Excel 파일 형식 안내',
        'excel_format_desc': '다음 필수 필드가 포함된 Excel 파일(.xlsx)을 준비하세요:',
        'field_name': '필드명',
        'description': '설명',
        'required': '필수',
        'example': '예시',
        'question_field': '질문',
        'answer_field': '표준 답변',
        'question_desc': '검증할 질문 내용',
        'answer_desc': '예상 표준 답변',
        'required_text': '필수',
        'question_example': '머신러닝이란 무엇입니까?',
        'answer_example': '머신러닝은 인공지능의 한 분야입니다...',
        'example_table_title': '📊 예시 테이블',
        'python_question': '파이썬이란 무엇입니까?',
        'python_answer': '파이썬은 간결한 문법과 강력한 기능으로 유명한 고급 프로그래밍 언어입니다. 절차형, 객체지향, 함수형 등 다양한 패러다임을 지원합니다.',
        'ml_question': '머신러닝의 주요 유형은 무엇입니까?',
        'ml_answer': '머신러닝은 주로 세 가지 유형으로 나뉩니다: 지도 학습, 비지도 학습, 강화 학습. 지도 학습은 라벨이 지정된 데이터를 사용하고, 비지도 학습은 라벨이 없는 데이터를 처리하며, 강화 학습은 환경과의 상호작용을 통해 학습합니다.',
        'dl_question': '딥러닝이란 무엇입니까?',
        'dl_answer': '딥러닝은 머신러닝의 하위 집합으로, 다층 신경망을 사용하여 데이터의 복잡한 패턴을 학습합니다. 특징을 자동으로 추출하며, 이미지 인식, 자연어 처리 등에서 뛰어난 성능을 보입니다.',
        'download_example_title': '📥 예시 파일 다운로드',
        'download_example_desc': '아래 버튼을 클릭하여 예시 Excel 파일을 다운로드할 수 있습니다. 이 형식을 참고하여 Q&A 세트를 준비하세요:',
        'download_example_btn': '📄 예시 Excel 파일 다운로드',
        'tips_title': '💡 사용 팁',
        'tip_1': '질문과 표준 답변 필드 모두에 내용이 있는지 확인하세요',
        'tip_2': '표준 답변에는 완전한 설명을 포함하면 더 나은 유사도 평가가 가능합니다',
        'tip_3': '필요에 따라 여러 워크시트를 추가할 수 있으며, 시스템이 모든 워크시트를 처리합니다',
        'tip_4': '파일 크기는 10MB를 초과하지 않아야 합니다',
        'tip_5': '지원되는 파일 형식: .xlsx',
        'start_validation': '🚀 검증 시작',
        'theme_toggle': '테마 전환',
        'initializing': '초기화 중...',
        'file_preview': '파일 미리보기',
        'excel_results_title': '📊 Excel 일괄 검증 결과',
        'single_results_title': '✏️ 단일 검증 결과',
        'footer_copyright': '© 2025 Jui-Hsuan Lee. All Rights Reserved.',
        'language': '언어',
        'zh_tw': '번체 중국어',
        'zh_cn': '간체 중국어',
        'en': '영어',
        'es': '스페인어',
        'ja': '일본어',
        'ko': '한국어'
    },
    // 簡體中文
    'zh-CN': {
        'page_title': 'QA自动化验证系统',
        'page_subtitle': '上传您的文件以开始质量分析',
        'step_1_title': '步骤1：AnythingLLM连接设置',
        'step_2_title': '步骤2：选择工作区',
        'step_3_title': '步骤3：选择验证模式',
        'step_4_title': '步骤4：上传验证问答集（Excel）',
        'step_4_single_title': '步骤4：输入问题',
        'step_4_single_answer_title': '步骤4：输入标准答案',
        'api_url_label': 'API URL',
        'api_key_label': 'API密钥',
        'api_url_placeholder': '例如：http://localhost:3001',
        'api_key_placeholder': '请输入您的API密钥',
        'validate_connection': '🔗 验证连接',
        'save_settings': '💾 保存设置',
        'connection_status': '未验证',
        'connection_status_verified': '已验证',
        'connection_status_failed': '验证失败',
        'advanced_settings': '⚙️ 高级设置',
        'model_label': 'LLM模型',
        'model_placeholder': '例如：llama3.1:8b-instruct-fp16',
        'similarity_threshold_label': '相似度阈值',
        'similarity_threshold_placeholder': '例如：0.7',
        'workspace_label': '选择工作区',
        'workspace_placeholder': '请先验证连接以加载工作区列表',
        'refresh_workspaces': '🔄 重新加载',
        'workspace_help': '请先完成步骤1的连接验证，系统会自动加载可用的工作区列表',
        'validation_mode_label': '选择验证模式',
        'excel_mode': '📊 Excel批量验证',
        'single_mode': '✏️ 单条文本验证',
        'excel_file_label': '上传验证问答集（Excel）',
        'excel_format_help': '📋 Excel格式说明',
        'single_question_label': '输入问题',
        'single_answer_label': '输入标准答案',
        'single_question_placeholder': '请输入要验证的问题...',
        'single_answer_placeholder': '请输入预期的标准答案...',
        'excel_format_title': '📝 Excel文件格式说明',
        'excel_format_desc': '请准备一个Excel文件（.xlsx），包含以下必要字段：',
        'field_name': '字段名称',
        'description': '说明',
        'required': '必填',
        'example': '示例',
        'question_field': '问题',
        'answer_field': '标准答案',
        'question_desc': '要验证的问题内容',
        'answer_desc': '预期的标准答案',
        'required_text': '必填',
        'question_example': '什么是机器学习？',
        'answer_example': '机器学习是人工智能的一个分支...',
        'example_table_title': '📊 示例表格',
        'python_question': '什么是Python？',
        'python_answer': 'Python是一种高级编程语言，以其简洁的语法和强大的功能而闻名。它支持多种编程范式，包括过程式、面向对象和函数式编程。',
        'ml_question': '机器学习的主要类型有哪些？',
        'ml_answer': '机器学习主要分为三种类型：监督学习、无监督学习和强化学习。监督学习使用带标签的训练数据，无监督学习处理未标记的数据，强化学习通过与环境交互来学习。',
        'dl_question': '什么是深度学习？',
        'dl_answer': '深度学习是机器学习的一个子集，使用多层神经网络来学习数据的复杂模式。它能够自动提取特征，并在图像识别、自然语言处理等领域表现出色。',
        'download_example_title': '📥 下载示例文件',
        'download_example_desc': '点击下方按钮下载示例Excel文件，您可以参考此格式来准备您的问答集：',
        'download_example_btn': '📄 下载示例Excel文件',
        'tips_title': '💡 使用提示',
        'tip_1': '确保问题和标准答案字段都有内容',
        'tip_2': '标准答案建议包含完整的解释，这样能获得更好的相似度评估',
        'tip_3': '可以根据需要添加多个工作表，系统会处理所有工作表',
        'tip_4': '文件大小建议不超过10MB',
        'tip_5': '支持的文件格式：.xlsx',
        'start_validation': '🚀 开始验证',
        'theme_toggle': '切换主题',
        'initializing': '正在初始化...',
        'file_preview': '文件预览',
        'excel_results_title': '📊 Excel批量验证结果',
        'single_results_title': '✏️ 单条验证结果',
        'footer_copyright': '© 2025 Jui-Hsuan Lee. All Rights Reserved.',
        'language': '语言',
        'zh_tw': '繁體中文',
        'zh_cn': '简体中文',
        'en': '英文',
        'es': '西班牙文',
        'ja': '日文',
        'ko': '韩文'
    }
};

// 當前語言
let currentLanguage = 'zh-TW';

// 初始化語言
function initLanguage() {
    // 從 localStorage 讀取語言設定
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && i18n[savedLanguage]) {
        currentLanguage = savedLanguage;
    } else {
        // 預設使用瀏覽器語言
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('zh')) {
            currentLanguage = 'zh-TW';
        } else {
            currentLanguage = 'en';
        }
    }
    
    // 更新頁面語言
    document.documentElement.lang = currentLanguage;
    
    // 應用翻譯
    applyTranslations();
}

// 切換語言
function switchLanguage(lang) {
    if (i18n[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang;
        applyTranslations();
    }
}

// 取得翻譯文字
function t(key) {
    return i18n[currentLanguage][key] || key;
}

// 應用翻譯到頁面
function applyTranslations() {
    // 更新所有帶有 data-i18n 屬性的元素
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // 更新頁面標題
    document.title = t('page_title');
    
    // 更新特定元素
    updateSpecificElements();
}

// 更新特定元素
function updateSpecificElements() {
    // 更新頁面標題
    const pageTitle = document.querySelector('h1');
    if (pageTitle) pageTitle.textContent = t('page_title');
    
    const pageSubtitle = document.querySelector('header p');
    if (pageSubtitle) pageSubtitle.textContent = t('page_subtitle');
    
    // 更新步驟標題
    const step1Title = document.querySelector('.connection-legend');
    if (step1Title) {
        const icon = step1Title.querySelector('.legend-icon');
        const status = step1Title.querySelector('.connection-status');
        step1Title.innerHTML = `${icon ? icon.outerHTML : ''} ${t('step_1_title')} ${status ? status.outerHTML : ''}`;
    }
    
    // 更新其他元素...
    updateFormLabels();
    updateButtons();
    updateHelpContent();
}

// 更新表單標籤
function updateFormLabels() {
    // API URL
    const apiUrlLabel = document.querySelector('label[for="api_url"]');
    if (apiUrlLabel) apiUrlLabel.innerHTML = `${t('api_url_label')}<span class="required-star">*</span>`;
    
    // API Key
    const apiKeyLabel = document.querySelector('label[for="api_key"]');
    if (apiKeyLabel) apiKeyLabel.innerHTML = `${t('api_key_label')}<span class="required-star">*</span>`;
    
    // 工作區
    const workspaceLabel = document.querySelector('label[for="workspace"]');
    if (workspaceLabel) workspaceLabel.innerHTML = `${t('step_2_title')}<span class="required-star">*</span>`;
    
    // 驗證模式
    const modeLabel = document.querySelector('.form-group label');
    if (modeLabel && modeLabel.textContent.includes('步驟 3')) {
        modeLabel.textContent = t('step_3_title');
    }
}

// 更新按鈕
function updateButtons() {
    // 驗證連線按鈕
    const validateBtn = document.getElementById('validate-connection-btn');
    if (validateBtn) validateBtn.textContent = t('validate_connection');
    
    // 儲存設定按鈕
    const saveBtn = document.getElementById('save-settings-btn');
    if (saveBtn) saveBtn.textContent = t('save_settings');
    
    // 開始驗證按鈕
    const submitBtn = document.querySelector('.btn-text');
    if (submitBtn) submitBtn.textContent = t('start_validation');
}

// 更新說明內容
function updateHelpContent() {
    // Excel 格式說明
    const helpTitle = document.querySelector('#excel-help-content h3');
    if (helpTitle) helpTitle.textContent = t('excel_format_title');
    
    const helpDesc = document.querySelector('#excel-help-content p');
    if (helpDesc) helpDesc.textContent = t('excel_format_desc');
}

// 導出函數供其他檔案使用
window.i18n = {
    t,
    switchLanguage,
    initLanguage,
    currentLanguage: () => currentLanguage
}; 