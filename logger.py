import logging
import os
from datetime import datetime
from typing import Optional

class Logger:
    def __init__(self, name: str = "qa_verification"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        # 創建控制台處理器
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # 確保 logs 目錄存在
        os.makedirs('logs', exist_ok=True)
        
        # 創建文件處理器
        file_handler = logging.FileHandler(f'logs/{name}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.log')
        file_handler.setLevel(logging.INFO)
        
        # 設置日誌格式
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(formatter)
        file_handler.setFormatter(formatter)
        
        # 添加處理器
        self.logger.addHandler(console_handler)
        self.logger.addHandler(file_handler)
    
    def info(self, message: str):
        self.logger.info(message)
    
    def error(self, message: str, exc_info: Optional[Exception] = None):
        self.logger.error(message, exc_info=exc_info)
    
    def warning(self, message: str):
        self.logger.warning(message)
    
    def debug(self, message: str):
        self.logger.debug(message) 