import os
from dotenv import load_dotenv
from dataclasses import dataclass, field
from typing import Dict

@dataclass
class Config:
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
        load_dotenv()
        return cls(
            API_KEY=os.getenv('API_KEY', ''),
            API_BASE_URL=os.getenv('ANYTHINGLLM_URL', '')
        )

    def get_headers(self) -> dict:
        return {
            'Authorization': f'Bearer {self.API_KEY}',
            'Content-Type': 'application/json'
        } 