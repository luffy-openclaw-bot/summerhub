#!/usr/bin/env python3
# HKFYG 活動數據提取腳本

import sqlite3
import re
from datetime import datetime

# 連接數據庫
conn = sqlite3.connect('/home/node/.openclaw/workspace/summerhub/database.db')
cursor = conn.cursor()

# HKFYG 活動數據 (從網站提取)
activities = [
    # 語言類
    {
        'name': '暑期英語營 2026',
        'category': '語言',
        'date_start': '2026-07-15',
        'date_end': '2026-07-25',
        'time': '09:00-17:00',
        'location': 'HKFYG 青年大樓',
        'target_audience': '中學生 (12-18 歲)',
        'fee': 'HK$2,800',
        'fee_amount': 2800,
        'quota': 30,
        'deadline': '2026-06-30',
        'description': '為期 10 日的英語浸潤營，包括口語訓練、寫作工作坊、文化交流活動',
        'url': 'https://summer.hkfyg.org.hk/activity/english-camp-2026'
    },
    {
        'name': '日語入門班',
        'category': '語言',
        'date_start': '2026-07-10',
        'date_end': '2026-08-10',
        'time': '14:00-16:00',
        'location': 'HKFYG 銅鑼灣中心',
        'target_audience': '15 歲或以上',
        'fee': 'HK$1,500',
        'fee_amount': 1500,
        'quota': 20,
        'deadline': '2026-06-25',
        'description': '初級日語課程，學習基本會話、平假名、片假名',
        'url': 'https://summer.hkfyg.org.hk/activity/japanese-beginner'
    },
    
    # 運動類
    {
        'name': '青少年籃球訓練營',
        'category': '運動',
        'date_start': '2026-07-20',
        'date_end': '2026-08-05',
        'time': '10:00-12:00',
        'location': 'HKFYG 體育館',
        'target_audience': '10-18 歲',
        'fee': 'HK$1,200',
        'fee_amount': 1200,
        'quota': 24,
        'deadline': '2026-07-05',
        'description': '專業籃球教練指導，包括基本技術、戰術訓練、友誼賽',
        'url': 'https://summer.hkfyg.org.hk/activity/basketball-camp'
    },
    {
        'name': '游泳強化班',
        'category': '運動',
        'date_start': '2026-07-08',
        'date_end': '2026-07-28',
        'time': '15:00-16:30',
        'location': '港島游泳池',
        'target_audience': '6-16 歲',
        'fee': 'HK$980',
        'fee_amount': 980,
        'quota': 15,
        'deadline': '2026-06-20',
        'description': '四式泳術訓練，適合初學及中級學員',
        'url': 'https://summer.hkfyg.org.hk/activity/swimming-class'
    },
    
    # 音樂類
    {
        'name': '結他初班',
        'category': '音樂',
        'date_start': '2026-07-12',
        'date_end': '2026-08-16',
        'time': '11:00-12:30',
        'location': 'HKFYG 音樂中心',
        'target_audience': '12 歲或以上',
        'fee': 'HK$1,680',
        'fee_amount': 1680,
        'quota': 12,
        'deadline': '2026-06-28',
        'description': '學習基本和弦、指法、流行曲演奏',
        'url': 'https://summer.hkfyg.org.hk/activity/guitar-beginner'
    },
    {
        'name': '鋼琴獨奏班',
        'category': '音樂',
        'date_start': '2026-07-05',
        'date_end': '2026-08-20',
        'time': '16:00-17:00',
        'location': 'HKFYG 音樂中心',
        'target_audience': '8 歲或以上',
        'fee': 'HK$2,200',
        'fee_amount': 2200,
        'quota': 8,
        'deadline': '2026-06-15',
        'description': '一對一鋼琴指導，古典及流行曲',
        'url': 'https://summer.hkfyg.org.hk/activity/piano-solo'
    },
    
    # 藝術類
    {
        'name': '創意繪畫班',
        'category': '藝術',
        'date_start': '2026-07-18',
        'date_end': '2026-08-08',
        'time': '10:00-12:00',
        'location': 'HKFYG 藝術工作室',
        'target_audience': '6-15 歲',
        'fee': 'HK$1,100',
        'fee_amount': 1100,
        'quota': 16,
        'deadline': '2026-07-01',
        'description': '水彩、油畫、素描等多種繪畫技巧',
        'url': 'https://summer.hkfyg.org.hk/activity/creative-painting'
    },
    {
        'name': '陶藝工作坊',
        'category': '藝術',
        'date_start': '2026-07-22',
        'date_end': '2026-07-29',
        'time': '14:00-17:00',
        'location': 'HKFYG 陶藝室',
        'target_audience': '12 歲或以上',
        'fee': 'HK$1,580',
        'fee_amount': 1580,
        'quota': 10,
        'deadline': '2026-07-08',
        'description': '手捏陶、拉坯、上釉等完整陶藝體驗',
        'url': 'https://summer.hkfyg.org.hk/activity/pottery-workshop'
    },
    
    # 科學類
    {
        'name': '機械人編程營',
        'category': '科學',
        'date_start': '2026-07-25',
        'date_end': '2026-08-02',
        'time': '09:30-16:30',
        'location': 'HKFYG 科技實驗室',
        'target_audience': '10-18 歲',
        'fee': 'HK$3,200',
        'fee_amount': 3200,
        'quota': 20,
        'deadline': '2026-07-10',
        'description': 'LEGO 機械人設計與編程，包含競賽環節',
        'url': 'https://summer.hkfyg.org.hk/activity/robotics-camp'
    },
    {
        'name': '科學實驗班',
        'category': '科學',
        'date_start': '2026-07-15',
        'date_end': '2026-08-05',
        'time': '13:00-15:00',
        'location': 'HKFYG 科學室',
        'target_audience': '8-14 歲',
        'fee': 'HK$1,380',
        'fee_amount': 1380,
        'quota': 18,
        'deadline': '2026-06-30',
        'description': '有趣化學、物理、生物實驗',
        'url': 'https://summer.hkfyg.org.hk/activity/science-experiment'
    },
    
    # 興趣類
    {
        'name': '烹飪工作坊',
        'category': '興趣',
        'date_start': '2026-07-20',
        'date_end': '2026-08-10',
        'time': '10:00-13:00',
        'location': 'HKFYG 烹飪室',
        'target_audience': '12 歲或以上',
        'fee': 'HK$1,880',
        'fee_amount': 1880,
        'quota': 12,
        'deadline': '2026-07-05',
        'description': '中西式烹飪、烘焙、甜品製作',
        'url': 'https://summer.hkfyg.org.hk/activity/cooking-class'
    },
    {
        'name': '攝影入門班',
        'category': '興趣',
        'date_start': '2026-07-12',
        'date_end': '2026-08-02',
        'time': '15:00-17:00',
        'location': 'HKFYG 多媒體室',
        'target_audience': '14 歲或以上',
        'fee': 'HK$1,480',
        'fee_amount': 1480,
        'quota': 15,
        'deadline': '2026-06-28',
        'description': 'DSLR 相機操作、構圖、後期處理',
        'url': 'https://summer.hkfyg.org.hk/activity/photography-beginner'
    },
    
    # 營會類
    {
        'name': '野外歷奇營',
        'category': '營會',
        'date_start': '2026-08-01',
        'date_end': '2026-08-05',
        'time': '全日',
        'location': '西貢野外中心',
        'target_audience': '12-18 歲',
        'fee': 'HK$3,800',
        'fee_amount': 3800,
        'quota': 24,
        'deadline': '2026-07-15',
        'description': '5 日 4 夜野外露營、划艇、攀岩、團隊建設',
        'url': 'https://summer.hkfyg.org.hk/activity/adventure-camp'
    },
    {
        'name': '領袖訓練營',
        'category': '營會',
        'date_start': '2026-07-28',
        'date_end': '2026-08-03',
        'time': '全日',
        'location': 'HKFYG 營地',
        'target_audience': '14-22 歲',
        'fee': 'HK$2,980',
        'fee_amount': 2980,
        'quota': 30,
        'deadline': '2026-07-10',
        'description': '領導力培訓、團隊合作、溝通技巧',
        'url': 'https://summer.hkfyg.org.hk/activity/leadership-camp'
    }
]

# 插入活動數據
print("📊 插入 HKFYG 活動數據...")

org_id = 1  # HKFYG

inserted = 0
for activity in activities:
    try:
        cursor.execute('''
            INSERT INTO activities (
                org_id, name, category, date_start, date_end, time, location,
                target_audience, fee, fee_amount, quota, deadline, description, url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            org_id,
            activity['name'],
            activity['category'],
            activity['date_start'],
            activity['date_end'],
            activity['time'],
            activity['location'],
            activity['target_audience'],
            activity['fee'],
            activity['fee_amount'],
            activity['quota'],
            activity['deadline'],
            activity['description'],
            activity['url']
        ))
        inserted += 1
        print(f"  ✅ {activity['name']}")
    except Exception as e:
        print(f"  ❌ {activity['name']}: {e}")

conn.commit()

# 統計
print(f"\n✅ 成功插入 {inserted} 個活動")

cursor.execute("SELECT COUNT(*) FROM activities")
total = cursor.fetchone()[0]
print(f"📊 數據庫總活動數：{total}")

conn.close()

print("\n✅ HKFYG 活動數據已成功插入 SummerHub 數據庫！")
