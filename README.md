# SummerHub 暑期活動資料庫

## 🏖️ 項目介紹

SummerHub 是一個暑期活動資料庫，收集多個機構的暑期活動資訊，提供搜索、篩選功能。

## 📁 文件結構

```
summerhub/
├── database.db       # SQLite 數據庫
├── index.html        # HTML5 網頁
├── schema.sql        # 數據庫結構
└── README.md         # 說明文檔
```

## 🚀 使用方法

### 本地預覽
```bash
cd summerhub
python3 -m http.server 8000
# 訪問 http://localhost:8000
```

### GitHub Pages 部署
1. 將文件推送到 GitHub Repo
2. 啟用 GitHub Pages
3. 訪問 `https://your-username.github.io/summerhub/`

## 📊 數據庫結構

### organizations (機構表)
- id: 機構 ID
- name: 機構名稱
- website: 網站 URL

### activities (活動表)
- id: 活動 ID
- org_id: 機構 ID
- name: 活動名稱
- category: 類別
- date_start: 開始日期
- date_end: 結束日期
- location: 地點
- fee: 費用
- url: 報名連結

### categories (類別表)
- id: 類別 ID
- name: 類別名稱
- color: 顏色

## 🔧 添加新機構

```sql
INSERT INTO organizations (name, name_en, website) 
VALUES ('機構名稱', 'English Name', 'https://...');
```

然後收集該機構的活動數據並插入 activities 表。

## 📝 版本

- v1.0 (2026-04-05) - 初始版本
  - 支持 HKFYG 活動
  - 搜索/篩選功能
  - 響應式設計
