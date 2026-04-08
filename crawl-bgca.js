/**
 * BGCA (香港小童群益會) 暑期活動爬蟲
 */

const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    console.log('🕷️ 開始爬取 BGCA 暑期活動...');
    console.log('=' .repeat(50));
    
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    
    const page = await context.newPage();
    
    try {
        let allActivities = [];
        
        // 訪問 BGCA 活動網站
        console.log('📄 訪問：https://fans.bgca.org.hk/');
        await page.goto('https://fans.bgca.org.hk/', {
            waitUntil: 'networkidle',
            timeout: 60000
        });
        
        console.log('✅ 頁面加載完成');
        
        // 截圖
        await page.screenshot({
            path: '/home/node/.openclaw/workspace/summerhub/crawl-results/bgca-homepage.png',
            fullPage: true
        });
        console.log('📸 已保存截圖');
        
        // 查找活動連結
        console.log('\n🔍 查找活動連結...');
        
        const activityLinks = await page.evaluate(() => {
            const links = [];
            
            // 查找所有活動連結
            document.querySelectorAll('a[href*="activity"], a[href*="event"], a[href*="programme"]').forEach(a => {
                const text = a.textContent?.trim();
                const href = a.href;
                
                if (text && text.length > 5 && href) {
                    links.push({ text, href });
                }
            });
            
            return links.slice(0, 20); // 限制 20 個
        });
        
        console.log(`✅ 找到 ${activityLinks.length} 個活動連結`);
        
        // 訪問每個活動頁面
        for (let i = 0; i < Math.min(activityLinks.length, 5); i++) {
            const link = activityLinks[i];
            console.log(`\n📄 [${i + 1}/${Math.min(activityLinks.length, 5)}] ${link.text}`);
            
            try {
                await page.goto(link.href, {
                    waitUntil: 'networkidle',
                    timeout: 30000
                });
                
                const activity = await page.evaluate(() => {
                    const text = document.body.innerText;
                    
                    // 嘗試提取活動信息
                    const title = document.querySelector('h1, h2, [class*="title"]')?.textContent?.trim() || '';
                    
                    // 查找日期
                    const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
                    const date = dateMatch ? dateMatch[0] : '';
                    
                    // 查找地點
                    const locationMatch = text.match(/(中心|會所|大樓|室)\s*\d*[樓]?/);
                    const location = locationMatch ? locationMatch[0] : '';
                    
                    // 查找費用
                    const feeMatch = text.match(/[\$HK\$]\s*[\d,]+/);
                    const fee = feeMatch ? feeMatch[0] : '';
                    
                    // 查找對象 (年齡)
                    const ageMatch = text.match(/(\d[\-\s]?[\d]?\s*歲)/);
                    const age = ageMatch ? ageMatch[0] : '';
                    
                    return {
                        title,
                        date,
                        location,
                        fee,
                        age,
                        url: window.location.href
                    };
                });
                
                if (activity.title && activity.title.length > 5) {
                    allActivities.push(activity);
                    console.log(`  ✅ 提取成功`);
                }
                
            } catch (error) {
                console.log(`  ⚠️ 提取失敗：${error.message}`);
            }
        }
        
        // 保存數據
        const outputFile = '/home/node/.openclaw/workspace/summerhub/crawl-results/bgca-activities.json';
        fs.writeFileSync(outputFile, JSON.stringify(allActivities, null, 2));
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ BGCA 爬取完成！');
        console.log(`📊 總活動數：${allActivities.length}`);
        console.log(`📁 保存位置：${outputFile}`);
        
        // 顯示示例
        console.log('\n=== 示例活動 ===');
        allActivities.slice(0, 5).forEach((a, i) => {
            console.log(`${i + 1}. ${a.title}`);
            console.log(`   日期：${a.date}`);
            console.log(`   地點：${a.location}`);
            console.log(`   費用：${a.fee}`);
            console.log(`   對象：${a.age}`);
            console.log();
        });
        
    } catch (error) {
        console.error('❌ 爬取失敗:', error.message);
    } finally {
        await browser.close();
    }
})();
