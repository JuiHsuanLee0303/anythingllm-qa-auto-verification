"""
配置管理模組
此模組負責管理系統的配置設定。
它會從 `config.yaml` 載入基礎配置，並允許透過環境變數進行覆寫。
"""

import os
import yaml
from dotenv import load_dotenv
from dataclasses import dataclass, field
from typing import Dict, Optional

# --- Nested Dataclasses for Config Structure ---

@dataclass
class ApiConfig:
    api_key: Optional[str] = None
    base_url: str = "http://localhost:3001"

@dataclass
class WorkspaceConfig:
    provider: str = "ollama"
    model: str = "llama3.1:8b-instruct-fp16"
    temp: float = 0.7
    history_length: int = 20
    system_prompt: str = "You are a helpful assistant."
    query_refusal_response: str = "Sorry, I cannot answer that."
    chat_mode: str = "query"
    top_n: int = 4

@dataclass
class AnalyzerConfig:
    model: str = "paraphrase-multilingual-MiniLM-L12-v2"
    similarity_threshold: float = 0.7

@dataclass
class FileConfig:
    default_excel: str = "qa_data.xlsx"
    default_upload_dir: str = "documents"
    output_dir: str = "output"

# --- Main Config Class ---

@dataclass
class Config:
    """
    系統主配置類別，整合所有設定。
    """
    api: ApiConfig = field(default_factory=ApiConfig)
    workspace: WorkspaceConfig = field(default_factory=WorkspaceConfig)
    analyzer: AnalyzerConfig = field(default_factory=AnalyzerConfig)
    file: FileConfig = field(default_factory=FileConfig)
    supported_mime_types: Dict[str, str] = field(default_factory=dict)

    @classmethod
    def load(cls, config_path: str = 'config.yaml') -> 'Config':
        """
        載入配置，遵循 YAML -> 環境變數的覆寫順序。
        
        Args:
            config_path (str): YAML 設定檔的路徑。
            
        Returns:
            Config: 載入並整合後的 Config 實例。
        """
        # 1. 從 YAML 檔案載入基礎配置
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                yaml_config = yaml.safe_load(f)
        except FileNotFoundError:
            yaml_config = {}
            print(f"警告: 找不到設定檔 '{config_path}'，將使用預設值。")
        except Exception as e:
            yaml_config = {}
            print(f"警告: 讀取設定檔 '{config_path}' 時發生錯誤: {e}，將使用預設值。")

        # 2. 載入環境變數
        load_dotenv()

        # 3. 整合配置並允許環境變數覆寫
        config_data = {
            'api': {**yaml_config.get('api', {}), **cls._load_api_from_env()},
            'workspace': {**yaml_config.get('workspace', {})},
            'analyzer': {**yaml_config.get('analyzer', {})},
            'file': {**yaml_config.get('file', {})},
            'supported_mime_types': {**yaml_config.get('supported_mime_types', {})}
        }
        
        return cls(
            api=ApiConfig(**config_data['api']),
            workspace=WorkspaceConfig(**config_data['workspace']),
            analyzer=AnalyzerConfig(**config_data['analyzer']),
            file=FileConfig(**config_data['file']),
            supported_mime_types=config_data['supported_mime_types']
        )

    @staticmethod
    def _load_api_from_env() -> Dict[str, str]:
        """從環境變數載入 API 設定。"""
        env_vars = {}
        if 'API_KEY' in os.environ:
            env_vars['api_key'] = os.getenv('API_KEY')
        if 'ANYTHINGLLM_URL' in os.environ:
            env_vars['base_url'] = os.getenv('ANYTHINGLLM_URL')
        return env_vars

    def get_headers(self) -> dict:
        """
        獲取 API 請求所需的標頭。
        
        Returns:
            dict: 包含授權和內容類型的標頭字典。
        """
        if not self.api.api_key:
            raise ValueError("API 金鑰未設定。請在 .env 或 config.yaml 中提供 API_KEY。")
        return {
            'Authorization': f'Bearer {self.api.api_key}',
            'Content-Type': 'application/json'
        } 