import express from 'express';
import yahooFinance from 'yahoo-finance2';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/recommend', (req, res) => {
  res.json([
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'NVDA', name: 'NVIDIA' },
    { symbol: 'KO', name: 'Coca-Cola' },
    { symbol: 'TSLA', name: 'Tesla' }
  ]);
});

const server = app.listen(3000, () => {
  console.log('Server running → http://localhost:3000');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const symbol = new URL(req.url, 'http://localhost')
    .searchParams.get('symbol');

  const timer = setInterval(async () => {
    try {
      const q = await yahooFinance.quote(symbol);
      ws.send(JSON.stringify({
        time: Math.floor(Date.now() / 1000),
        value: q.regularMarketPrice
      }));
    } catch (err) {
      console.error(err.message);
    }
  }, 2000);

  ws.on('close', () => clearInterval(timer));
});
