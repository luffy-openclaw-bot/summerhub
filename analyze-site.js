/**
 * 分析 HKFYG 網站結構
 */

const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    console.log('🔍 分析 HKFYG 網站結構...');
    
    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    await page.goto('https://summer.hkfyg.org.hk/', {
        waitUntil: 'networkidle',
        timeout: 60000
    });
    
    // 獲取頁面 HTML 結構
    const htmlStructure = await page.evaluate(() => {
        const info = {
            url: window.location.href,
            title: document.title,
            
            // 查找所有可能嘅活動卡片
            articles: document.querySelectorAll('article').length,
            posts: document.querySelectorAll('[class*="post"]').length,
            cards: document.querySelectorAll('[class*="card"]').length,
            portfolio: document.querySelectorAll('[class*="portfolio"]').length,
            
            // 查找分頁/載入更多
            pagination: document.querySelectorAll('.pagination, .load-more, [class*="page"]').length,
            nextPage: document.querySelector('a.next, a[href*="/page/"]')?.href || null,
            
            // 查找活動連結
            activityLinks: Array.from(document.querySelectorAll('a[href*="activity"], a[href*="portfolio"]'))
                .slice(0, 10)
                .map(a => ({
                    text: a.textContent?.trim().slice(0, 50),
                    href: a.href
                }))
        };
        
        return info;
    });
    
    console.log('\n=== 網站結構分析 ===');
    console.log(JSON.stringify(htmlStructure, null, 2));
    
    // 保存完整 HTML
    const html = await page.content();
    fs.writeFileSync('/home/node/.openclaw/workspace/summerhub/crawl-results/page-source.html', html);
    console.log('\n✅ 已保存完整 HTML: page-source.html');
    
    // 截圖
    await page.screenshot({
        path: '/home/node/.openclaw/workspace/summerhub/crawl-results/analysis-screenshot.png',
        fullPage: true
    });
    console.log('📸 已保存截圖');
    
    await browser.close();
})();
