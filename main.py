"""
QA 驗證系統主程式
此模組實現了一個自動化的問答驗證系統，用於評估 LLM 回答的準確性。
系統會從 Excel 檔案讀取問答對，將問題發送到 AnythingLLM，並計算回答的相似度。
"""

import os
import requests
from dotenv import load_dotenv
import uuid
from excel_handler import ExcelHandler
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
from tqdm import tqdm
import argparse
import glob
import re
from config import Config
from logger import Logger
from similarity_analyzer import SimilarityAnalyzer

# 載入環境變數
load_dotenv()

# 初始化配置
config = Config.load_from_env()

# 初始化 BERT 模型用於語義相似度計算
model = SentenceTransformer(config.MODEL_NAME)

class QAVerificationSystem:
    """
    QA 驗證系統的主要類別
    負責處理問答對的驗證、文件上傳和相似度分析等功能
    """
    
    def __init__(self):
        """
        初始化 QA 驗證系統
        設置配置、日誌記錄器和相似度分析器
        """
        self.config = Config.load_from_env()
        self.logger = Logger("QA資料驗證")
        self.similarity_analyzer = SimilarityAnalyzer(self.config.MODEL_NAME)
    
    def validate_api_key(self):
        """
        驗證 API 金鑰是否有效
        """
        try:
            response = requests.get(
                f'{self.config.API_BASE_URL}/api/v1/auth',
                headers=self.config.get_headers()
            )
            response.raise_for_status()
            self.logger.info("✅ API 金鑰驗證成功")
            return True
        except requests.exceptions.RequestException as e:
            self.logger.error(f"API 金鑰驗證失敗: {str(e)}")
            return False
        except Exception as e:
            self.logger.error(f"API 金鑰驗證時發生錯誤: {str(e)}", exc_info=e)
            return False

    def get_workspace_slug(self, workspace_name: str) -> Optional[str]:
        """
        獲取工作區的 slug
        
        Args:
            workspace_name (str): 工作區名稱
            
        Returns:
            Optional[str]: 工作區的 slug，如果未找到則返回 None
        """
        try:
            self.logger.info(f"🔍 搜尋工作區: {workspace_name}")
            response = requests.get(
                f'{self.config.API_BASE_URL}/api/v1/workspaces',
                headers=self.config.get_headers()
            )
            response.raise_for_status()
            workspaces = response.json()
            
            if isinstance(workspaces, list):
                for workspace in workspaces:
                    if isinstance(workspace, dict) and workspace.get('name') == workspace_name:
                        self.logger.info(f"✅ 找到工作區: {workspace_name}")
                        return workspace.get('slug')
            elif isinstance(workspaces, dict):
                workspace_list = workspaces.get('workspaces', [])
                for workspace in workspace_list:
                    if workspace.get('name') == workspace_name:
                        self.logger.info(f"✅ 找到工作區: {workspace_name}")
                        return workspace.get('slug')
            
            self.logger.info(f"❌ 工作區 '{workspace_name}' 不存在")
            return None
        except Exception as e:
            self.logger.error(f"獲取工作區時發生錯誤: {str(e)}", exc_info=e)
            return None
        
    def create_workspace(self, workspace_name: str, workspace_settings: Optional[Dict] = None) -> Optional[str]:
        """
        創建新的工作區
        
        Args:
            workspace_name (str): 工作區名稱
            workspace_settings (Optional[Dict], optional): 工作區設定，預設為 None
            
        Returns:
            Optional[str]: 成功時返回工作區的 slug，失敗時返回 None
        """
        try:
            self.logger.info(f"🔍 創建工作區: {workspace_name}")
            
            # 準備請求資料
            payload = {
                "name": workspace_name,
                "chatProvider": workspace_settings.get("provider", "ollama"),
                "chatModel": workspace_settings.get("model", "llama3.1:8b-instruct-fp16"),
                "similarityThreshold": workspace_settings.get("similarityThreshold", 0.7),
                "openAiTemp": workspace_settings.get("Temp", 0.7),
                "openAiHistory": workspace_settings.get("historyLength", 20),
                "openAiPrompt": workspace_settings.get("systemPrompt", "Custom prompt for responses"),
                "queryRefusalResponse": workspace_settings.get("queryRefusalResponse", "Custom refusal message"),
                "chatMode": workspace_settings.get("chatMode", "chat"),
                "topN": workspace_settings.get("topN", 4)
            }
            
            # 發送 POST 請求
            response = requests.post(
                f'{self.config.API_BASE_URL}/api/v1/workspace/new',
                headers=self.config.get_headers(),
                json=payload,
                timeout=30  # 添加超時設定
            )
            
            # 檢查回應狀態
            response.raise_for_status()
            
            # 解析回應
            result = response.json().get('workspace')
            if not result or 'slug' not in result:
                self.logger.error("API 回應中未包含工作區 slug")
                return None
                
            self.logger.info(f"✅ 成功創建工作區: {workspace_name}")
            return result.get('slug')
            
        except requests.exceptions.Timeout:
            self.logger.error("❌ 創建工作區失敗，請求超時")
            return None
        except requests.exceptions.RequestException as e:
            self.logger.error(f"❌ 創建工作區失敗，網路錯誤: {str(e)}")
            return None
        except Exception as e:
            self.logger.error(f"❌ 創建工作區失敗，發生錯誤: {str(e)}", exc_info=e)
            return None
    
    def send_chat_message(self, workspace_slug: str, message: str) -> Optional[Dict]:
        """
        發送聊天訊息到指定工作區
        
        Args:
            workspace_slug (str): 工作區的 slug
            message (str): 要發送的訊息內容
            
        Returns:
            Optional[Dict]: API 回應的 JSON 資料，如果發生錯誤則返回 None
        """
        try:
            session_id = str(uuid.uuid4())
            payload = {
                "message": message,
                "mode": "query",
                "sessionId": session_id,
                "reset": False
            }
            
            response = requests.post(
                f'{self.config.API_BASE_URL}/api/v1/workspace/{workspace_slug}/chat',
                headers=self.config.get_headers(),
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            self.logger.error(f"聊天操作時發生錯誤: {str(e)}", exc_info=e)
            return None
    
    def process_qa_pairs(self, workspace_slug: str, excel_handler: ExcelHandler) -> List[Dict[str, float]]:
        """
        處理問答對並計算相似度分數
        
        Args:
            workspace_slug (str): 工作區的 slug
            excel_handler (ExcelHandler): Excel 檔案處理器實例
            
        Returns:
            List[Dict[str, float]]: 所有問答對的相似度分數列表
        """
        all_similarity_scores = []
        all_qa_pairs = excel_handler.get_all_qa_pairs()
        
        total_qa_pairs = sum(len(qa_pairs) for qa_pairs in all_qa_pairs.values())
        processed_qa_pairs = 0
        self.logger.info(f"📋 開始處理問答對")

        for sheet_name, qa_pairs in all_qa_pairs.items():
            self.logger.info(f"📋 處理工作表: {sheet_name}")
            table_qa_pairs = qa_pairs
            with tqdm(total=len(table_qa_pairs), desc="處理問答對", unit="對") as pbar:
                for row_index, (question, excel_answer) in enumerate(table_qa_pairs):                    
                    response = self.send_chat_message(workspace_slug, question)
                    if response and 'textResponse' in response:
                        llm_response = response['textResponse']
                        # 清理<think></think>之間的文字
                        llm_response = re.sub(r'<think>.*?</think>', '', llm_response, flags=re.DOTALL)
                        similarity_scores = self.similarity_analyzer.calculate_similarity(
                            llm_response, excel_answer
                        )
                        all_similarity_scores.append(similarity_scores)
                        
                        excel_handler.write_llm_response(sheet_name, row_index, llm_response)
                        excel_handler.write_similarity_scores(sheet_name, row_index, similarity_scores)
                    else:
                        self.logger.warning(f"❌ 無法獲取 LLM 回答")
                    pbar.update(1)
        
        self.logger.info(f"✅ 問答對處理完成，共處理 {processed_qa_pairs} 個問答對")

        return all_similarity_scores
    
    def upload_documents(self, workspace_slug: str, directory: str) -> bool:
        """
        上傳指定目錄中的所有支援文件到 AnythingLLM
        
        Args:
            workspace_slug (str): 工作區的 slug
            directory (str): 要上傳的文件目錄路徑
            
        Returns:
            bool: 上傳是否成功
        """
        try:
            self.logger.info(f"📤 開始從目錄: {directory}上傳文件")
            
            file_paths = []

            # 檢查目錄是否存在
            if not os.path.exists(directory):
                self.logger.error(f"❌ 目錄 {directory} 不存在")
                return False

            # 獲取目錄中所有支援的文件
            for ext in self.config.SUPPORTED_MIME_TYPES.keys():
                file_paths.extend(glob.glob(os.path.join(directory, ext)))
            
            if not file_paths:
                self.logger.warning(f"⚠️ 在目錄 {directory} 中未找到任何支援的文件")
            
            success_count = 0
            for file_path in file_paths:
                try:
                    with open(file_path, 'rb') as f:
                        file_name = os.path.basename(file_path)
                        file_ext = os.path.splitext(file_name)[1].lower()
                        mime_type = self.config.SUPPORTED_MIME_TYPES.get(f'*{file_ext}', 'application/octet-stream')
                        
                        files = {'file': (file_name, f, mime_type)}
                        data = {
                            'addToWorkspaces': workspace_slug
                        }
                        
                        headers = self.config.get_headers()
                        headers.pop('Content-Type', None)  # 移除 Content-Type，讓 requests 自動設置
                        
                        response = requests.post(
                            f'{self.config.API_BASE_URL}/api/v1/document/upload',
                            headers=headers,
                            files=files,
                            data=data
                        )
                        response.raise_for_status()
                        success_count += 1
                        self.logger.info(f"✅ 成功上傳文件: {file_name}")
                except Exception as e:
                    self.logger.error(f"❌ 上傳文件 {os.path.basename(file_path)} 時發生錯誤: {str(e)}")
            
            self.logger.info(f"📊 文件上傳完成: 成功 {success_count}/{len(file_paths)} 個文件")
            return success_count > 0
            
        except Exception as e:
            self.logger.error(f"❌ 文件上傳過程中發生錯誤: {str(e)}", exc_info=e)
            return False

    def run(self, workspace_name: str, excel_file: str, upload_dir: Optional[str] = None, output_dir: Optional[str] = None, workspace_settings: Optional[Dict] = None):
        """
        運行 QA 驗證系統的主要流程
        
        Args:
            workspace_name (str): 工作區名稱
            excel_file (str): Excel 檔案路徑
            upload_dir (Optional[str]): 要上傳的文件目錄路徑（可選）
        """
        try:
            # 驗證 API 金鑰
            if not self.validate_api_key():
                return

            # 獲取工作區 slug
            workspace_slug = self.get_workspace_slug(workspace_name)
            if not workspace_slug:
                workspace_slug = self.create_workspace(workspace_name, workspace_settings)
                if not workspace_slug:
                    return
                        
            # 如果指定了上傳目錄，先上傳文件
            if upload_dir:
                if not self.upload_documents(workspace_slug, upload_dir):
                    self.logger.warning("⚠️ 文件上傳未完成，但將繼續進行 QA 驗證")
            
            # 初始化 Excel 處理器
            excel_handler = ExcelHandler(excel_file)
            
            # 處理問答對
            similarity_scores = self.process_qa_pairs(workspace_slug, excel_handler)
            
            # 生成相似度分析圖表
            if similarity_scores:
                self.logger.info("\n📊 生成統計圖表...")
                self.similarity_analyzer.generate_charts(
                    similarity_scores,
                    output_dir
                )
        
        except FileNotFoundError:
            self.logger.error(f"❌ 錯誤: {excel_file} 檔案不存在")
        except Exception as e:
            self.logger.error(f"❌ 錯誤: {str(e)}", exc_info=e)

def parse_arguments():
    """
    解析命令列參數
    
    Returns:
        argparse.Namespace: 解析後的參數物件
    """
    parser = argparse.ArgumentParser(description='QA 驗證系統')
    parser.add_argument('-w', '--workspace', 
                      required=True,
                      help='AnythingLLM workspace 名稱')
    parser.add_argument('-e', '--excel', 
                      required=True,
                      help='Excel 檔案名稱')
    parser.add_argument('-d', '--directory',
                      help='要上傳到 AnythingLLM 的文件目錄路徑')
    parser.add_argument('--provider',
                      default='ollama',
                      help='模型提供者，預設為 "ollama"')
    parser.add_argument('-m', '--model',
                      default='llama3.1:8b-instruct-fp16',
                      help='模型名稱，預設為 "llama3.1:8b-instruct-fp16"')
    parser.add_argument('-s', '--similarityThreshold',
                      default=0.7,
                      help='相似度閾值，預設為 0.7')
    parser.add_argument('-t', '--Temp',
                      default=0.7,
                      help='溫度參數，預設為 0.7')
    parser.add_argument('-l', '--historyLength',
                      default=20,
                      help='歷史記錄長度，預設為 20')
    parser.add_argument('-p', '--systemPrompt',
                      default="Custom prompt for responses",
                      help='系統提示詞，預設為 "Custom prompt for responses"')
    parser.add_argument('-r', '--queryRefusalResponse',
                      default="Custom refusal message",
                      help='拒絕回應訊息，預設為 "Custom refusal message"')
    parser.add_argument('-c', '--chatMode',
                      default="query",
                      help='聊天模式，預設為 "query"')
    parser.add_argument('-n', '--topN',
                      default=4,
                      help='返回結果數量，預設為 4')
    parser.add_argument('-o', '--output',
                      default='similarity_charts',
                      help='輸出目錄，預設為 "similarity_charts"')
    return parser.parse_args()

if __name__ == "__main__":
    args = parse_arguments()
    workspace_settings = {
        "provider": args.provider,
        "model": args.model,
        "similarityThreshold": args.similarityThreshold,
        "Temp": args.Temp,
        "historyLength": args.historyLength,
        "systemPrompt": args.systemPrompt,
        "queryRefusalResponse": args.queryRefusalResponse,
        "chatMode": args.chatMode,
        "topN": args.topN,
    }
    system = QAVerificationSystem()
    system.run(args.workspace, args.excel, args.directory, args.output, workspace_settings)
