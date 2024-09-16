import puppeteer from 'puppeteer';

export async function GazinScraper(produtoNome){
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(`https://www.gazin.com.br/busca/${produtoNome}`);

    await new Promise(resolve => setTimeout(resolve, 30000));

    const produto = { }

    const produtoNomeElement = await page.waitForSelector('::-p-xpath(/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div[3]/a[1]/div/div/div[2]/div[1]/span[1])');

    produto.nome = await produtoNomeElement.evaluate(element => element.innerText);

    const produtoPrecoElement = await page.$('::-p-xpath(/html/body/div[1]/div[2]/main/div[2]/div/div/div[2]/div[3]/a[1]/div/div/div[2]/div[2]/div[2]/div/span/span)');

    produto.preco = await produtoPrecoElement.evaluate(element => 
        Number(element.innerText.replace("R$", "").replace(",", ".").trim())
    );

    produto.avaliacao = null;

    await page.close();
    await browser.close();

    return produto;
}