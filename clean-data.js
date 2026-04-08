/**
 * HKFYG 活動數據清理腳本
 * 將爬取嘅原始數據轉換為 SummerHub 可用格式
 */

const fs = require('fs');

// 讀取原始數據
const rawData = JSON.parse(fs.readFileSync('/home/node/.openclaw/workspace/summerhub/crawl-results/hkfyg-activities.json', 'utf8'));

console.log('🔧 開始清理數據...');
console.log(`📊 原始數據：${rawData.length} 個活動`);

// 清理函數
function parseActivity(raw) {
    const text = raw.name;
    
    // 跳過無效數據
    if (!text || text.includes('最新消息') || text.includes('Banner') || text.includes('閱讀更多')) {
        return null;
    }
    
    // 提取類別 (開頭的數字 + 類別名稱)
    const categoryMatch = text.match(/^(\d)-\s*([^\n]+)/);
    const categoryCode = categoryMatch ? categoryMatch[1] : '0';
    const categoryFull = categoryMatch ? categoryMatch[2].trim() : '其他';
    
    // 類別映射
    const categoryMap = {
        '1': '音樂、藝術及文化',
        '2': '體育、烹飪及身心靈',
        '3': '數碼及媒體技能',
        '4': '戶外活動',
        '5': '個人成長及社會服務'
    };
    
    const category = categoryMap[categoryCode] || categoryFull || '其他';
    
    // 提取活動名稱 (類別之後的第一行)
    const lines = text.split('\n').filter(l => l.trim());
    const nameLine = lines[1] || lines[0];
    const name = nameLine ? nameLine.replace(/^\d-\s*/, '').trim() : '未知活動';
    
    // 提取地點 (包含「青年空間」、「中心」、「大樓」等)
    const locationLine = lines.find(l => 
        l.includes('青年空間') || 
        l.includes('中心') || 
        l.includes('大樓') ||
        l.includes('教育組')
    ) || '';
    
    // 提取對象 (包含「歲」)
    const ageLine = lines.find(l => l.includes('歲')) || '';
    
    // 提取日期時間 (包含數字 + / + 數字，或「逢」)
    const dateLine = lines.find(l => 
        l.match(/\d{1,2}\/\d{1,2}/) || 
        l.includes('逢')
    ) || '';
    
    // 提取費用 (包含 $)
    const feeLine = lines.find(l => l.includes('$')) || '';
    const feeMatch = feeLine.match(/\$[\d,]+/);
    const fee = feeMatch ? feeMatch[0] : '';
    
    // 如果數據太少，跳過
    if (name.length < 5 || name === '未知活動') {
        return null;
    }
    
    return {
        id: 0, // 稍後分配
        org_id: 1,
        org_name: 'HKFYG',
        name: name,
        category: category,
        date_start: '', // 需要進一步解析
        date_end: '',
        time: dateLine.includes('逢') ? dateLine : '',
        location: locationLine.trim(),
        target_audience: ageLine.trim(),
        fee: fee,
        fee_amount: fee ? parseInt(fee.replace(/[$,]/g, '')) : 0,
        quota: 0,
        deadline: '',
        description: `${name} - ${category}`,
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
    version: "1.0",
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
    console.log(`   費用：${a.fee}`);
    console.log();
});

console.log('✅ 數據清理完成！');
