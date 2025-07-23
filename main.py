"""
QA 驗證系統主程式
此模組實現了一個自動化的問答驗證系統，用於評估 LLM 回答的準確性。
系統會從 Excel 檔案讀取問答對，將問題發送到 AnythingLLM，並計算回答的相似度。
"""

import os
import requests
import uuid
import argparse
import glob
import re
from typing import List, Dict, Optional

from tqdm import tqdm
from sentence_transformers import SentenceTransformer

from excel_handler import ExcelHandler
from config import Config
from logger import get_logger, Logger
from similarity_analyzer import SimilarityAnalyzer

class QAVerificationSystem:
    """
    QA 驗證系統的主要類別
    負責處理問答對的驗證、文件上傳和相似度分析等功能
    """
    
    def __init__(self, config: Config, logger: Logger):
        """
        初始化 QA 驗證系統
        
        Args:
            config (Config): 系統配置物件
            logger (Logger): 日誌記錄器實例
        """
        self.config = config
        self.logger = logger
        self.similarity_analyzer = SimilarityAnalyzer(self.config.analyzer.model)
    
    def validate_api_key(self):
        """
        驗證 API 金鑰是否有效
        """
        try:
            response = requests.get(
                f'{self.config.api.base_url}/api/v1/auth',
                headers=self.config.get_headers()
            )
            response.raise_for_status()
            self.logger.info("[SUCCESS] API 金鑰驗證成功")
            return True
        except requests.exceptions.RequestException as e:
            self.logger.error(f"[ERROR] API 金鑰驗證失敗: {e}")
            return False
        except Exception as e:
            self.logger.error(f"[ERROR] API 金鑰驗證時發生錯誤: {e}", exc_info=True)
            return False

    def get_workspace_slug(self, workspace_identifier: str) -> Optional[str]:
        """
        獲取工作區的 slug
        
        Args:
            workspace_identifier (str): 工作區名稱或 slug
            
        Returns:
            Optional[str]: 工作區的 slug，如果未找到則返回 None
        """
        try:
            self.logger.info(f"[INFO] 搜尋工作區: {workspace_identifier}")
            response = requests.get(
                f'{self.config.api.base_url}/api/v1/workspaces',
                headers=self.config.get_headers()
            )
            response.raise_for_status()
            workspaces = response.json()
            
            workspace_list = workspaces.get('workspaces', []) if isinstance(workspaces, dict) else workspaces
            for workspace in workspace_list:
                if isinstance(workspace, dict):
                    # 同時檢查 name 和 slug
                    if (workspace.get('name') == workspace_identifier or 
                        workspace.get('slug') == workspace_identifier):
                        found_slug = workspace.get('slug')
                        found_name = workspace.get('name')
                        self.logger.info(f"[SUCCESS] 找到工作區: {found_name} (slug: {found_slug})")
                        return found_slug
            
            self.logger.warning(f"[WARNING] 工作區 '{workspace_identifier}' 不存在")
            return None
        except Exception as e:
            self.logger.error(f"[ERROR] 獲取工作區時發生錯誤: {e}", exc_info=True)
            return None
        
    def create_workspace(self, workspace_name: str) -> Optional[str]:
        """
        創建新的工作區
        
        Args:
            workspace_name (str): 工作區名稱
            
        Returns:
            Optional[str]: 成功時返回工作區的 slug，失敗時返回 None
        """
        try:
            self.logger.info(f"[INFO] 創建工作區: {workspace_name}")
            ws_config = self.config.workspace
            
            payload = {
                "name": workspace_name,
                "chatProvider": ws_config.provider,
                "chatModel": ws_config.model,
                "similarityThreshold": self.config.analyzer.similarity_threshold,
                "openAiTemp": ws_config.temp,
                "openAiHistory": ws_config.history_length,
                "openAiPrompt": ws_config.system_prompt,
                "queryRefusalResponse": ws_config.query_refusal_response,
                "chatMode": ws_config.chat_mode,
                "topN": ws_config.top_n
            }
            
            response = requests.post(
                f'{self.config.api.base_url}/api/v1/workspace/new',
                headers=self.config.get_headers(),
                json=payload,
                timeout=30
            )
            
            response.raise_for_status()
            
            result = response.json().get('workspace')
            if not result or 'slug' not in result:
                self.logger.error("[ERROR] API 回應中未包含工作區 slug")
                return None
                
            self.logger.info(f"[SUCCESS] 成功創建工作區: {workspace_name}")
            return result.get('slug')
            
        except requests.exceptions.Timeout:
            self.logger.error("[ERROR] 創建工作區失敗，請求超時")
            return None
        except requests.exceptions.RequestException as e:
            self.logger.error(f"[ERROR] 創建工作區失敗，網路錯誤: {e}")
            return None
        except Exception as e:
            self.logger.error(f"[ERROR] 創建工作區失敗，發生錯誤: {e}", exc_info=True)
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
                "mode": self.config.workspace.chat_mode,
                "sessionId": session_id,
                "reset": False
            }
            
            response = requests.post(
                f'{self.config.api.base_url}/api/v1/workspace/{workspace_slug}/chat',
                headers=self.config.get_headers(),
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except Exception as e:
            self.logger.error(f"[ERROR] 聊天操作時發生錯誤: {e}", exc_info=True)
            return None
    
    def process_qa_pairs(self, workspace_slug: str, excel_handler: ExcelHandler, web_mode: bool = False) -> List[Dict[str, float]]:
        """
        處理問答對並計算相似度分數
        
        Args:
            workspace_slug (str): 工作區的 slug
            excel_handler (ExcelHandler): Excel 檔案處理器實例
            web_mode (bool): 是否為 Web 模式，用於控制進度條的顯示
            
        Returns:
            List[Dict[str, float]]: 所有問答對的相似度分數列表
        """
        all_similarity_scores = []
        all_qa_pairs = excel_handler.get_all_qa_pairs()
        
        total_qa_pairs = sum(len(qa_pairs) for qa_pairs in all_qa_pairs.values())
        self.logger.info(f"[INFO] 開始處理 {total_qa_pairs} 個問答對")

        # 計算進度用的變數
        processed_count = 0
        total_sheets = len(all_qa_pairs)
        current_sheet_index = 0

        for sheet_name, qa_pairs in all_qa_pairs.items():
            current_sheet_index += 1
            self.logger.info(f"[INFO] 處理工作表: {sheet_name} ({current_sheet_index}/{total_sheets})")
            
            # 在 Web 模式下禁用 tqdm 的視覺輸出，避免污染日誌
            with tqdm(total=len(qa_pairs), desc=f"處理中: {sheet_name}", unit="對", disable=web_mode) as pbar:
                for row_index, (question, excel_answer, original_row_index) in enumerate(qa_pairs):
                    if web_mode:
                        # 計算詳細進度
                        processed_count += 1
                        overall_progress = (processed_count / total_qa_pairs) * 100
                        sheet_progress = ((row_index + 1) / len(qa_pairs)) * 100
                        
                        # 發送詳細的進度資訊 (30-85% 範圍)
                        progress_data = {
                            "progress": 30 + (overall_progress * 0.55),  # 30-85% 範圍
                            "status": f"處理中: {sheet_name} - 第 {row_index + 1}/{len(qa_pairs)} 筆 ({sheet_progress:.1f}%)",
                            "detail": {
                                "current_sheet": sheet_name,
                                "current_sheet_index": current_sheet_index,
                                "total_sheets": total_sheets,
                                "current_item": row_index + 1,
                                "total_items_in_sheet": len(qa_pairs),
                                "processed_items": processed_count,
                                "total_items": total_qa_pairs,
                                "sheet_progress": sheet_progress,
                                "overall_progress": overall_progress
                            }
                        }
                        self.logger.info(f"[PROGRESS] 正在處理: {sheet_name} - 第 {row_index + 1}/{len(qa_pairs)} 筆", **progress_data)
                    
                    response = self.send_chat_message(workspace_slug, question)
                    if response and 'textResponse' in response:
                        llm_response = response['textResponse']
                        # 清理<think></think>之間的文字
                        llm_response = re.sub(r'<think>.*?</think>', '', llm_response, flags=re.DOTALL).strip()
                        similarity_scores = self.similarity_analyzer.calculate_similarity(
                            llm_response, excel_answer
                        )
                        all_similarity_scores.append(similarity_scores)
                        
                        excel_handler.write_llm_response(sheet_name, original_row_index, llm_response)
                        excel_handler.write_similarity_scores(sheet_name, original_row_index, similarity_scores)
                        pbar.update(1)
                    else:
                        self.logger.warning(f"[WARNING] 問題 '{question[:20]}...' 無法獲取 LLM 回答")
                        pbar.update(1)
        
        self.logger.info(f"[SUCCESS] 問答對處理完成")

        return all_similarity_scores
    
    def upload_documents(self, workspace_slug: str, directory: str) -> bool:
        """
        上傳指定目錄中的所有支援文件到 AnythingLLM
        """
        try:
            self.logger.info(f"[INFO] 開始從目錄: '{directory}' 上傳文件")
            
            if not os.path.isdir(directory):
                self.logger.error(f"[ERROR] 目錄 '{directory}' 不存在。")
                return False

            file_paths = []
            for pattern in self.config.supported_mime_types.keys():
                file_paths.extend(glob.glob(os.path.join(directory, pattern), recursive=True))

            if not file_paths:
                self.logger.warning("[WARNING] 在指定目錄中找不到任何支援的檔案。")
                return True

            self.logger.info(f"[INFO] 找到 {len(file_paths)} 個要上傳的檔案。")

            with tqdm(total=len(file_paths), desc="上傳檔案", unit="個") as pbar:
                for i, file_path in enumerate(file_paths):
                    try:
                        with open(file_path, 'rb') as f:
                            files = {'file': (os.path.basename(file_path), f)}
                            response = requests.post(
                                f'{self.config.api.base_url}/api/v1/workspace/{workspace_slug}/upload',
                                headers={'Authorization': self.config.get_headers()['Authorization']},
                                files=files
                            )
                            response.raise_for_status()
                            self.logger.info(f"[SUCCESS] 成功上傳檔案: {os.path.basename(file_path)}")
                    except Exception as e:
                        self.logger.error(f"[ERROR] 上傳檔案失敗: {os.path.basename(file_path)} - {e}")
                    finally:
                        pbar.update(1)
                        
                        # 在 Web 模式下顯示上傳進度 (20-30% 範圍)
                        if hasattr(self.logger, 'logger') and hasattr(self.logger.logger, 'handlers'):
                            upload_progress = ((i + 1) / len(file_paths)) * 100
                            overall_progress = 20 + (upload_progress * 0.1)  # 20-30% 範圍
                            self.logger.info(f"[PROGRESS] 上傳進度: {i + 1}/{len(file_paths)} ({upload_progress:.1f}%)", 
                                           progress=overall_progress, 
                                           status=f"上傳檔案: {os.path.basename(file_path)} ({upload_progress:.1f}%)")
            
            return True
        except Exception as e:
            self.logger.error(f"[ERROR] 上傳文件時發生嚴重錯誤: {e}", exc_info=True)
            return False

def run_verification(config: Config, logger: Logger, args: argparse.Namespace, web_mode: bool = False):
    """
    執行完整的 QA 驗證流程
    
    Args:
        config (Config): 系統配置物件
        logger (Logger): 日誌記錄器實例
        args (argparse.Namespace): 命令列參數
        web_mode (bool): 是否為 Web 模式，影響日誌和進度條顯示
    """
    # 進度分配：
    # 0-10%: 初始化
    # 10-20%: API驗證和工作區準備
    # 20-30%: 文件上傳（如果有）
    # 30-85%: 問答對處理（主要階段）
    # 85-95%: 生成分析圖表
    # 95-100%: 儲存結果
    
    logger.info("[START] QA 驗證系統啟動", progress=0, status="系統初始化中...")
    logger.info(f"[INFO] 工作區: {args.workspace}", progress=5, status="載入配置...")

    system = QAVerificationSystem(config, logger)
    
    # 1. 驗證 API 金鑰
    logger.info("[INFO] 驗證 API 金鑰...", progress=10, status="驗證 API 金鑰...")
    if not system.validate_api_key():
        logger.error("[ERROR] API 金鑰無效，終止程序。")
        return

    # 2. 獲取或創建工作區
    logger.info("[INFO] 搜尋工作區...", progress=12, status="搜尋工作區...")
    workspace_slug = system.get_workspace_slug(args.workspace)
    if not workspace_slug:
        logger.info("[INFO] 創建新工作區...", progress=14, status="創建新工作區...")
        workspace_slug = system.create_workspace(args.workspace)
    
    if not workspace_slug:
        logger.error("[ERROR] 無法獲取或創建工作區，終止程序。")
        return
        
    logger.info(f"[SUCCESS] 工作區 '{args.workspace}' (slug: {workspace_slug}) 已就緒", progress=20, status="工作區準備完成")
    
    # 3. 處理文件上傳 (如果提供了目錄)
    if args.directory and os.path.isdir(args.directory):
        logger.info("[INFO] 開始上傳參考文件...", progress=20, status="上傳參考文件...")
        if not system.upload_documents(workspace_slug, args.directory):
            logger.warning("[WARNING] 文件上傳過程中出現問題，但仍會繼續處理問答對。")
        logger.info("[SUCCESS] 文件上傳完成", progress=30, status="文件上傳完成")
    else:
        logger.info("[INFO] 未提供參考文件目錄或目錄無效，跳過文件上傳步驟。", progress=30, status="跳過文件上傳")

    # 4. 處理 Excel 中的問答對
    logger.info("[INFO] 開始處理問答對...", progress=30, status="開始處理問答對...")
    excel_handler = ExcelHandler(args.excel, logger)
    all_similarity_scores = system.process_qa_pairs(workspace_slug, excel_handler, web_mode=web_mode)
    
    logger.info(f"[SUCCESS] 成功處理 {excel_handler.get_total_qa_pairs()} 個問答對", progress=85, status="問答對處理完成")
    
    # 5. 生成總結圖表
    logger.info("[INFO] 生成分析圖表...", progress=85, status="生成分析圖表...")
    output_dir = args.output
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    try:
        if all_similarity_scores:
            system.similarity_analyzer.generate_charts(
                all_similarity_scores, 
                output_dir
            )
            logger.info(f"[SUCCESS] 分析報告已生成於 '{output_dir}' 目錄。", progress=95, status="分析圖表生成完成")
        else:
            logger.warning("[WARNING] 沒有任何問答對被處理，無法生成報告。", progress=95, status="跳過圖表生成")
            
    except Exception as e:
        logger.error(f"[ERROR] 生成圖表時發生錯誤: {e}", exc_info=True)
    
    # 6. 儲存包含結果的 Excel 檔案
    logger.info("[INFO] 儲存結果檔案...", progress=95, status="儲存結果檔案...")
    output_excel_path = os.path.join(output_dir, os.path.basename(args.excel))
    try:
        excel_handler.save_workbook(output_excel_path)
        logger.info(f"[SUCCESS] 更新後的 Excel 檔案已儲存至: {output_excel_path}", progress=100, status="完成")
    except Exception as e:
        logger.error(f"[ERROR] 儲存 Excel 檔案時發生錯誤: {e}", exc_info=True)

    logger.info("[COMPLETE] QA 驗證流程全部完成！")

def run_single_verification(config: Config, logger: Logger, args: argparse.Namespace, question: str, standard_answer: str, web_mode: bool = False):
    """
    執行單筆文字驗證流程
    
    Args:
        config (Config): 系統配置物件
        logger (Logger): 日誌記錄器實例
        args (argparse.Namespace): 命令列參數
        question (str): 問題內容
        standard_answer (str): 標準答案
        web_mode (bool): 是否為 Web 模式，影響日誌和進度條顯示
    """
    logger.info("🚀 單筆文字驗證系統啟動")
    logger.info(f"工作區: {args.workspace}", progress=5, status="初始化...")

    system = QAVerificationSystem(config, logger)
    
    # 1. 驗證 API 金鑰
    if not system.validate_api_key():
        logger.error("❌ API 金鑰無效，終止程序。")
        return

    # 2. 獲取或創建工作區
    workspace_slug = system.get_workspace_slug(args.workspace)
    if not workspace_slug:
        workspace_slug = system.create_workspace(args.workspace)
    
    if not workspace_slug:
        logger.error("❌ 無法獲取或創建工作區，終止程序。")
        return
        
    logger.info(f"✅ 工作區 '{args.workspace}' (slug: {workspace_slug}) 已就緒", progress=30, status="正在發送問題到 LLM...")

    # 3. 發送問題到 AnythingLLM 獲取回答
    try:
        logger.info("正在發送問題到 LLM...", progress=50, status="獲取 LLM 回答...")
        
        response = system.send_chat_message(workspace_slug, question)
        if response and 'textResponse' in response:
            llm_response = response['textResponse']
            # 清理<think></think>之間的文字
            cleaned_llm_response = re.sub(r'<think>.*?</think>', '', llm_response, flags=re.DOTALL).strip()
            
            logger.info("正在計算相似度分數...", progress=70, status="計算相似度...")
            
            similarity_scores = system.similarity_analyzer.calculate_similarity(
                cleaned_llm_response, standard_answer
            )
            
            logger.info(f"✅ 相似度分析完成", progress=80, status="生成報告...")
            
            # 4. 生成總結圖表
            output_dir = args.output
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
                
            try:
                system.similarity_analyzer.generate_charts(
                    [similarity_scores], 
                    output_dir
                )
                logger.info(f"📊 分析報告已生成於 '{output_dir}' 目錄。")
                
            except Exception as e:
                logger.error(f"❌ 生成圖表時發生錯誤: {e}", exc_info=True)
            
            # 5. 儲存包含結果的 Excel 檔案
            output_excel_path = os.path.join(output_dir, os.path.basename(args.excel))
            try:
                excel_handler = ExcelHandler(args.excel, logger)
                # 將結果寫入 Excel
                excel_handler.write_llm_response("單筆驗證", 0, cleaned_llm_response)
                excel_handler.write_similarity_scores("單筆驗證", 0, similarity_scores)
                excel_handler.save_workbook(output_excel_path)
                logger.info(f"💾 更新後的 Excel 檔案已儲存至: {output_excel_path}", progress=100, status="完成")
            except Exception as e:
                logger.error(f"❌ 儲存 Excel 檔案時發生錯誤: {e}", exc_info=True)

            logger.info("🎉 單筆文字驗證流程全部完成！")
            
        else:
            logger.error("❌ 無法從 LLM 獲取回答")
            
    except Exception as e:
        logger.error(f"❌ 相似度分析時發生錯誤: {e}", exc_info=True)

def parse_arguments(config: Config):
    """
    解析命令列參數，並允許覆寫組態檔中的設定。
    """
    parser = argparse.ArgumentParser(description="QA 驗證系統")
    
    # 必要參數
    parser.add_argument("-w", "--workspace", type=str, required=True, help="AnythingLLM 工作區名稱")
    parser.add_argument("-e", "--excel", type=str, default=config.file.default_excel,
                        help=f"包含問答對的 Excel 檔案路徑 (預設: {config.file.default_excel})")
    
    # 可選參數 (用於覆寫 config.yaml)
    parser.add_argument("-d", "--directory", type=str, default=config.file.default_upload_dir,
                        help=f"要上傳到 AnythingLLM 的文件目錄路徑 (預設: {config.file.default_upload_dir})")
    parser.add_argument("-o", "--output", type=str, default=config.file.output_dir,
                        help=f"輸出報告和圖表的目錄 (預設: {config.file.output_dir})")
    parser.add_argument("-m", "--model", type=str, help=f"覆寫 LLM 模型名稱 (預設: {config.workspace.model})")
    parser.add_argument("-s", "--similarityThreshold", type=float, 
                        help=f"覆寫相似度閾值 (預設: {config.analyzer.similarity_threshold})")
    
    args = parser.parse_args()

    # 如果命令列提供了值，就更新 config 物件
    if args.model:
        config.workspace.model = args.model
    if args.similarityThreshold:
        config.analyzer.similarity_threshold = args.similarityThreshold
        
    return args

def main():
    """
    主函式，用於命令列執行。
    """
    try:
        # 1. 載入組態
        config = Config.load()
        
        # 2. 初始化日誌
        logger = get_logger("QAVerificationSystemCLI")
        
        # 3. 解析參數 (並可選地覆寫組態)
        args = parse_arguments(config)
        
        # 4. 執行主系統
        run_verification(config, logger, args, web_mode=False)
        
    except Exception as e:
        # 使用 print 因為 logger 可能尚未初始化成功
        print(f"程式啟動時發生嚴重錯誤: {e}")

if __name__ == "__main__":
    main()
