import pandas as pd
from typing import List, Dict, Tuple
import openpyxl

class ExcelHandler:
    def __init__(self, file_path: str):
        """
        Initialize ExcelHandler with the path to the Excel file.
        
        Args:
            file_path (str): Path to the Excel file
        """
        self.file_path = file_path
        self.excel_file = pd.ExcelFile(file_path)
    
    def get_all_sheets(self) -> List[str]:
        """
        Get all sheet names from the Excel file.
        
        Returns:
            List[str]: List of sheet names
        """
        return self.excel_file.sheet_names
    
    def get_qa_pairs(self, sheet_name: str) -> List[Tuple[str, str]]:
        """
        Extract Q&A pairs from a specific sheet.
        First column is treated as questions, second column as answers.
        Includes the first row of data even if it's not a header.
        
        Args:
            sheet_name (str): Name of the sheet to process
            
        Returns:
            List[Tuple[str, str]]: List of (question, answer) pairs
        """
        df = pd.read_excel(self.file_path, sheet_name=sheet_name, header=None)
        
        # Ensure there are at least 2 columns
        if len(df.columns) < 2:
            raise ValueError(f"Sheet {sheet_name} must have at least 2 columns")
        
        # Get first two columns
        questions = df.iloc[:, 0].astype(str)
        answers = df.iloc[:, 1].astype(str)
        
        # Filter out empty rows
        qa_pairs = [(q.strip(), a.strip()) for q, a in zip(questions, answers) 
                   if q.strip() and a.strip()]
        
        return qa_pairs
    
    def get_all_qa_pairs(self) -> Dict[str, List[Tuple[str, str]]]:
        """
        Get Q&A pairs from all sheets in the Excel file.
        
        Returns:
            Dict[str, List[Tuple[str, str]]]: Dictionary mapping sheet names to Q&A pairs
        """
        result = {}
        for sheet_name in self.get_all_sheets():
            result[sheet_name] = self.get_qa_pairs(sheet_name)
        return result

    def write_llm_response(self, sheet_name: str, row_index: int, llm_response: str) -> None:
        """
        Write LLM response to the third column of the specified row.
        
        Args:
            sheet_name (str): Name of the sheet to write to
            row_index (int): 0-based index of the row to write to
            llm_response (str): The LLM response to write
        """
        try:
            # Load the workbook
            workbook = openpyxl.load_workbook(self.file_path)
            sheet = workbook[sheet_name]
            
            # Write to the third column (column C)
            sheet.cell(row=row_index + 1, column=3, value=llm_response)
            
            # Save the workbook
            workbook.save(self.file_path)
            print(f"✅ 已將 LLM 回答寫入第 {row_index + 1} 行")
        except Exception as e:
            print(f"❌ 寫入 Excel 時發生錯誤: {str(e)}")

    def write_similarity_scores(self, sheet_name: str, row_index: int, similarity_scores: dict) -> None:
        """
        Write similarity scores to the fourth and fifth columns.
        
        Args:
            sheet_name (str): Name of the sheet to write to
            row_index (int): 0-based index of the row to write to
            similarity_scores (dict): Dictionary containing similarity scores
        """
        try:
            # Load the workbook
            workbook = openpyxl.load_workbook(self.file_path)
            sheet = workbook[sheet_name]
            
            # Write BERT Score to column D
            sheet.cell(row=row_index + 1, column=4, value=similarity_scores['bert_score'])
            
            # Write Cosine Similarity to column E
            sheet.cell(row=row_index + 1, column=5, value=similarity_scores['cosine_similarity'])
            
            # Save the workbook
            workbook.save(self.file_path)
            print(f"✅ 已將相似度分數寫入第 {row_index + 1} 行")
        except Exception as e:
            print(f"❌ 寫入相似度分數時發生錯誤: {str(e)}")

def demo():
    """
    Demo function to show how to use ExcelHandler
    """
    # Example usage
    try:
        # Create an instance of ExcelHandler
        handler = ExcelHandler("techman_robot.xlsx")
        
        # Get all sheet names
        sheets = handler.get_all_sheets()
        print("\n" + "="*50)
        print(f"📑 找到的工作表: {', '.join(sheets)}")
        print("="*50)
        
        # Process each sheet
        for sheet_name in sheets:
            print(f"\n📋 工作表: {sheet_name}")
            print("-"*50)
            qa_pairs = handler.get_qa_pairs(sheet_name)
            
            print(f"📊 找到 {len(qa_pairs)} 個問答對:")
            for i, (question, answer) in enumerate(qa_pairs, 1):
                print(f"\nQ{i}. {question}")
                print(f"A{i}.\n{answer}")
                print("-"*30)
                
    except FileNotFoundError:
        print("\n❌ 錯誤: techman_robot.xlsx 檔案不存在")
    except Exception as e:
        print(f"\n❌ 錯誤: {str(e)}")

if __name__ == "__main__":
    demo()
