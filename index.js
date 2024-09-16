import { GazinScraper } from "./src/web-scraper/gazin.js";
import { MercadoLivreScraper } from "./src/web-scraper/mercado-livre.js";
import { AmazonScraper } from "./src/web-scraper/amazon.js";

const PRODUTO_NOME = "Pneu aro 14";

async function main(){
    console.info("Iniciando busca de produtos...");
    const [ gazinProduto, produtoMercadoLivre, amazonProduto ] = await Promise.all([
        GazinScraper(PRODUTO_NOME),
        MercadoLivreScraper(PRODUTO_NOME),
        AmazonScraper(PRODUTO_NOME)
    ]);
    

    console.debug({ gazinProduto });
    console.debug({ produtoMercadoLivre });
    console.debug({ amazonProduto });
}

main();