import os
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from typing import List, Dict
from sentence_transformers import SentenceTransformer, util
from bert_score import score
from logger import Logger

class SimilarityAnalyzer:
    def __init__(self, model_name: str):
        self.model = SentenceTransformer(model_name)
        self.logger = Logger("similarity_analyzer")
        # 確保 similarity_charts 目錄存在
        os.makedirs('similarity_charts', exist_ok=True)
    
    def calculate_similarity(self, text1: str, text2: str) -> Dict[str, float]:
        """計算兩個文本之間的語意相似度"""
        try:
            # BERTScore
            P, R, F1 = score([text1], [text2], lang='zh', rescale_with_baseline=True)
            bert_score = F1.mean().item()
            
            # Sentence Transformers
            embeddings1 = self.model.encode(text1, convert_to_tensor=True)
            embeddings2 = self.model.encode(text2, convert_to_tensor=True)
            cosine_score = util.pytorch_cos_sim(embeddings1, embeddings2).item()
            
            return {
                'bert_score': bert_score,
                'cosine_similarity': cosine_score
            }
        except Exception as e:
            self.logger.error(f"計算相似度時發生錯誤: {str(e)}", exc_info=e)
            return {'bert_score': 0.0, 'cosine_similarity': 0.0}
    
    def generate_charts(self, similarity_data: List[Dict[str, float]], output_dir: str) -> None:
        """生成相似度分析圖表"""
        try:
            os.makedirs(output_dir, exist_ok=True)
            
            # 提取分數
            bert_scores = [data['bert_score'] for data in similarity_data]
            cosine_scores = [data['cosine_similarity'] for data in similarity_data]
            
            # 生成分佈圖
            self._generate_distribution_plot(bert_scores, cosine_scores, output_dir)
            
            # 生成箱型圖
            self._generate_boxplot(bert_scores, cosine_scores, output_dir)
            
            # 生成散點圖
            self._generate_scatter_plot(bert_scores, cosine_scores, output_dir)
            
            # 生成統計摘要
            self._generate_summary_stats(bert_scores, cosine_scores, output_dir)
            
            self.logger.info(f"圖表已生成並保存到 {output_dir} 目錄")
        except Exception as e:
            self.logger.error(f"生成圖表時發生錯誤: {str(e)}", exc_info=e)
    
    def _generate_distribution_plot(self, bert_scores: List[float], cosine_scores: List[float], output_dir: str):
        plt.figure(figsize=(12, 6))
        plt.subplot(1, 2, 1)
        sns.histplot(bert_scores, kde=True, color='blue', label='BERT Score')
        plt.title('BERT Score Distribution')
        plt.xlabel('Score')
        plt.ylabel('Frequency')
        plt.axvline(x=0.7, color='r', linestyle='--', label='Good Threshold')
        plt.axvline(x=0.5, color='y', linestyle='--', label='Poor Threshold')
        plt.legend()
        
        plt.subplot(1, 2, 2)
        sns.histplot(cosine_scores, kde=True, color='green', label='Cosine Similarity')
        plt.title('Cosine Similarity Distribution')
        plt.xlabel('Score')
        plt.ylabel('Frequency')
        plt.axvline(x=0.7, color='r', linestyle='--', label='Good Threshold')
        plt.axvline(x=0.5, color='y', linestyle='--', label='Poor Threshold')
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'similarity_distributions.png'))
        plt.close()
    
    def _generate_boxplot(self, bert_scores: List[float], cosine_scores: List[float], output_dir: str):
        plt.figure(figsize=(10, 6))
        data = pd.DataFrame({
            'BERT Score': bert_scores,
            'Cosine Similarity': cosine_scores
        })
        sns.boxplot(data=data)
        plt.title('Similarity Scores Distribution')
        plt.ylabel('Score')
        plt.xticks(rotation=45)
        plt.axhline(y=0.7, color='r', linestyle='--', label='Good Threshold')
        plt.axhline(y=0.5, color='y', linestyle='--', label='Poor Threshold')
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'similarity_boxplot.png'))
        plt.close()
    
    def _generate_scatter_plot(self, bert_scores: List[float], cosine_scores: List[float], output_dir: str):
        plt.figure(figsize=(10, 6))
        plt.scatter(bert_scores, cosine_scores, alpha=0.5)
        plt.title('BERT Score vs Cosine Similarity')
        plt.xlabel('BERT Score')
        plt.ylabel('Cosine Similarity')
        plt.grid(True)
        plt.axhline(y=0.7, color='r', linestyle='--', label='Good Threshold')
        plt.axhline(y=0.5, color='y', linestyle='--', label='Poor Threshold')
        plt.axvline(x=0.7, color='r', linestyle='--')
        plt.axvline(x=0.5, color='y', linestyle='--')
        plt.legend()
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'similarity_scatter.png'))
        plt.close()
    
    def _generate_summary_stats(self, bert_scores: List[float], cosine_scores: List[float], output_dir: str):
        summary_stats = {
            'BERT Score': {
                'Mean': np.mean(bert_scores),
                'Median': np.median(bert_scores),
                'Std': np.std(bert_scores),
                'Min': np.min(bert_scores),
                'Max': np.max(bert_scores)
            },
            'Cosine Similarity': {
                'Mean': np.mean(cosine_scores),
                'Median': np.median(cosine_scores),
                'Std': np.std(cosine_scores),
                'Min': np.min(cosine_scores),
                'Max': np.max(cosine_scores)
            }
        }
        
        with open(os.path.join(output_dir, 'similarity_summary.txt'), 'w', encoding='utf-8') as f:
            f.write("相似度分析統計摘要\n")
            f.write("=" * 50 + "\n\n")
            
            f.write("判斷標準說明：\n")
            f.write("-" * 30 + "\n")
            f.write("BERT Score:\n")
            f.write("0.9-1.0: 極高的語意相似度，幾乎完全相同\n")
            f.write("0.8-0.9: 很高的語意相似度，表達方式不同但核心意思相同\n")
            f.write("0.7-0.8: 較高的語意相似度，主要意思相同但有些細節差異\n")
            f.write("0.6-0.7: 中等語意相似度，有部分共同點但差異較大\n")
            f.write("0.5-0.6: 較低的語意相似度，只有少量相關內容\n")
            f.write("0-0.5: 很低的語意相似度，幾乎不相關\n\n")
            
            f.write("Cosine Similarity:\n")
            f.write("0.9-1.0: 幾乎完全相同的向量方向\n")
            f.write("0.7-0.9: 非常相似的向量方向\n")
            f.write("0.5-0.7: 中等相似度\n")
            f.write("0.3-0.5: 較低相似度\n")
            f.write("0-0.3: 幾乎不相關\n\n")
            
            f.write("統計數據：\n")
            f.write("-" * 30 + "\n")
            for metric, stats in summary_stats.items():
                f.write(f"{metric} 統計:\n")
                f.write("-" * 30 + "\n")
                for stat_name, value in stats.items():
                    f.write(f"{stat_name}: {value:.4f}\n")
                f.write("\n") 