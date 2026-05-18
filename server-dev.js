require('dotenv').config({ path: '.env.local' });

const http = require('http');
const handler = require('./api/chat.js');

const PORT = 3001;

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url !== '/api/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', async () => {
    try {
      req.body = JSON.parse(body || '{}');
    } catch {
      req.body = {};
    }

    res.status = code => {
      res.statusCode = code;
      return res;
    };
    res.json = data => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(data));
    };

    await handler(req, res);
  });
});

server.listen(PORT, () => {
  console.log(`API dev server running on http://localhost:${PORT}`);
  console.log(`GROQ_API_KEY: ${process.env.GROQ_API_KEY ? '✓ loaded' : '✗ missing'}`);
});
