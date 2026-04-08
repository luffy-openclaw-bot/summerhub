-- SummerHub 數據庫 Schema
-- 暑期活動資料庫

-- 機構表
CREATE TABLE IF NOT EXISTS organizations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_en TEXT,
    website TEXT,
    logo TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 活動表
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    org_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    name_en TEXT,
    category TEXT,
    date_start TEXT,
    date_end TEXT,
    time TEXT,
    location TEXT,
    target_audience TEXT,
    age_min INTEGER,
    age_max INTEGER,
    fee TEXT,
    fee_amount REAL,
    quota INTEGER,
    deadline TEXT,
    description TEXT,
    url TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (org_id) REFERENCES organizations(id)
);

-- 類別表
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_en TEXT,
    color TEXT DEFAULT '#3498db',
    icon TEXT
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_activities_org ON activities(org_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date_start, date_end);
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);

-- 插入默認類別
INSERT INTO categories (name, name_en, color, icon) VALUES
('語言', 'Language', '#3498db', '📚'),
('運動', 'Sports', '#e74c3c', '⚽'),
('音樂', 'Music', '#9b59b6', '🎵'),
('藝術', 'Arts', '#f39c12', '🎨'),
('科學', 'Science', '#1abc9c', '🔬'),
('興趣', 'Hobbies', '#34495e', '🎯'),
('營會', 'Camps', '#2ecc71', '🏕️'),
('其他', 'Others', '#95a5a6', '📌');

-- 插入 HKFYG 機構
INSERT INTO organizations (name, name_en, website, description) VALUES
('香港青年協會', 'HKFYG', 'https://summer.hkfyg.org.hk/', '香港青年協會暑期活動');
