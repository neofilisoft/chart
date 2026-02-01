const chart = LightweightCharts.createChart(document.getElementById('chart'), {
layout: { background: { color: '#0b0e14' }, textColor: '#d1d4dc' },
grid: { vertLines: { color: '#1f2433' }, horzLines: { color: '#1f2433' } },
timeScale: { timeVisible: true }
});


const series = chart.addLineSeries({ color: '#4cafef', lineWidth: 2 });


let socket;


function connect(symbol) {
if (socket) socket.close();
socket = new WebSocket(`ws://localhost:3000/stream?symbol=${symbol}`);


series.setData([]);


socket.onmessage = e => {
const point = JSON.parse(e.data);
series.update(point);
};
}


fetch('http://localhost:3000/recommend')
.then(r => r.json())
.then(list => {
const box = document.getElementById('recommend');
list.forEach(s => {
const d = document.createElement('div');
d.textContent = `${s.symbol} — ${s.name}`;
d.onclick = () => connect(s.symbol);
box.appendChild(d);
});
connect(list[0].symbol);
});

// search
const input = document.getElementById('search');
input.addEventListener('keydown', e => {
if (e.key === 'Enter') connect(input.value.toUpperCase());
});