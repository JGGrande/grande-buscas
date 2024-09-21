import puppeteer from 'puppeteer';
import path from "path";

export async function MercadoLivreScraper(nomeProduto){
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ["--no-sandbox", "--window-size=1920,1080"]
    });

    const page = await browser.newPage();

    try {
        await page.goto(`https://www.mercadolivre.com.br`, { waitUntil: "networkidle2" });
    
        await page.type('#cb1-edit', nomeProduto);
    
        await page.locator('body > header > div > div.nav-area.nav-top-area.nav-center-area > form > button').click();
    
        const produto = { }
    
        const produtoNomeElement = await page.waitForSelector('::-p-xpath(/html/body/main/div/div[3]/section/ol/li[2]/div/div/div[2]/div[1]/h2/a)');
        
        produto.nome = await produtoNomeElement.evaluate(element => element.innerText);
    
        const produtoPrecoElement = await page.$('::-p-xpath(/html/body/main/div/div[3]/section/ol/li[2]/div/div/div[2]/div[2]/div[1]/div[1]/div/div/div/span[1]/span[2])');
    
        produto.preco = await produtoPrecoElement.evaluate(element => Number(element.innerText));
    
        const avaliacaoElement = await page.$('::-p-xpath(/html/body/main/div/div[3]/section/ol/li[2]/div/div/div[2]/div[2]/div[2]/div/div/span[1])');
    
        if(avaliacaoElement){
            produto.avaliacao = await avaliacaoElement.evaluate(element => element.innerText);
        }

        await page.close();
        await browser.close();
    
        return produto;
    }catch(error){
        console.error(error);

        const { NODE_ENV } = process.env;

        if(NODE_ENV === "dev"){
            const imageName = `mercado-livre-${Date.now()}.png`
            const errorImagePath = path.join("src", "bugs_images", imageName);
    
            await page.screenshot({ path: errorImagePath });
        }

        await page.close();
        await browser.close();

        return null;
    }
}