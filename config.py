import os
from dotenv import load_dotenv
from dataclasses import dataclass

@dataclass
class Config:
    API_KEY: str
    API_BASE_URL: str
    MODEL_NAME: str = 'paraphrase-multilingual-MiniLM-L12-v2'
    DEFAULT_WORKSPACE: str = '0529_warren_test'
    DEFAULT_EXCEL: str = 'techman_robot.xlsx'
    OUTPUT_DIR: str = 'similarity_charts'

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