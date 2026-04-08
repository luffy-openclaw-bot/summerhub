#!/usr/bin/env node

/**
 * SummerHub 數據清理腳本
 * 將爬取嘅 HKFYG 活動數據轉換為標準格式
 */

const fs = require('fs');
const path = require('path');

// 讀取原始數據
const rawPath = path.join(__dirname, '..', 'crawl-results', 'hkfyg-activities.json');
const outputPath = path.join(__dirname, '..', 'activities.json');

const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf-8'));

// 類別映射
const categoryMap = {
  '1': '音樂、藝術及文化',
  '2': '體育、烹飪及身心靈',
  '3': '數碼及媒體技能',
  '4': '戶外活動',
  '5': '個人成長及社會服務'
};

/**
 * 解析活動名稱（格式：類別 - 活動名稱 地點 年齡 時間 費用）
 */
function parseActivityName(name) {
  // 移除多餘空格
  const cleanName = name.replace(/\s+/g, ' ').trim();
  
  // 嘗試提取活動名稱（通常喺最前面）
  let activityName = cleanName;
  let categoryNum = null;
  let location = null;
  let ageRange = null;
  let schedule = null;
  let fee = null;
  
  // 提取類別編號 (1-5)
  const categoryMatch = cleanName.match(/^(\d)-\s/);
  if (categoryMatch) {
    categoryNum = categoryMatch[1];
    activityName = cleanName.substring(categoryMatch[0].length);
  }
  
  // 提取費用 ($ 結尾)
  const feeMatch = cleanName.match(/\$([\d,]+)(?:\s*\/.*)?$/);
  if (feeMatch) {
    fee = feeMatch[1].replace(/,/g, '');
    activityName = activityName.replace(feeMatch[0], '').trim();
  }
  
  // 提取年齡 (XX – XX 歲 或 XX -XX 歲)
  const ageMatch = cleanName.match(/(\d+\s*[–-]\s*\d+\s*歲)/);
  if (ageMatch) {
    ageRange = ageMatch[1].replace(/\s/g, '');
  }
  
  // 提取地點 (通常包含 "青年空間" 或 "大樓")
  const locationMatch = cleanName.match(/([\u4e00-\u9fa5]{2,}青年空間|[\u4e00-\u9fa5]{2,}大樓|[\u4e00-\u9fa5]{2,}教育組)/);
  if (locationMatch) {
    location = locationMatch[1];
  }
  
  // 清理活動名稱
  activityName = activityName
    .replace(/\s+/g, ' ')
    .replace(/\s*[\$HKD].*$/, '')
    .replace(/\s*\d+\s*–\s*\d+\s*歲\s*/, '')
    .trim();
  
  // 如果名稱太長，嘗試截取
  if (activityName.length > 50) {
    activityName = activityName.substring(0, 50).trim() + '...';
  }
  
  return {
    activityName,
    categoryNum,
    category: categoryNum ? categoryMap[categoryNum] : '其他',
    location,
    ageRange,
    schedule,
    fee: fee ? parseFloat(fee) : null
  };
}

/**
 * 清理活動數據
 */
function cleanActivities(activities) {
  const cleaned = [];
  const seen = new Set(); // 用於去重
  
  for (const activity of activities) {
    // 跳過 Banner 同無效數據
    if (activity.name.includes('Banner') || 
        activity.name.includes('報名日程') ||
        !activity.name.trim()) {
      continue;
    }
    
    // 解析活動信息
    const parsed = parseActivityName(activity.name);
    
    // 如果無法解析出有意義的活動名稱，跳過
    if (!parsed.activityName || parsed.activityName.length < 3) {
      continue;
    }
    
    // 創建唯一鍵用於去重
    const uniqueKey = `${parsed.activityName}-${parsed.fee || 'free'}`;
    if (seen.has(uniqueKey)) {
      continue;
    }
    seen.add(uniqueKey);
    
    // 轉換為 SummerHub 格式
    const cleanedActivity = {
      id: `hkfyg-${cleaned.length + 1}`,
      name: parsed.activityName,
      category: parsed.category,
      categoryNumber: parsed.categoryNum,
      location: parsed.location || '待定',
      ageRange: parsed.ageRange || '不限',
      schedule: parsed.schedule || '待定',
      fee: parsed.fee,
      feeDisplay: parsed.fee ? `$${parsed.fee}` : (activity.name.includes('免費') ? '免費' : '待定'),
      image: activity.image || null,
      url: activity.url || null,
      source: 'HKFYG',
      rawName: activity.name
    };
    
    cleaned.push(cleanedActivity);
  }
  
  return cleaned;
}

// 執行清理
console.log('🔧 開始清理數據...');
console.log(`📊 原始數據：${rawData.length} 個活動`);

const cleanedActivities = cleanActivities(rawData);

console.log(`✅ 清理後：${cleanedActivities.length} 個活動`);
console.log(`📁 輸出到：${outputPath}`);

// 寫入輸出文件
fs.writeFileSync(outputPath, JSON.stringify(cleanedActivities, null, 2), 'utf-8');

// 生成統計報告
const stats = {
  total: cleanedActivities.length,
  byCategory: {},
  withImages: cleanedActivities.filter(a => a.image).length,
  freeActivities: cleanedActivities.filter(a => a.fee === 0 || a.feeDisplay === '免費').length,
  paidActivities: cleanedActivities.filter(a => a.fee && a.fee > 0).length
};

cleanedActivities.forEach(a => {
  if (!stats.byCategory[a.category]) {
    stats.byCategory[a.category] = 0;
  }
  stats.byCategory[a.category]++;
});

console.log('\n📈 統計報告:');
console.log(`   總數：${stats.total}`);
console.log(`   有圖片：${stats.withImages}`);
console.log(`   免費活動：${stats.freeActivities}`);
console.log(`   收費活動：${stats.paidActivities}`);
console.log('\n   按類別分佈:');
Object.entries(stats.byCategory).forEach(([cat, count]) => {
  console.log(`   - ${cat}: ${count}`);
});

console.log('\n✨ 數據清理完成！');
