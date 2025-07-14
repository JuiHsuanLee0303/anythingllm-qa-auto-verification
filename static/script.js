document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upload-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');

    const statusSection = document.getElementById('status-section');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');
    const logs = document.getElementById('logs');
    
    const resultsSection = document.getElementById('results-section');
    const resultsContainer = document.getElementById('results-container');

    // Modal elements
    const modal = document.getElementById('preview-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-btn');

    // Advanced settings
    const toggleAdvancedBtn = document.getElementById('toggle-advanced');
    const advancedOptions = document.getElementById('advanced-options');

    // Validation elements
    const validateBtn = document.getElementById('validate-connection-btn');
    const saveBtn = document.getElementById('save-settings-btn');
    const validationStatus = document.getElementById('validation-status');

    let eventSource;

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

    // --- Event Listeners ---

    // Load settings from localStorage when the page loads
    loadSettings();

    toggleAdvancedBtn.addEventListener('click', () => {
        const fieldset = toggleAdvancedBtn.parentElement;
        fieldset.classList.toggle('open');
    });

    saveBtn.addEventListener('click', saveSettings);

    validateBtn.addEventListener('click', async () => {
        const apiUrl = document.getElementById('api_url').value;
        const apiKey = document.getElementById('api_key').value;

        if (!apiUrl || !apiKey) {
            validationStatus.textContent = '請先填寫 API URL 和金鑰。';
            validationStatus.className = 'error';
            return;
        }

        validationStatus.textContent = '正在驗證...';
        validationStatus.className = '';

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
            } else {
                validationStatus.textContent = '❌ ' + result.message;
                validationStatus.className = 'error';
            }
        } catch (error) {
            validationStatus.textContent = '❌ 驗證請求失敗，請檢查主控台。';
            validationStatus.className = 'error';
            console.error('Validation fetch error:', error);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Reset UI from previous runs
        resetUI();

        // Show loading state on button
        setButtonLoading(true);

        const formData = new FormData(form);

        // Append advanced settings if they have values
        const apiUrl = document.getElementById('api_url').value;
        const apiKey = document.getElementById('api_key').value;
        const model = document.getElementById('model').value;
        const similarityThreshold = document.getElementById('similarity_threshold').value;

        if (apiUrl) formData.append('api_url', apiUrl);
        if (apiKey) formData.append('api_key', apiKey);
        if (model) formData.append('model', model);
        if (similarityThreshold) formData.append('similarity_threshold', similarityThreshold);

        try {
            const response = await fetch('/api/verify', {
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
        resultsSection.classList.add('hidden');
        resultsContainer.innerHTML = '';
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
            displayResults(files, taskId);
        } catch (error) {
            console.error('Fetch results error:', error);
            showError(`獲取結果時發生錯誤: ${error.message}`);
        }
    }

    function displayResults(files, taskId) {
        resultsContainer.innerHTML = ''; // Clear previous results
        if (files.length === 0) {
            resultsContainer.innerHTML = '<p>沒有生成任何結果檔案。</p>';
        } else {
            files.forEach(fileName => {
                const card = document.createElement('div');
                card.className = 'result-card';
                
                card.innerHTML = `
                    <div class="file-name">${fileName}</div>
                    <div class="actions">
                        <a href="/outputs/${taskId}/${fileName}" download class="btn btn-download">下載</a>
                        <button class="btn btn-preview" data-task-id="${taskId}" data-filename="${fileName}">預覽</button>
                    </div>
                `;
                resultsContainer.appendChild(card);
            });
        }
        resultsSection.classList.remove('hidden');
    }

    function showError(message) {
        progressText.textContent = `錯誤: ${message}`;
        progressText.style.color = 'var(--error-color)';
        statusSection.classList.remove('hidden');
        progressBarFill.style.width = '100%';
        progressBarFill.style.backgroundColor = 'var(--error-color)';
    }

    // --- Modal Logic ---

    // Open modal
    resultsContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-preview')) {
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