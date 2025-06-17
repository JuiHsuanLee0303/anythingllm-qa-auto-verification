"""
配置管理模組
此模組負責管理系統的配置設定，包括 API 金鑰、基礎 URL、模型名稱等。
使用 dataclass 來實現配置類別，支援從環境變數載入配置。
"""

import os
from dotenv import load_dotenv
from dataclasses import dataclass, field
from typing import Dict

@dataclass
class Config:
    """
    系統配置類別
    使用 dataclass 裝飾器來自動生成特殊方法
    
    Attributes:
        API_KEY (str): AnythingLLM API 金鑰
        API_BASE_URL (str): AnythingLLM API 基礎 URL
        MODEL_NAME (str): 用於語義相似度計算的 BERT 模型名稱
        DEFAULT_WORKSPACE (str): 預設工作區名稱
        DEFAULT_EXCEL (str): 預設 Excel 檔案名稱
        OUTPUT_DIR (str): 相似度圖表輸出目錄
        SUPPORTED_MIME_TYPES (Dict[str, str]): 支援的文件類型和對應的 MIME 類型
    """
    
    API_KEY: str
    API_BASE_URL: str
    MODEL_NAME: str = 'paraphrase-multilingual-MiniLM-L12-v2'
    DEFAULT_WORKSPACE: str = 'default_workspace'
    DEFAULT_EXCEL: str = 'techman_robot.xlsx'
    OUTPUT_DIR: str = 'similarity_charts'
    
    # 支援的文件類型和對應的 MIME 類型
    SUPPORTED_MIME_TYPES: Dict[str, str] = field(default_factory=lambda: {
        '*.txt': 'text/plain',
        '*.pdf': 'application/pdf',
        '*.doc': 'application/msword',
        '*.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '*.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '*.md': 'text/markdown'
    })

    @classmethod
    def load_from_env(cls) -> 'Config':
        """
        從環境變數載入配置
        
        Returns:
            Config: 載入配置後的 Config 實例
        """
        load_dotenv()
        return cls(
            API_KEY=os.getenv('API_KEY', ''),
            API_BASE_URL=os.getenv('ANYTHINGLLM_URL', '')
        )

    def get_headers(self) -> dict:
        """
        獲取 API 請求所需的標頭
        
        Returns:
            dict: 包含授權和內容類型的標頭字典
        """
        return {
            'Authorization': f'Bearer {self.API_KEY}',
            'Content-Type': 'application/json'
        } 