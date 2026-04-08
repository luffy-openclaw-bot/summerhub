/**
 * HKFYG 暑期活動爬蟲 v2
 * 使用正確嘅選擇器提取活動
 */

const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    console.log('🕷️ 開始爬取 HKFYG 暑期活動 (v2)...');
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
        let pageNum = 1;
        const maxPages = 3; // 測試爬取 3 頁
        
        while (pageNum <= maxPages) {
            const url = pageNum === 1 
                ? 'https://summer.hkfyg.org.hk/' 
                : `https://summer.hkfyg.org.hk/page/${pageNum}/`;
            
            console.log(`\n📄 第 ${pageNum} 頁：${url}`);
            
            await page.goto(url, {
                waitUntil: 'networkidle',
                timeout: 60000
            });
            
            // 提取活動
            const activities = await page.evaluate(() => {
                const cards = [];
                
                // 使用 portfolio 選擇器
                const elements = document.querySelectorAll('[class*="portfolio"], [class*="post"]');
                
                elements.forEach(el => {
                    // 跳過導航/分類連結
                    if (el.querySelector('[class*="filter"], [class*="menu"]')) return;
                    
                    const titleEl = el.querySelector('h2, h3, h4, [class*="title"]');
                    const name = titleEl?.textContent?.trim();
                    
                    // 過濾無效數據
                    if (!name || name.length < 5 || name.includes('閱讀更多')) return;
                    
                    const categoryEl = el.querySelector('[class*="category"], .portfolio-type, .post-category');
                    const category = categoryEl?.textContent?.trim() || '其他';
                    
                    const linkEl = el.querySelector('a[href*="portfolio"], a[href*="activity"]');
                    const url = linkEl?.href || '';
                    
                    const imgEl = el.querySelector('img');
                    const image = imgEl?.src || '';
                    
                    cards.push({
                        name,
                        category,
                        url,
                        image
                    });
                });
                
                return cards;
            });
            
            console.log(`  ✅ 提取 ${activities.length} 個活動`);
            
            if (activities.length > 0) {
                allActivities = allActivities.concat(activities);
            }
            
            // 檢查下一頁
            const nextPage = await page.$('a.next, .pagination a[href*="/page/"]:last-child');
            
            if (!nextPage) {
                console.log('  ⏹️ 無更多頁面');
                break;
            }
            
            pageNum++;
        }
        
        // 保存數據
        const outputFile = '/home/node/.openclaw/workspace/summerhub/crawl-results/hkfyg-activities.json';
        fs.writeFileSync(outputFile, JSON.stringify(allActivities, null, 2));
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ 爬取完成！');
        console.log(`📊 總活動數：${allActivities.length}`);
        
        // 分類統計
        const categoryCount = {};
        allActivities.forEach(a => {
            categoryCount[a.category] = (categoryCount[a.category] || 0) + 1;
        });
        
        console.log('\n=== 分類統計 ===');
        Object.entries(categoryCount).forEach(([cat, count]) => {
            console.log(`  ${cat}: ${count}`);
        });
        
        // 顯示示例
        console.log('\n=== 示例活動 (首 10 個) ===');
        allActivities.slice(0, 10).forEach((a, i) => {
            console.log(`${i + 1}. ${a.name}`);
            console.log(`   類別：${a.category}`);
            console.log(`   URL: ${a.url}`);
        });
        
        // 截圖
        await page.screenshot({
            path: '/home/node/.openclaw/workspace/summerhub/crawl-results/final-screenshot.png'
        });
        
    } catch (error) {
        console.error('❌ 爬取失敗:', error.message);
    } finally {
        await browser.close();
    }
})();
