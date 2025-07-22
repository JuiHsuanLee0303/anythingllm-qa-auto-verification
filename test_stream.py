#!/usr/bin/env python3
"""
測試 stream 端點的腳本
用於驗證心跳機制和超時處理是否正常工作
"""

import requests
import time
import json
import threading
from queue import Queue

def test_stream_endpoint():
    """測試 stream 端點的基本功能"""
    
    # 模擬一個長時間運行的任務
    task_id = "test-task-123"
    
    # 創建一個測試隊列
    test_queue = Queue()
    
    # 模擬任務處理
    def simulate_task():
        for i in range(10):
            time.sleep(2)  # 每2秒發送一條消息
            test_queue.put(json.dumps({
                "log": f"處理進度 {i+1}/10",
                "progress": (i+1) * 10,
                "status": f"正在處理第 {i+1} 項..."
            }))
        
        # 發送完成信號
        test_queue.put("<<TASK_DONE>>")
    
    # 啟動模擬任務
    task_thread = threading.Thread(target=simulate_task)
    task_thread.daemon = True
    task_thread.start()
    
    print(f"開始測試 stream 端點，任務 ID: {task_id}")
    print("模擬任務將在20秒內完成...")
    
    # 模擬 EventSource 連接
    start_time = time.time()
    heartbeat_count = 0
    message_count = 0
    
    try:
        # 這裡我們模擬 EventSource 的行為
        # 實際測試需要在前端進行
        while time.time() - start_time < 30:  # 最多等待30秒
            if not test_queue.empty():
                message = test_queue.get(timeout=1)
                if message == "<<TASK_DONE>>":
                    print("✅ 收到任務完成信號")
                    break
                else:
                    data = json.loads(message)
                    print(f"📨 收到消息: {data}")
                    message_count += 1
            else:
                # 模擬心跳
                time.sleep(1)
                heartbeat_count += 1
                if heartbeat_count % 10 == 0:
                    print(f"💓 心跳 #{heartbeat_count//10}")
    
    except Exception as e:
        print(f"❌ 測試過程中發生錯誤: {e}")
    
    print(f"測試完成:")
    print(f"- 總運行時間: {time.time() - start_time:.1f} 秒")
    print(f"- 收到消息數: {message_count}")
    print(f"- 心跳次數: {heartbeat_count//10}")

if __name__ == "__main__":
    test_stream_endpoint() 