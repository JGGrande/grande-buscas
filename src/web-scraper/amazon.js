import puppeteer from 'puppeteer';
import path from "path";
import { sleep } from "../utils/async.js";

export async function AmazonScraper(nomeProduto){
    const browser = await puppeteer.launch({
        channel: "chrome",
        headless: "shell",
        defaultViewport: null,
        args: ["--no-sandbox", "--window-size=1920,1080", "--disable-dev-shm-usage"]
    });

    const page = await browser.newPage();

    try {
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

        await page.goto(`https://www.amazon.com.br`, { waitUntil: "domcontentloaded" });
    
        try{
            await page.type('#twotabsearchtextbox', nomeProduto);
        }catch{
            await page.reload();
            await page.type('#twotabsearchtextbox', nomeProduto);
        }
    
        await page.keyboard.press('Enter');
    
        const produto = { }

        await page.waitForSelector('::-p-xpath(//*[@id="search"]/div[1]/div[1]/div/span[1]/div[1])');

        await sleep(4);

        produto.nome = await getProdutoNome(page);
    
        produto.preco = await getProdutoPreco(page);
    
        produto.avaiacao = await getProdutoAvaliacao(page);
    
        produto.imagem = await getProdutoImagem(page);

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


/**
 * @param {puppeteer.Page} page
 * @returns {Promise<string | null>}
 */
async function getProdutoNome(page){
    const elementoPaginaNormal = await page.$('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2 > a > span');

    const elementoPaginaComAnuncio = await page.$('::-p-xpath(//*[@id="search"]/div[1]/div[1]/div/span[1]/div[1]/div[3]/div/div/div/div/span/div/div/div[2]/div[2]/h2/a/span)');
    const elemento = elementoPaginaNormal || elementoPaginaComAnuncio;

    const produtoNome = await elemento.evaluate(element => element.innerText);

    return produtoNome;
}

/**
 * @param {puppeteer.Page} page
 * @returns {Promise<number | null>}
 */
async function getProdutoPreco(page){
    const elementoPaginaNormal = await page.$('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > div:nth-child(1) > a > span > span:nth-child(2) > span.a-price-whole')

    const elementoPaginaComAnuncio = await page.$('::-p-xpath(//*[@id="search"]/div[1]/div[1]/div/span[1]/div[1]/div[3]/div/div/div/div/span/div/div/div[2]/div[4]/div[2]/div[1]/a/span/span[2]/span[2])');
    
    const elemento = elementoPaginaNormal || elementoPaginaComAnuncio;

    const procutoPreco = elemento.evaluate(element => Number(element.innerText.replace(",", ".").replace("\n", "")))

    return procutoPreco;
}

/**
 * @param {puppeteer.Page} page
 * @returns {Promise<string | null>}
 */
async function getProdutoAvaliacao(page){
    const elementoPaginaNormal = await page.$('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div:nth-child(2) > div > span:nth-child(1) > span > a > i.a-icon.a-icon-star-small.a-star-small-5 > span');

    const elementoPaginaComAnuncio = await page.$('::-p-xpath(//*[@id="search"]/div[1]/div[1]/div/span[1]/div[1]/div[3]/div/div/div/div/span/div/div/div[2]/div[3]/div/span[2]/a/span)');

    const elemento = elementoPaginaNormal || elementoPaginaComAnuncio;

    if(elemento){
        const produtoAvalicao = elemento.evaluate(element => element.ariaLabel);

        return produtoAvalicao;
    }

    return null;
}

/**
 * @param {puppeteer.Page} page
 * @returns {Promise<string | null>}
 */
async function getProdutoImagem(page){
    const elementoPaginaNormal = await page.$('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.s-product-image-container.aok-relative.s-text-center.s-image-overlay-grey.puis-image-overlay-grey.s-padding-left-small.s-padding-right-small.puis-spacing-small.s-height-equalized.puis.puis-v2fl5pkubaqu126k6zseo6li6q > span > a > div > img');

    const elementoPaginaComAnuncio = await page.$('::-p-xpath(//*[@id="search"]/div[1]/div[1]/div/span[1]/div[1]/div[3]/div/div/div/div/span/div/div/div[1]/div/span/a/div/img)');

    const elemento = elementoPaginaNormal || elementoPaginaComAnuncio;

    const produtoImagem = elemento.evaluate(element => element.src);

    return produtoImagem;
}

