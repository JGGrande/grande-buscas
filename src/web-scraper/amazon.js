import puppeteer from 'puppeteer';
import { sleep } from "../utils/async.js";

export async function AmazonScraper(nomeProduto){
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(`https://www.amazon.com.br`);

    await page.type('#twotabsearchtextbox', nomeProduto);

    await page.keyboard.press('Enter');

    const produto = { }

    const produtoNomeElement = await page.waitForSelector('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-title-instructions-style > h2 > a > span');
    
    produto.nome = await produtoNomeElement.evaluate(element => element.innerText);

    const produtoPrecoElement = await page.$('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > div:nth-child(1) > a > span > span:nth-child(2) > span.a-price-whole');

    produto.preco = await produtoPrecoElement.evaluate(element => Number(element.innerText.replace(",", ".").replace("\n", "")));

    const avaliacaoElement = await page.$('#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.s-wide-grid-style.sg-row > div.sg-col-20-of-24.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span.rush-component.s-latency-cf-section > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > span > div > div > div.a-section.a-spacing-small.puis-padding-left-small.puis-padding-right-small > div:nth-child(2) > div > span:nth-child(1)');

    if(avaliacaoElement){
        produto.avaliacao = await avaliacaoElement.evaluate(element => element.ariaLabel);
    }

    await page.close();
    await browser.close();

    return produto;
}