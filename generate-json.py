#!/usr/bin/env python3
"""
SummerHub JSON 數據生成器
生成示例活動數據到 JSON 文件
"""

import json
from datetime import datetime

# JSON 文件路徑
json_path = '/home/node/.openclaw/workspace/summerhub/activities.json'

print("📊 SummerHub JSON 數據生成器")
print("=" * 50)
print("⚠️  使用示例數據 (數據庫無活動)")

# 示例活動數據 (14 個 HKFYG 活動)
activities = [
    {
        "id": 1,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "暑期英語營 2026",
        "category": "語言",
        "date_start": "2026-07-15",
        "date_end": "2026-07-25",
        "time": "09:00-17:00",
        "location": "HKFYG 青年大樓",
        "target_audience": "中學生 (12-18 歲)",
        "fee": "HK$2,800",
        "fee_amount": 2800,
        "quota": 30,
        "deadline": "2026-06-30",
        "description": "為期 10 日的英語浸潤營，包括口語訓練、寫作工作坊、文化交流活動",
        "url": "https://summer.hkfyg.org.hk/activity/english-camp-2026",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/02/banner-03.jpg"
    },
    {
        "id": 2,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "青少年籃球訓練營",
        "category": "運動",
        "date_start": "2026-07-20",
        "date_end": "2026-08-05",
        "time": "10:00-12:00",
        "location": "HKFYG 體育館",
        "target_audience": "10-18 歲",
        "fee": "HK$1,200",
        "fee_amount": 1200,
        "quota": 24,
        "deadline": "2026-07-05",
        "description": "專業籃球教練指導，包括基本技術、戰術訓練、友誼賽",
        "url": "https://summer.hkfyg.org.hk/activity/basketball-camp",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/03/01-12.jpg"
    },
    {
        "id": 3,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "結他初班",
        "category": "音樂",
        "date_start": "2026-07-12",
        "date_end": "2026-08-16",
        "time": "11:00-12:30",
        "location": "HKFYG 音樂中心",
        "target_audience": "12 歲或以上",
        "fee": "HK$1,680",
        "fee_amount": 1680,
        "quota": 12,
        "deadline": "2026-06-28",
        "description": "學習基本和弦、指法、流行曲演奏",
        "url": "https://summer.hkfyg.org.hk/activity/guitar-beginner",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/03/01.jpg"
    },
    {
        "id": 4,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "創意繪畫班",
        "category": "藝術",
        "date_start": "2026-07-18",
        "date_end": "2026-08-08",
        "time": "10:00-12:00",
        "location": "HKFYG 藝術工作室",
        "target_audience": "6-15 歲",
        "fee": "HK$1,100",
        "fee_amount": 1100,
        "quota": 16,
        "deadline": "2026-07-01",
        "description": "水彩、油畫、素描等多種繪畫技巧",
        "url": "https://summer.hkfyg.org.hk/activity/creative-painting",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/02/banner-768x540.jpg"
    },
    {
        "id": 5,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "機械人編程營",
        "category": "科學",
        "date_start": "2026-07-25",
        "date_end": "2026-08-02",
        "time": "09:30-16:30",
        "location": "HKFYG 科技實驗室",
        "target_audience": "10-18 歲",
        "fee": "HK$3,200",
        "fee_amount": 3200,
        "quota": 20,
        "deadline": "2026-07-10",
        "description": "LEGO 機械人設計與編程，包含競賽環節",
        "url": "https://summer.hkfyg.org.hk/activity/robotics-camp",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/03/CE_5_鑑證科學培訓計劃_Y_Ka-lai-Au-e1772680535119-768x540.jpg"
    },
    {
        "id": 6,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "烹飪工作坊",
        "category": "興趣",
        "date_start": "2026-07-20",
        "date_end": "2026-08-10",
        "time": "10:00-13:00",
        "location": "HKFYG 烹飪室",
        "target_audience": "12 歲或以上",
        "fee": "HK$1,880",
        "fee_amount": 1880,
        "quota": 12,
        "deadline": "2026-07-05",
        "description": "中西式烹飪、烘焙、甜品製作",
        "url": "https://summer.hkfyg.org.hk/activity/cooking-class",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/03/PS_2_100℃甜點藝廊青年主理人_Y_Kwan-Man-chi-768x540.png"
    },
    {
        "id": 7,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "野外歷奇營",
        "category": "營會",
        "date_start": "2026-08-01",
        "date_end": "2026-08-05",
        "time": "全日",
        "location": "西貢野外中心",
        "target_audience": "12-18 歲",
        "fee": "HK$3,800",
        "fee_amount": 3800,
        "quota": 24,
        "deadline": "2026-07-15",
        "description": "5 日 4 夜野外露營、划艇、攀岩、團隊建設",
        "url": "https://summer.hkfyg.org.hk/activity/adventure-camp",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/03/KF_4_葵芳自立學堂（野外露營）A_C.jpg_Wong-Wai-ki-768x540.jpg"
    },
    {
        "id": 8,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "游泳強化班",
        "category": "運動",
        "date_start": "2026-07-08",
        "date_end": "2026-07-28",
        "time": "15:00-16:30",
        "location": "港島游泳池",
        "target_audience": "6-16 歲",
        "fee": "HK$980",
        "fee_amount": 980,
        "quota": 15,
        "deadline": "2026-06-20",
        "description": "四式泳術訓練，適合初學及中級學員",
        "url": "https://summer.hkfyg.org.hk/activity/swimming-class",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/03/TK_4_Summer-Water-Fun-X-獨木舟_C_Lam-Chu-chi-768x540.jpg"
    },
    {
        "id": 9,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "鋼琴獨奏班",
        "category": "音樂",
        "date_start": "2026-07-05",
        "date_end": "2026-08-20",
        "time": "16:00-17:00",
        "location": "HKFYG 音樂中心",
        "target_audience": "8 歲或以上",
        "fee": "HK$2,200",
        "fee_amount": 2200,
        "quota": 8,
        "deadline": "2026-06-15",
        "description": "一對一鋼琴指導，古典及流行曲",
        "url": "https://summer.hkfyg.org.hk/activity/piano-solo",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/03/PS_1_【聲動仲夏】青少年-DJ-入門工作坊_Y_Kwan-Man-chi-768x540.png"
    },
    {
        "id": 10,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "陶藝工作坊",
        "category": "藝術",
        "date_start": "2026-07-22",
        "date_end": "2026-07-29",
        "time": "14:00-17:00",
        "location": "HKFYG 陶藝室",
        "target_audience": "12 歲或以上",
        "fee": "HK$1,580",
        "fee_amount": 1580,
        "quota": 10,
        "deadline": "2026-07-08",
        "description": "手捏陶、拉坯、上釉等完整陶藝體驗",
        "url": "https://summer.hkfyg.org.hk/activity/pottery-workshop",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/03/PS_4_腦內密室逃脫日營_C_Kwan-Man-chi-768x540.png"
    },
    {
        "id": 11,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "科學實驗班",
        "category": "科學",
        "date_start": "2026-07-15",
        "date_end": "2026-08-05",
        "time": "13:00-15:00",
        "location": "HKFYG 科學室",
        "target_audience": "8-14 歲",
        "fee": "HK$1,380",
        "fee_amount": 1380,
        "quota": 18,
        "deadline": "2026-06-30",
        "description": "有趣化學、物理、生物實驗",
        "url": "https://summer.hkfyg.org.hk/activity/science-experiment",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/03/TP_3_STEM 模型設計班_C_Choi-Yuet-yin-768x540.png"
    },
    {
        "id": 12,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "攝影入門班",
        "category": "興趣",
        "date_start": "2026-07-12",
        "date_end": "2026-08-02",
        "time": "15:00-17:00",
        "location": "HKFYG 多媒體室",
        "target_audience": "14 歲或以上",
        "fee": "HK$1,480",
        "fee_amount": 1480,
        "quota": 15,
        "deadline": "2026-06-28",
        "description": "DSLR 相機操作、構圖、後期處理",
        "url": "https://summer.hkfyg.org.hk/activity/photography-beginner",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/03/HH_3_青年時裝攝影體驗_Y_Chan-Wun-sin-768x540.jpg"
    },
    {
        "id": 13,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "領袖訓練營",
        "category": "營會",
        "date_start": "2026-07-28",
        "date_end": "2026-08-03",
        "time": "全日",
        "location": "HKFYG 營地",
        "target_audience": "14-22 歲",
        "fee": "HK$2,980",
        "fee_amount": 2980,
        "quota": 30,
        "deadline": "2026-07-10",
        "description": "領導力培訓、團隊合作、溝通技巧",
        "url": "https://summer.hkfyg.org.hk/activity/leadership-camp",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/03/hsk_5_我們去 CAMP 吧・義工計劃_Y_Chang-Man-hin-768x540.jpeg"
    },
    {
        "id": 14,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "日語入門班",
        "category": "語言",
        "date_start": "2026-07-10",
        "date_end": "2026-08-10",
        "time": "14:00-16:00",
        "location": "HKFYG 銅鑼灣中心",
        "target_audience": "15 歲或以上",
        "fee": "HK$1,500",
        "fee_amount": 1500,
        "quota": 20,
        "deadline": "2026-06-25",
        "description": "初級日語課程，學習基本會話、平假名、片假名",
        "url": "https://summer.hkfyg.org.hk/activity/japanese-beginner",
        "image": "https://summer.hkfyg.org.hk/wp-content/uploads/sites/97/2026/02/bannerBig-1.jpg"
    }
]

# 構建 JSON 結構
data = {
    "version": "1.0",
    "generated_at": datetime.now().isoformat(),
    "total_activities": len(activities),
    "categories": sorted(list(set(a["category"] for a in activities))),
    "organizations": sorted(list(set(a["org_name"] for a in activities if a.get("org_name")))),
    "activities": activities
}

# 寫入 JSON 文件
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n✅ JSON 文件已生成：{json_path}")
print(f"📊 活動總數：{len(activities)}")
print(f"📂 類別：{', '.join(data['categories'])}")
print(f"🏢 機構：{', '.join(data['organizations'])}")

# 顯示統計
print("\n=== 活動統計 ===")
from collections import Counter
category_count = Counter(a["category"] for a in activities)
for cat, count in sorted(category_count.items()):
    print(f"  {cat}: {count} 個")

print(f"\n✅ 完成！JSON 文件已準備好！")
