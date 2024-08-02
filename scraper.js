const { chromium } = require('playwright');

async function scrapeAmazon(query) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.amazon.com/s?k=${encodeURIComponent(query)}`);
    const results = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.s-main-slot .s-result-item')).map(item => {
            const title = item.querySelector('h2')?.innerText;
            const link = item.querySelector('a')?.href;
            return { title, link: link ? `https://www.amazon.com${link}` : undefined };
        });
    });
    await browser.close();
    return results;
}

async function scrapeBBC(query) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.bbc.com/search?q=${encodeURIComponent(query)}`);
    const results = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.css-1aofmbn')).map(item => {
            const title = item.querySelector('a')?.innerText;
            const link = item.querySelector('a')?.href;
            return { title, link };
        });
    });
    await browser.close();
    return results;
}

module.exports = { scrapeAmazon, scrapeBBC };
