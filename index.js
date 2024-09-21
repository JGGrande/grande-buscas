import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { GazinScraper } from './src/web-scraper/gazin.js';
import { MercadoLivreScraper } from './src/web-scraper/mercado-livre.js';
import { AmazonScraper } from './src/web-scraper/amazon.js';
import { engine } from 'express-handlebars';

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

app.engine('handlebars', engine({
    layoutsDir: './src/views',
    defaultLayout: 'home'
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.get('/', (req, res) => {
    res.render('home');
});


wss.on('connection', (ws) => {
    console.log('Cliente conectado');

    ws.on('message', async (message) => {
        const produtoNome = message.toString();
        console.info(`Buscando produto: ${produtoNome}`);

        const scrapers = [
            { name: 'Mercado livre', scraper: MercadoLivreScraper },
            { name: 'Amazon', scraper: AmazonScraper },
            { name: 'Gazin', scraper: GazinScraper },
        ];

        scrapers.forEach(async ({ name, scraper }) => {
            const resultado = await scraper(produtoNome);
            ws.send(JSON.stringify({ source: name, data: resultado }));
        });
    });
});

const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});