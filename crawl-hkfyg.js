/**
 * HKFYG 暑期活動爬蟲
 * 使用 Playwright 自動點擊「載入更多」並提取所有活動
 */

const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    console.log('🕷️ 開始爬取 HKFYG 暑期活動...');
    console.log('=' .repeat(50));
    
    // 啟動瀏覽器
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    
    try {
        // 訪問網站
        console.log('📄 訪問網站：https://summer.hkfyg.org.hk/');
        await page.goto('https://summer.hkfyg.org.hk/', {
            waitUntil: 'networkidle',
            timeout: 60000
        });
        
        console.log('✅ 頁面加載完成');
        
        // 截取首頁截圖
        await page.screenshot({ 
            path: '/home/node/.openclaw/workspace/summerhub/crawl-results/01-homepage.png',
            fullPage: true 
        });
        console.log('📸 已保存首頁截圖');
        
        // 提取所有活動
        let allActivities = [];
        let pageNum = 1;
        
        while (true) {
            console.log(`\n📊 第 ${pageNum} 頁...`);
            
            // 提取當前頁面活動
            const activities = await page.evaluate(() => {
                const cards = [];
                
                // 查找活動卡片
                const elements = document.querySelectorAll('article, [class*="post"], [class*="card"]');
                
                elements.forEach(el => {
                    const name = el.querySelector('h2, h3, h4, [class*="title"]')?.textContent?.trim();
                    const category = el.querySelector('[class*="category"], [class*="tag"]')?.textContent?.trim();
                    const description = el.querySelector('p, [class*="desc"]')?.textContent?.trim();
                    const link = el.querySelector('a[href*="activity"], a[href*="portfolio"]')?.href;
                    
                    if (name && name.length > 5) {
                        cards.push({
                            name,
                            category: category || '其他',
                            description: description || '',
                            url: link || ''
                        });
                    }
                });
                
                return cards;
            });
            
            console.log(`  ✅ 提取 ${activities.length} 個活動`);
            allActivities = allActivities.concat(activities);
            
            // 查找下一頁連結
            const nextPageLink = await page.$('a.next, .pagination a:last-child');
            
            if (!nextPageLink || pageNum >= 3) {
                console.log('  ⏹️ 停止爬取 (無更多頁面或達測試上限)');
                break;
            }
            
            // 點擊下一頁
            console.log('  ⏭️ 點擊下一頁...');
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'networkidle', timeout: 30000 }).catch(() => {}),
                nextPageLink.click()
            ]);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // 截圖
            await page.screenshot({ 
                path: `/home/node/.openclaw/workspace/summerhub/crawl-results/0${pageNum + 1}-page${pageNum}.png`
            });
            
            pageNum++;
        }
        
        // 保存數據
        const outputFile = '/home/node/.openclaw/workspace/summerhub/crawl-results/hkfyg-activities-raw.json';
        fs.writeFileSync(outputFile, JSON.stringify(allActivities, null, 2));
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ 爬取完成！');
        console.log(`📊 總活動數：${allActivities.length}`);
        console.log(`📁 保存位置：${outputFile}`);
        
        // 顯示示例
        console.log('\n=== 示例活動 (首 5 個) ===');
        allActivities.slice(0, 5).forEach((a, i) => {
            console.log(`${i + 1}. ${a.name}`);
            console.log(`   類別：${a.category}`);
            console.log(`   URL: ${a.url || 'N/A'}`);
        });
        
    } catch (error) {
        console.error('❌ 爬取失敗:', error.message);
        
        // 保存錯誤截圖
        try {
            await page.screenshot({ 
                path: '/home/node/.openclaw/workspace/summerhub/crawl-results/error.png'
            });
        } catch (e) {}
    } finally {
        await browser.close();
    }
})();
