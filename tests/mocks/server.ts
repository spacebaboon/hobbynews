import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = 4000;
const xml = readFileSync(join(__dirname, 'feed.xml'), 'utf-8');

const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.writeHead(200);
  res.end(xml);
});

server.listen(port, () => {
  console.log(`Mock RSS server running at http://localhost:${port}`);
});
