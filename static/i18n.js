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
        'tip_4': '檔案大小建議不超過 10MB',
        'tip_5': '支援的檔案格式：.xlsx',
        
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
        'en': 'English'
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
        'tip_4': 'File size should not exceed 10MB',
        'tip_5': 'Supported file format: .xlsx',
        
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
        'zh_tw': '繁體中文',
        'en': 'English'
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