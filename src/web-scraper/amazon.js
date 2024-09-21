import puppeteer from 'puppeteer';
import path from "path";

export async function AmazonScraper(nomeProduto){
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ["--no-sandbox", "--window-size=1920,1080"]
    });

    const page = await browser.newPage();

    try {
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9'
        });
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

        await page.goto(`https://www.amazon.com.br`, { waitUntil: "networkidle2" });
    
        await page.type('#twotabsearchtextbox', nomeProduto);
    
        await page.keyboard.press('Enter');
    
        const produto = { }
    
        const produtoNomeElement = await page.waitForSelector('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2 > a > span');
        
        produto.nome = await produtoNomeElement.evaluate(element => element.innerText);
    
        const produtoPrecoElement = await page.$('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > div:nth-child(1) > a > span > span:nth-child(2) > span.a-price-whole');
    
        produto.preco = await produtoPrecoElement.evaluate(element => Number(element.innerText.replace(",", ".").replace("\n", "")));
    
        const avaliacaoElement = await page.$('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div:nth-child(2) > div > span:nth-child(1) > span > a > i.a-icon.a-icon-star-small.a-star-small-5 > span');
    
        if(avaliacaoElement){
            produto.avaliacao = await avaliacaoElement.evaluate(element => element.ariaLabel);
        }else {
            produto.avaliacao = null;
        }
    
        await page.close();
        await browser.close();
    
        return produto;
    } catch(error) {
        console.error(error);
     
        const { NODE_ENV } = process.env;

        if(NODE_ENV === "dev"){
            const imageName = `amazon-${Date.now()}.png`
            const errorImagePath = path.join("src", "bugs_images", imageName);
    
            await page.screenshot({ path: errorImagePath });
        }

        await page.close();
        await browser.close();

        return null;
    }
}