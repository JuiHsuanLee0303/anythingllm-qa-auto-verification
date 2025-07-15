document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upload-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');

    const statusSection = document.getElementById('status-section');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');
    const logs = document.getElementById('logs');
    
    // 結果區塊元素
    const excelResultsSection = document.getElementById('excel-results-section');
    const excelResultsContainer = document.getElementById('excel-results-container');
    const singleResultsSection = document.getElementById('single-results-section');
    const singleResultsContainer = document.getElementById('single-results-container');

    // Modal elements
    const modal = document.getElementById('preview-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-btn');

    // Advanced settings
    const toggleAdvancedBtn = document.getElementById('toggle-advanced');
    const advancedOptions = document.getElementById('advanced-options');

    // Connection settings elements
    const connectionSettings = document.getElementById('connection-settings');
    const connectionStatus = document.getElementById('connection-status');

    // Validation elements
    const validateBtn = document.getElementById('validate-connection-btn');
    const saveBtn = document.getElementById('save-settings-btn');
    const validationStatus = document.getElementById('validation-status');
    
    // Workspace elements
    const workspaceSelect = document.getElementById('workspace');
    const refreshWorkspacesBtn = document.getElementById('refresh-workspaces-btn');
    
    // API input elements for monitoring changes
    const apiUrlInput = document.getElementById('api_url');
    const apiKeyInput = document.getElementById('api_key');

    // Excel help elements
    const toggleExcelHelpBtn = document.getElementById('toggle-excel-help');
    const excelHelpContent = document.getElementById('excel-help-content');
    const downloadExampleBtn = document.getElementById('download-example');

    // Theme toggle elements
    const themeToggleBtn = document.getElementById('theme-toggle-btn');

    // Mode selector elements
    const excelModeBtn = document.getElementById('excel-mode-btn');
    const singleModeBtn = document.getElementById('single-mode-btn');
    const excelMode = document.getElementById('excel-mode');
    const singleMode = document.getElementById('single-mode');

    let eventSource;

    // --- Theme Functions ---

    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a subtle animation effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // --- Mode Functions ---

    function switchMode(mode) {
        // Update button states
        excelModeBtn.classList.toggle('active', mode === 'excel');
        singleModeBtn.classList.toggle('active', mode === 'single');
        
        // Update content visibility
        excelMode.classList.toggle('active', mode === 'excel');
        singleMode.classList.toggle('active', mode === 'single');
        
        // Update results sections visibility
        excelResultsSection.classList.toggle('hidden', mode !== 'excel');
        singleResultsSection.classList.toggle('hidden', mode !== 'single');
        
        // Update form validation
        updateFormValidation(mode);
    }

    function updateFormValidation(mode) {
        const excelFile = document.getElementById('excel_file');
        const singleQuestion = document.getElementById('single_question');
        const singleAnswer = document.getElementById('single_answer');
        
        if (mode === 'excel') {
            excelFile.required = true;
            singleQuestion.required = false;
            singleAnswer.required = false;
        } else {
            excelFile.required = false;
            singleQuestion.required = true;
            singleAnswer.required = true;
        }
    }

    // --- Functions ---

    function loadSettings() {
        const apiUrl = localStorage.getItem('advanced_api_url');
        const apiKey = localStorage.getItem('advanced_api_key');
        const model = localStorage.getItem('advanced_model');
        const threshold = localStorage.getItem('advanced_similarity_threshold');

        // Only load from localStorage if the value exists, otherwise keep default from backend
        if (apiUrl !== null) document.getElementById('api_url').value = apiUrl;
        if (apiKey !== null) document.getElementById('api_key').value = apiKey;
        if (model !== null) document.getElementById('model').value = model;
        if (threshold !== null) document.getElementById('similarity_threshold').value = threshold;
    }

    function saveSettings() {
        const apiUrl = document.getElementById('api_url').value;
        const apiKey = document.getElementById('api_key').value;
        const model = document.getElementById('model').value;
        const threshold = document.getElementById('similarity_threshold').value;

        localStorage.setItem('advanced_api_url', apiUrl);
        localStorage.setItem('advanced_api_key', apiKey);
        localStorage.setItem('advanced_model', model);
        localStorage.setItem('advanced_similarity_threshold', threshold);

        validationStatus.textContent = '✅ 設定已儲存！';
        validationStatus.className = 'success';
        setTimeout(() => {
            if (validationStatus.textContent === '✅ 設定已儲存！') {
                validationStatus.textContent = '';
                validationStatus.className = '';
            }
        }, 3000);
    }

    async function loadWorkspaces(apiUrl, apiKey) {
        try {
            // 顯示載入狀態
            workspaceSelect.innerHTML = '<option value="">正在載入工作區...</option>';
            workspaceSelect.disabled = true;
            refreshWorkspacesBtn.disabled = true;
            
            // 更新驗證狀態為載入中
            validationStatus.textContent = '🔄 正在載入工作區列表...';
            validationStatus.className = '';

            const response = await fetch('/api/get_workspaces', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ api_url: apiUrl, api_key: apiKey })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // 清空並重新填充工作區選單
                workspaceSelect.innerHTML = '<option value="">請選擇工作區</option>';
                
                if (result.workspaces && result.workspaces.length > 0) {
                    result.workspaces.forEach(workspace => {
                        const option = document.createElement('option');
                        // 優先使用 slug，如果沒有則使用 id
                        option.value = workspace.slug || workspace.id;
                        option.textContent = `${workspace.name} (${workspace.slug || workspace.id})`;
                        option.dataset.workspaceId = workspace.id;
                        option.dataset.workspaceName = workspace.name;
                        workspaceSelect.appendChild(option);
                    });
                    
                    // 顯示成功訊息
                    validationStatus.textContent = `✅ ${result.message}`;
                    validationStatus.className = 'success';
                } else {
                    workspaceSelect.innerHTML = '<option value="">沒有找到工作區</option>';
                    validationStatus.textContent = '⚠️ 沒有找到任何工作區';
                    validationStatus.className = 'warning';
                }
                
                // 啟用工作區選擇功能
                workspaceSelect.disabled = false;
                refreshWorkspacesBtn.disabled = false;
                
            } else {
                workspaceSelect.innerHTML = '<option value="">載入工作區失敗</option>';
                validationStatus.textContent = `❌ ${result.message}`;
                validationStatus.className = 'error';
                disableWorkspaceFeatures();
            }
        } catch (error) {
            console.error('載入工作區時發生錯誤:', error);
            workspaceSelect.innerHTML = '<option value="">載入工作區失敗</option>';
            validationStatus.textContent = '❌ 載入工作區時發生錯誤';
            validationStatus.className = 'error';
            disableWorkspaceFeatures();
        }
    }

    function resetWorkspaceSelector() {
        workspaceSelect.innerHTML = '<option value="">請先驗證連線以載入工作區列表</option>';
        workspaceSelect.disabled = true;
        refreshWorkspacesBtn.disabled = true;
        
        // 重置連線狀態
        connectionStatus.textContent = '未驗證';
        connectionSettings.classList.remove('verified');
        connectionSettings.classList.remove('collapsed');
    }

    function disableWorkspaceFeatures() {
        workspaceSelect.innerHTML = '<option value="">請先驗證連線以載入工作區列表</option>';
        workspaceSelect.disabled = true;
        refreshWorkspacesBtn.disabled = true;
    }

    function downloadExampleFile() {
        // 使用後端 API 下載 Excel 範例檔案
        fetch('/api/download_example')
            .then(response => {
                if (!response.ok) {
                    throw new Error('下載失敗');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'qa_example.xlsx';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('下載範例檔案時發生錯誤:', error);
                alert('下載範例檔案時發生錯誤，請稍後再試。');
            });
    }
    
    function initializeConnectionUI() {
        // 檢查是否有已儲存的 API URL 和 API Key
        const savedApiUrl = localStorage.getItem('advanced_api_url');
        const savedApiKey = localStorage.getItem('advanced_api_key');
        
        // 如果有已儲存的設定，檢查是否已經驗證過
        if (savedApiUrl && savedApiKey) {
            // 檢查工作區選單是否有選項（表示之前驗證成功過）
            if (workspaceSelect.options.length > 1) {
                // 之前驗證成功過，收合連線設定區塊
                connectionStatus.textContent = '已驗證';
                connectionSettings.classList.add('verified');
                connectionSettings.classList.add('collapsed');
            }
        }
    }

    // --- Event Listeners ---

    // Load theme and settings from localStorage when the page loads
    loadTheme();
    loadSettings();
    
    // Initialize form validation based on current mode
    const currentMode = excelModeBtn.classList.contains('active') ? 'excel' : 'single';
    updateFormValidation(currentMode);
    
    // Initialize connection UI
    initializeConnectionUI();

    // Theme toggle event listener
    themeToggleBtn.addEventListener('click', toggleTheme);

    // Mode selector event listeners
    excelModeBtn.addEventListener('click', () => switchMode('excel'));
    singleModeBtn.addEventListener('click', () => switchMode('single'));

    toggleAdvancedBtn.addEventListener('click', () => {
        const fieldset = toggleAdvancedBtn.parentElement;
        fieldset.classList.toggle('open');
    });
    
    // Connection settings toggle
    connectionSettings.addEventListener('click', (e) => {
        // 只有點擊 legend 時才觸發收合
        if (e.target.closest('.connection-legend')) {
            connectionSettings.classList.toggle('collapsed');
        }
    });

    toggleExcelHelpBtn.addEventListener('click', () => {
        const helpContainer = toggleExcelHelpBtn.parentElement;
        helpContainer.classList.toggle('open');
    });

    saveBtn.addEventListener('click', saveSettings);

    downloadExampleBtn.addEventListener('click', downloadExampleFile);

    validateBtn.addEventListener('click', async () => {
        const apiUrl = apiUrlInput.value;
        const apiKey = apiKeyInput.value;

        if (!apiUrl || !apiKey) {
            validationStatus.textContent = '請先填寫 API URL 和金鑰。';
            validationStatus.className = 'error';
            return;
        }

        // 驗證時，先顯示載入狀態並禁用工作區選單
        validationStatus.textContent = '正在驗證...';
        validationStatus.className = '';
        workspaceSelect.innerHTML = '<option value="">正在驗證連線...</option>';
        workspaceSelect.disabled = true;
        refreshWorkspacesBtn.disabled = true;

        try {
            const response = await fetch('/api/validate_connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ api_url: apiUrl, api_key: apiKey })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                validationStatus.textContent = '✅ ' + result.message;
                validationStatus.className = 'success';
                
                // 更新連線狀態
                connectionStatus.textContent = '已驗證';
                connectionSettings.classList.add('verified');
                
                // 延遲收合連線設定區塊
                setTimeout(() => {
                    connectionSettings.classList.add('collapsed');
                }, 2000);
                
                // 驗證成功後自動載入工作區列表
                await loadWorkspaces(apiUrl, apiKey);
            } else {
                validationStatus.textContent = '❌ ' + result.message;
                validationStatus.className = 'error';
                // 驗證失敗時禁用工作區相關功能
                disableWorkspaceFeatures();
            }
        } catch (error) {
            validationStatus.textContent = '❌ 驗證請求失敗，請檢查主控台。';
            validationStatus.className = 'error';
            console.error('Validation fetch error:', error);
            disableWorkspaceFeatures();
        }
    });

    // 重新載入工作區列表
    refreshWorkspacesBtn.addEventListener('click', async () => {
        const apiUrl = apiUrlInput.value;
        const apiKey = apiKeyInput.value;

        if (!apiUrl || !apiKey) {
            alert('請先填寫 API URL 和金鑰。');
            return;
        }

        await loadWorkspaces(apiUrl, apiKey);
    });

    // 監聽 API URL 與 API Key 欄位變動，自動重設工作區選單
    apiUrlInput.addEventListener('input', resetWorkspaceSelector);
    apiKeyInput.addEventListener('input', resetWorkspaceSelector);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset UI from previous runs
        resetUI();

        // Show loading state on button
        setButtonLoading(true);

        const formData = new FormData(form);

        // Append advanced settings if they have values
        const apiUrl = apiUrlInput.value;
        const apiKey = apiKeyInput.value;
        const model = document.getElementById('model').value;
        const similarityThreshold = document.getElementById('similarity_threshold').value;

        if (apiUrl) formData.append('api_url', apiUrl);
        if (apiKey) formData.append('api_key', apiKey);
        if (model) formData.append('model', model);
        if (similarityThreshold) formData.append('similarity_threshold', similarityThreshold);

        // Determine the current mode and set the appropriate endpoint
        const currentMode = excelModeBtn.classList.contains('active') ? 'excel' : 'single';
        const endpoint = currentMode === 'excel' ? '/api/verify' : '/api/verify_single';

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '上傳失敗，請檢查伺服器日誌。');
            }

            const data = await response.json();
            const taskId = data.task_id;

            statusSection.classList.remove('hidden');
            logs.innerHTML = ''; // Clear previous logs
            listenForUpdates(taskId);

        } catch (error) {
            console.error('Submission error:', error);
            showError(`提交錯誤: ${error.message}`);
            setButtonLoading(false);
        }
    });

    function setButtonLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }

    function resetUI() {
        statusSection.classList.add('hidden');
        
        // Reset all results sections
        excelResultsSection.classList.add('hidden');
        singleResultsSection.classList.add('hidden');
        excelResultsContainer.innerHTML = '';
        singleResultsContainer.innerHTML = '';
        
        logs.innerHTML = '';
        progressBarFill.style.width = '0%';
        progressText.textContent = '正在初始化...';
    }

    function listenForUpdates(taskId) {
        if (eventSource) {
            eventSource.close();
        }

        eventSource = new EventSource(`/stream/${taskId}`);

        eventSource.onmessage = function(event) {
            const data = JSON.parse(event.data);

            if (data.log) {
                const logEntry = document.createElement('div');
                logEntry.textContent = data.log;
                logs.appendChild(logEntry);
                logs.scrollTop = logs.scrollHeight; // Auto-scroll
            }

            if (data.progress !== undefined) {
                const progress = Math.round(data.progress);
                progressBarFill.style.width = `${progress}%`;
                progressText.textContent = data.status || `處理中... ${progress}%`;
            }

            if (data.status === '完成') {
                progressText.textContent = '任務完成！正在準備結果...';
                progressBarFill.style.width = '100%';
                eventSource.close();
                setButtonLoading(false);
                fetchResults(taskId);
            }
        };

        eventSource.onerror = function(err) {
            console.error('EventSource failed:', err);
            showError('與伺服器的即時連線中斷，請重試。');
            eventSource.close();
            setButtonLoading(false);
        };
    }

    async function fetchResults(taskId) {
        try {
            const response = await fetch(`/api/results/${taskId}`);
            if (!response.ok) {
                throw new Error('無法獲取結果檔案列表。');
            }
            const files = await response.json();
            
            // 檢查是否為單筆驗證結果
            const isSingleVerification = files.some(file => file.includes('single_verification'));
            if (isSingleVerification) {
                // 獲取單筆驗證的詳細結果
                const singleResultResponse = await fetch(`/api/single_result/${taskId}`);
                if (singleResultResponse.ok) {
                    const singleResult = await singleResultResponse.json();
                    displaySingleResult(singleResult);
                } else {
                    // 如果無法獲取詳細結果，顯示檔案列表
                    displayResults(files, taskId);
                }
            } else {
                // Excel 批次驗證結果
                displayResults(files, taskId);
            }
        } catch (error) {
            console.error('Fetch results error:', error);
            showError(`獲取結果時發生錯誤: ${error.message}`);
        }
    }

    function displaySingleResult(result) {
        singleResultsContainer.innerHTML = ''; // Clear previous results
        
        const resultCard = document.createElement('div');
        resultCard.className = 'single-result-card';
        
        const similarityScore = result.similarity_scores?.cosine_similarity || 0;
        const similarityPercentage = Math.round(similarityScore * 100);
        
        // 根據相似度分數決定顏色和狀態
        let statusClass = 'low';
        let statusText = '相似度較低';
        if (similarityScore >= 0.8) {
            statusClass = 'high';
            statusText = '相似度很高';
        } else if (similarityScore >= 0.6) {
            statusClass = 'medium';
            statusText = '相似度中等';
        }
        
        resultCard.innerHTML = `
            <div class="single-result-header">
                <h3>📊 單筆驗證結果</h3>
                <div class="similarity-score ${statusClass}">
                    <div class="score-circle" style="--score: ${similarityScore}">
                        <span class="score-number">${similarityPercentage}%</span>
                        <span class="score-label">相似度</span>
                    </div>
                    <div class="score-status">${statusText}</div>
                </div>
            </div>
            
            <div class="result-content">
                <div class="result-section">
                    <h4>❓ 問題</h4>
                    <div class="content-box question-box">
                        ${result.question || '未提供問題'}
                    </div>
                </div>
                
                <div class="result-section">
                    <h4>✅ 標準答案</h4>
                    <div class="content-box standard-answer-box">
                        ${result.standard_answer || '未提供標準答案'}
                    </div>
                </div>
                
                <div class="result-section">
                    <h4>🤖 LLM 回答</h4>
                    <div class="content-box llm-answer-box">
                        ${result.llm_response || '未獲取到 LLM 回答'}
                    </div>
                </div>
                
                <div class="result-section">
                    <h4>📈 詳細分數</h4>
                    <div class="scores-grid">
                        <div class="score-item">
                            <span class="score-name">BERT Score</span>
                            <span class="score-value">${(result.similarity_scores?.bert_score || 0).toFixed(4)}</span>
                        </div>
                        <div class="score-item">
                            <span class="score-name">餘弦相似度</span>
                            <span class="score-value">${(result.similarity_scores?.cosine_similarity || 0).toFixed(4)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="result-actions">
                <button type="button" class="btn btn-primary" onclick="downloadSingleResult('${result.task_id}')">
                    📄 下載詳細報告
                </button>
                <button type="button" class="btn btn-secondary" onclick="resetForm()">
                    🔄 重新驗證
                </button>
            </div>
        `;
        
        singleResultsContainer.appendChild(resultCard);
        singleResultsSection.classList.remove('hidden');
    }

    function displayResults(files, taskId) {
        excelResultsContainer.innerHTML = ''; // Clear previous results
        if (files.length === 0) {
            excelResultsContainer.innerHTML = '<p>沒有生成任何結果檔案。</p>';
        } else {
            files.forEach(fileName => {
                const card = document.createElement('div');
                card.className = 'result-card';
                
                card.innerHTML = `
                    <div class="file-name">${fileName}</div>
                    <div class="actions">
                        <a href="/outputs/${taskId}/${fileName}" download class="btn btn-primary">下載</a>
                        <button class="btn btn-secondary" data-task-id="${taskId}" data-filename="${fileName}">預覽</button>
                    </div>
                `;
                excelResultsContainer.appendChild(card);
            });
        }
        excelResultsSection.classList.remove('hidden');
    }

    function showError(message) {
        progressText.textContent = `錯誤: ${message}`;
        progressText.style.color = 'var(--error)';
        statusSection.classList.remove('hidden');
        progressBarFill.style.width = '100%';
        progressBarFill.style.backgroundColor = 'var(--error)';
    }

    // --- Modal Logic ---

    // Open modal for both result containers
    function setupPreviewListeners(container) {
        container.addEventListener('click', async (e) => {
            if (e.target.classList.contains('btn-secondary') && e.target.textContent === '預覽') {
                const taskId = e.target.dataset.taskId;
                const filename = e.target.dataset.filename;
                
                modalTitle.textContent = `預覽: ${filename}`;
                modalBody.innerHTML = '<p>正在載入預覽...</p>';
                modal.style.display = 'flex';

                try {
                    const response = await fetch(`/api/preview/${taskId}/${filename}`);
                    if (!response.ok) {
                        throw new Error(`Server error: ${response.statusText}`);
                    }
                    const previewContent = await response.text();
                    modalBody.innerHTML = previewContent;
                } catch (error) {
                    console.error('Preview error:', error);
                    modalBody.innerHTML = `<p style="color: var(--error-color);">無法載入預覽: ${error.message}</p>`;
                }
            }
        });
    }

    // Setup preview listeners for both result containers
    setupPreviewListeners(excelResultsContainer);
    setupPreviewListeners(singleResultsContainer);

    // Close modal
    function hideModal() {
        modal.style.display = 'none';
        modalBody.innerHTML = ''; // Clear content
    }

    closeModalBtn.addEventListener('click', hideModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // Click on the background overlay
            hideModal();
        }
    });
});

// 全域函數定義
function downloadSingleResult(taskId) {
    window.open(`/api/download_single_result/${taskId}`, '_blank');
}

function resetForm() {
    // 重置表單
    document.getElementById('upload-form').reset();
    
    // 隱藏所有結果區域
    const excelResultsSection = document.getElementById('excel-results-section');
    const singleResultsSection = document.getElementById('single-results-section');
    const statusSection = document.getElementById('status-section');
    
    if (excelResultsSection) excelResultsSection.classList.add('hidden');
    if (singleResultsSection) singleResultsSection.classList.add('hidden');
    if (statusSection) statusSection.classList.add('hidden');
    
    // 清空結果容器
    const excelResultsContainer = document.getElementById('excel-results-container');
    const singleResultsContainer = document.getElementById('single-results-container');
    
    if (excelResultsContainer) excelResultsContainer.innerHTML = '';
    if (singleResultsContainer) singleResultsContainer.innerHTML = '';
    
    // 重置按鈕狀態
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn?.querySelector('.btn-text');
    const spinner = submitBtn?.querySelector('.spinner');
    
    if (submitBtn) {
        submitBtn.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (spinner) spinner.classList.add('hidden');
    }
    
    // 清除驗證狀態
    const validationStatus = document.getElementById('validation-status');
    if (validationStatus) {
        validationStatus.textContent = '';
        validationStatus.className = '';
    }
} 