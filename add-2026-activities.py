#!/usr/bin/env python3
"""
添加 2026 年真實 NGO 活動到 SummerHub
"""

import json

# 2026 年真實活動 (從 Yahoo 新聞提取)
new_activities = [
    {
        "id": 42,
        "org_id": 2,
        "org_name": "英基學校協會 (ESF)",
        "name": "英基春季假日營 - 幼稚園英文＋綜合運動營",
        "category": "體育、烹飪及身心靈",
        "date_start": "2026-04-01",
        "date_end": "2026-04-21",
        "time": "全日",
        "location": "英基學校",
        "target_audience": "5 歲",
        "fee": "需查詢",
        "fee_amount": 0,
        "quota": 0,
        "deadline": "2026-03-31",
        "description": "春季全日營，結合英文學習同綜合運動",
        "url": "https://www.esfexplore.org.hk/",
        "image": ""
    },
    {
        "id": 43,
        "org_id": 2,
        "org_name": "英基學校協會 (ESF)",
        "name": "英基春季假日營 - AI 世界建築師＋綜合運動營",
        "category": "數碼及媒體技能",
        "date_start": "2026-04-01",
        "date_end": "2026-04-21",
        "time": "全日",
        "location": "英基學校",
        "target_audience": "6-8 歲",
        "fee": "需查詢",
        "fee_amount": 0,
        "quota": 0,
        "deadline": "2026-03-31",
        "description": "學習 AI 建築設計，結合運動活動",
        "url": "https://www.esfexplore.org.hk/",
        "image": ""
    },
    {
        "id": 44,
        "org_id": 2,
        "org_name": "英基學校協會 (ESF)",
        "name": "英基春季假日營 - 寶可夢靈感創客研究所",
        "category": "數碼及媒體技能",
        "date_start": "2026-04-01",
        "date_end": "2026-04-21",
        "time": "全日",
        "location": "英基學校",
        "target_audience": "6-9 歲",
        "fee": "需查詢",
        "fee_amount": 0,
        "quota": 0,
        "deadline": "2026-03-31",
        "description": "以寶可夢為主題嘅創意創客課程",
        "url": "https://www.esfexplore.org.hk/",
        "image": ""
    },
    {
        "id": 45,
        "org_id": 3,
        "org_name": "香港專業花式跳繩學校 (HKRSA)",
        "name": "兒童花式跳繩班",
        "category": "體育、烹飪及身心靈",
        "date_start": "2026-07-01",
        "date_end": "2026-08-31",
        "time": "需查詢",
        "location": "九龍灣常悅道 21 號 Eastmark 3 樓 12 舖",
        "target_audience": "小學生",
        "fee": "需查詢",
        "fee_amount": 0,
        "quota": 0,
        "deadline": "2026-06-30",
        "description": "全港歷史最悠久嘅跳繩培訓機構，小班教學 1:7",
        "url": "https://www.hkrsa.org/",
        "image": ""
    },
    {
        "id": 46,
        "org_id": 4,
        "org_name": "中國香港足球總會",
        "name": "賽馬會青少年足球訓練計劃 - 暑期推廣 2026",
        "category": "體育、烹飪及身心靈",
        "date_start": "2026-07-01",
        "date_end": "2026-08-31",
        "time": "需查詢",
        "location": "全港各區",
        "target_audience": "3-16 歲",
        "fee": "HK$150",
        "fee_amount": 150,
        "quota": 10000,
        "deadline": "2026-06-09",
        "description": "4 堂訓練 +2 日小型比賽，每名學員只需$150",
        "url": "https://resource.hkfa.com/",
        "image": ""
    },
    {
        "id": 47,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "賽馬會赤柱戶外訓練營 - 獨木舟班",
        "category": "戶外活動",
        "date_start": "2026-07-01",
        "date_end": "2026-08-31",
        "time": "需查詢",
        "location": "賽馬會赤柱戶外訓練營",
        "target_audience": "6-12 歲",
        "fee": "HK$560-$3,200",
        "fee_amount": 560,
        "quota": 0,
        "deadline": "2026-06-30",
        "description": "專業教練帶領，訓練自理力、適應及解難能力",
        "url": "https://summer.hkfyg.org.hk/",
        "image": ""
    },
    {
        "id": 48,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "賽馬會赤柱戶外訓練營 - 滑浪風帆班",
        "category": "戶外活動",
        "date_start": "2026-07-01",
        "date_end": "2026-08-31",
        "time": "需查詢",
        "location": "賽馬會赤柱戶外訓練營",
        "target_audience": "6-12 歲",
        "fee": "HK$560-$3,200",
        "fee_amount": 560,
        "quota": 0,
        "deadline": "2026-06-30",
        "description": "青少年滑浪風帆初級訓練課程",
        "url": "https://summer.hkfyg.org.hk/",
        "image": ""
    },
    {
        "id": 49,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "賽馬會赤柱戶外訓練營 - 直立板班",
        "category": "戶外活動",
        "date_start": "2026-07-01",
        "date_end": "2026-08-31",
        "time": "需查詢",
        "location": "賽馬會赤柱戶外訓練營",
        "target_audience": "14 歲以上",
        "fee": "HK$560-$3,200",
        "fee_amount": 560,
        "quota": 0,
        "deadline": "2026-06-30",
        "description": "直立板一、二段證書課程",
        "url": "https://summer.hkfyg.org.hk/",
        "image": ""
    },
    {
        "id": 50,
        "org_id": 1,
        "org_name": "HKFYG",
        "name": "賽馬會赤柱戶外訓練營 - 帆船班",
        "category": "戶外活動",
        "date_start": "2026-07-01",
        "date_end": "2026-08-31",
        "time": "需查詢",
        "location": "賽馬會赤柱戶外訓練營",
        "target_audience": "6-12 歲",
        "fee": "HK$560-$3,200",
        "fee_amount": 560,
        "quota": 0,
        "deadline": "2026-06-30",
        "description": "專業教練帶領嘅帆船體驗",
        "url": "https://summer.hkfyg.org.hk/",
        "image": ""
    }
]

# 讀取現有數據
with open('/home/node/.openclaw/workspace/summerhub/activities.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# 添加新活動
data['activities'].extend(new_activities)
data['total_activities'] = len(data['activities'])

# 更新機構列表
if '英基學校協會 (ESF)' not in data['organizations']:
    data['organizations'].append('英基學校協會 (ESF)')
if '香港專業花式跳繩學校 (HKRSA)' not in data['organizations']:
    data['organizations'].append('香港專業花式跳繩學校 (HKRSA)')
if '中國香港足球總會' not in data['organizations']:
    data['organizations'].append('中國香港足球總會')

# 更新分類
new_categories = ['體育、烹飪及身心靈', '數碼及媒體技能', '戶外活動']
for cat in new_categories:
    if cat not in data['categories']:
        data['categories'].append(cat)

data['version'] = "3.0"

# 保存
with open('/home/node/.openclaw/workspace/summerhub/activities.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ 添加了 {len(new_activities)} 個 2026 年真實活動")
print(f"📊 總活動數：{data['total_activities']}")
print(f"🏢 機構總數：{len(data['organizations'])}")
print(f"\n新增機構：")
for org in ['英基學校協會 (ESF)', '香港專業花式跳繩學校 (HKRSA)', '中國香港足球總會']:
    print(f"  - {org}")
