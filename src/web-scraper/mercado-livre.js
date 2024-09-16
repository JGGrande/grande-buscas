import puppeteer from 'puppeteer';

export async function MercadoLivreScraper(nomeProduto){
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(`https://www.mercadolivre.com.br`);

    await page.type('#cb1-edit', nomeProduto);

    await page.locator('body > header > div > div.nav-area.nav-top-area.nav-center-area > form > button').click();

    const produto = { }

    const produtoNomeElement = await page.waitForSelector('::-p-xpath(/html/body/main/div/div[3]/section/ol/li[2]/div/div/div[2]/div[1]/a[1]/h2)');
    
    produto.nome = await produtoNomeElement.evaluate(element => element.innerText);

    const produtoPrecoElement = await page.$('::-p-xpath(/html/body/main/div/div[3]/section/ol/li[2]/div/div/div[2]/div[2]/div[1]/div/div/div/div/span[1]/span[2])');

    produto.preco = await produtoPrecoElement.evaluate(element => Number(element.innerText));

    const avaliacaoElement = await page.$('::-p-xpath(/html/body/main/div/div[3]/section/ol/li[2]/div/div/div[2]/div[2]/div[2]/div/div/span[2])');

    produto.avaliacao = await avaliacaoElement.evaluate(element => Number(element.innerText));

    await page.close();
    await browser.close();

    return produto;
}