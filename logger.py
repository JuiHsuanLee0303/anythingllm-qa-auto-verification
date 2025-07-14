import logging
import os
import queue
import json
from datetime import datetime
from typing import Optional
from logging import Handler
from logging.handlers import TimedRotatingFileHandler

_loggers = {}

class QueueHandler(Handler):
    """
    一個自訂的日誌處理器，可將日誌紀錄放入佇列中。
    """
    def __init__(self, log_queue: queue.Queue):
        super().__init__()
        self.log_queue = log_queue

    def emit(self, record):
        self.log_queue.put(self.format(record))

class JsonFormatter(logging.Formatter):
    """
    將日誌記錄格式化為 JSON 字串。
    """
    def format(self, record):
        log_object = {
            'timestamp': datetime.fromtimestamp(record.created).isoformat(),
            'level': record.levelname,
            'log': record.getMessage(),
        }
        # 添加額外的、自訂的欄位
        if hasattr(record, 'progress'):
            log_object['progress'] = record.progress
        if hasattr(record, 'status'):
            log_object['status'] = record.status
            
        return json.dumps(log_object, ensure_ascii=False)


class Logger:
    def __init__(self, name: str = "qa_verification", log_level: str = "INFO", log_dir: str = "logs", session_log_file: Optional[str] = None, log_queue: Optional[queue.Queue] = None):
        """
        初始化 Logger。
        """
        self.logger = logging.getLogger(name)
        self.logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))
        
        # 防止重複添加 handler
        if self.logger.hasHandlers():
            self.logger.handlers.clear()
        
        plain_formatter = logging.Formatter('%(asctime)s - [%(levelname)s] - %(message)s')

        # Console Handler (總是添加)
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(plain_formatter)
        self.logger.addHandler(console_handler)
        
        # General Rotating File Handler
        os.makedirs(log_dir, exist_ok=True)
        general_log_path = os.path.join(log_dir, 'general_app.log')
        file_handler = TimedRotatingFileHandler(
            general_log_path, when='midnight', interval=1, backupCount=7, encoding='utf-8'
        )
        file_handler.setFormatter(plain_formatter)
        self.logger.addHandler(file_handler)

        # Session-specific File Handler (如果提供路徑)
        if session_log_file:
            session_dir = os.path.dirname(session_log_file)
            os.makedirs(session_dir, exist_ok=True)
            session_file_handler = logging.FileHandler(session_log_file, encoding='utf-8')
            session_file_handler.setFormatter(plain_formatter)
            self.logger.addHandler(session_file_handler)
        
        # Queue Handler - 使用 JSON 格式
        if log_queue:
            json_formatter = JsonFormatter()
            queue_handler = QueueHandler(log_queue)
            queue_handler.setFormatter(json_formatter)
            self.logger.addHandler(queue_handler)

    def _log(self, level, message, exc_info=False, **kwargs):
        """
        內部日誌方法，用於處理額外的 kwargs。
        """
        extra = {'extra': kwargs}
        self.logger.log(level, message, exc_info=exc_info, **extra)

    def info(self, message: str, **kwargs):
        self._log(logging.INFO, message, **kwargs)
    
    def error(self, message: str, exc_info: bool = False, **kwargs):
        self._log(logging.ERROR, message, exc_info=exc_info, **kwargs)
    
    def warning(self, message: str, **kwargs):
        self._log(logging.WARNING, message, **kwargs)
    
    def debug(self, message: str, **kwargs):
        self._log(logging.DEBUG, message, **kwargs)

def get_logger(name: str = "qa_verification", log_level: str = "INFO", log_dir: str = "logs", session_log_file: Optional[str] = None, log_queue: Optional[queue.Queue] = None, force_new: bool = False) -> Logger:
    """
    獲取 Logger 的實例。
    如果提供了 session_log_file 或 log_queue，會為每個 session 建立獨立的 logger。
    """
    global _loggers
    
    # 為 session 或需要強制更新的情況建立獨立 logger
    if force_new or (session_log_file and name not in _loggers) or (log_queue and name not in _loggers):
        _loggers[name] = Logger(name, log_level, log_dir, session_log_file, log_queue)
    
    # 取得預設 logger
    if 'default' not in _loggers:
        _loggers['default'] = Logger(name="default_logger")

    return _loggers.get(name, _loggers['default']) 