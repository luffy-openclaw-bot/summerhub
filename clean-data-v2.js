/**
 * HKFYG 活動數據清理腳本 v2
 * 改進解析邏輯，正確分離各個字段
 */

const fs = require('fs');

// 讀取原始數據
const rawData = JSON.parse(fs.readFileSync('/home/node/.openclaw/workspace/summerhub/crawl-results/hkfyg-activities.json', 'utf8'));

console.log('🔧 開始清理數據 (v2)...');
console.log(`📊 原始數據：${rawData.length} 個活動`);

// 清理函數
function parseActivity(raw) {
    const text = raw.name;
    
    // 跳過無效數據
    if (!text || text.includes('最新消息') || text.includes('Banner') || text.includes('閱讀更多')) {
        return null;
    }
    
    // 提取類別 (開頭的數字 - 類別名稱)
    const categoryMatch = text.match(/^(\d)-\s*([^\s]+)/);
    const categoryCode = categoryMatch ? categoryMatch[1] : '0';
    
    // 類別映射
    const categoryMap = {
        '1': '音樂、藝術及文化',
        '2': '體育、烹飪及身心靈',
        '3': '數碼及媒體技能',
        '4': '戶外活動',
        '5': '個人成長及社會服務'
    };
    
    const category = categoryMap[categoryCode] || '其他';
    
    // 移除類別前綴
    const cleanText = text.replace(/^\d-\s*[^\s]+\s*/, '').trim();
    
    // 嘗試分割不同部分 (基於多個空格)
    const parts = cleanText.split(/\s{2,}/).filter(p => p.trim());
    
    // 提取活動名稱 (通常係第一部分)
    let name = parts[0] || cleanText;
    name = name.replace(/\s+/g, ' ').trim();
    
    // 提取地點 (包含「青年空間」、「中心」、「大樓」等)
    let location = '';
    const locationIndex = parts.findIndex(p => 
        p.includes('青年空間') || 
        p.includes('中心') || 
        p.includes('大樓') ||
        p.includes('教育組')
    );
    if (locationIndex >= 0) {
        location = parts[locationIndex].trim();
    }
    
    // 提取對象 (包含「歲」)
    let targetAudience = '';
    const ageIndex = parts.findIndex(p => p.includes('歲'));
    if (ageIndex >= 0) {
        targetAudience = parts[ageIndex].trim();
    }
    
    // 提取日期時間 (包含數字 + / + 數字，或「逢」)
    let dateTime = '';
    const dateIndex = parts.findIndex(p => 
        p.match(/\d{1,2}\/\d{1,2}/) || 
        p.includes('逢')
    );
    if (dateIndex >= 0) {
        dateTime = parts[dateIndex].trim();
    }
    
    // 提取費用 (包含 $)
    let fee = '';
    const feeIndex = parts.findIndex(p => p.includes('$'));
    if (feeIndex >= 0) {
        const feeMatch = parts[feeIndex].match(/\$[\d,]+/);
        fee = feeMatch ? feeMatch[0] : '';
    }
    
    // 如果活動名稱太短或無意義，跳過
    if (name.length < 5 || name.includes('閱讀更多')) {
        return null;
    }
    
    // 解析日期
    let dateStart = '';
    let dateEnd = '';
    if (dateTime) {
        const dateMatch = dateTime.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
        if (dateMatch) {
            const parts = dateMatch[0].split('/');
            dateStart = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
    }
    
    return {
        id: 0,
        org_id: 1,
        org_name: 'HKFYG',
        name: name,
        category: category,
        date_start: dateStart,
        date_end: dateEnd,
        time: dateTime,
        location: location,
        target_audience: targetAudience,
        fee: fee,
        fee_amount: fee ? parseInt(fee.replace(/[$,]/g, '')) : 0,
        quota: 0,
        deadline: '',
        description: name,
        url: raw.url || '',
        image: raw.image || ''
    };
}

// 清理所有活動
const cleanedActivities = [];
rawData.forEach((raw, index) => {
    const activity = parseActivity(raw);
    if (activity) {
        activity.id = cleanedActivities.length + 1;
        cleanedActivities.push(activity);
    }
});

// 去重 (根據名稱)
const uniqueActivities = [];
const seen = new Set();
cleanedActivities.forEach(a => {
    if (!seen.has(a.name)) {
        seen.add(a.name);
        uniqueActivities.push(a);
    }
});

// 重新分配 ID
uniqueActivities.forEach((a, i) => {
    a.id = i + 1;
});

console.log(`✅ 清理後：${uniqueActivities.length} 個活動`);

// 分類統計
const categoryCount = {};
uniqueActivities.forEach(a => {
    categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
});

console.log('\n=== 分類統計 ===');
Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
});

// 生成 JSON
const outputData = {
    version: "2.0",
    generated_at: new Date().toISOString(),
    total_activities: uniqueActivities.length,
    categories: Object.keys(categoryCount),
    organizations: ['HKFYG'],
    activities: uniqueActivities
};

// 保存文件
const outputFile = '/home/node/.openclaw/workspace/summerhub/activities.json';
fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2));

console.log(`\n✅ 已保存到：${outputFile}`);

// 顯示示例
console.log('\n=== 示例活動 (首 5 個) ===');
uniqueActivities.slice(0, 5).forEach((a, i) => {
    console.log(`${i + 1}. ${a.name}`);
    console.log(`   類別：${a.category}`);
    console.log(`   地點：${a.location}`);
    console.log(`   對象：${a.target_audience}`);
    console.log(`   日期：${a.time}`);
    console.log(`   費用：${a.fee}`);
    console.log();
});

console.log('✅ 數據清理完成 (v2)！');
