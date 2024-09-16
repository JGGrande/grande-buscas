import { GazinScraper } from "./src/web-scraper/gazin.js";
import { MercadoLivreScraper } from "./src/web-scraper/mercado-livre.js";

const PRODUTO_NOME = "Pneu aro 14";

async function main(){
    const [ gazinProduto, produtoMercadoLivre ] = await Promise.all([
        GazinScraper(PRODUTO_NOME),
        MercadoLivreScraper(PRODUTO_NOME)
    ]);

    console.debug({ gazinProduto });
    console.debug({ produtoMercadoLivre });
}

main();