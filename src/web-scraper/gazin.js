import puppeteer from 'puppeteer';
import path from "path";

export async function GazinScraper(produtoNome){
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ["--no-sandbox", "--window-size=1920,1080"]
    });

    const page = await browser.newPage();

    try {
        await page.goto(`https://www.gazin.com.br/busca/${produtoNome}`, { waitUntil: "domcontentloaded" });

        const produto = { }

        const produtoNomeElement = await page.waitForSelector('::-p-xpath(/html/body/div[1]/div[2]/main/div[2]/div/div/div/div/div[2]/div[4]/a[1]/div/div/div[2]/div[1]/span[1])');

        produto.nome = await produtoNomeElement.evaluate(element => element.innerText);

        const produtoPrecoElement = await page.$('::-p-xpath(/html/body/div[1]/div[2]/main/div[2]/div/div/div/div/div[2]/div[4]/a[1]/div/div/div[2]/div[2]/div[1]/div[1]/p)');

        produto.preco = await produtoPrecoElement.evaluate(element => 
            Number(element.innerText.replace("R$", "").replace(",", ".").trim())
        );

        const produtoImage = await page.waitForSelector('::-p-xpath(/html/body/div[1]/div[2]/main/div[2]/div/div/div/div/div[2]/div[4]/a[1]/div/div/div[1]/div[3]/img)');
        produto.imagem = await produtoImage.evaluate(element => element.src);

        produto.avaliacao = null;

        await page.close();
        await browser.close();

        return produto;

    }catch(error){
        console.error(error);

        const { NODE_ENV } = process.env;

        if(NODE_ENV === "dev"){
            const imageName = `gazin-${Date.now()}.png`
            const errorImagePath = path.join("src", "bugs_images", imageName);
    
            await page.screenshot({ path: errorImagePath });
        }

        await page.close();
        await browser.close();

        return null;
    }
}