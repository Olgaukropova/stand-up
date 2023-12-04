import http from "node:http";
import fs from "node:fs/promises"

const data = await fs.readFile('package.json', 'utf-8');
const PORT = 8080;

console.log(data, 'data: ');

http
  .createServer(async (req, res) => {
    if (req.method === "GET" && req.url === '/comedians') {
      try {
        const data = await fs.readFile('comedians.json', 'utf-8');

        res.writeHead(200, {
          "Content-Type": "text/json; charset=utf-8",
          "access-control-allow-origin": "*",
        });
        res.end(data);
      }
      catch (error) {
        res.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8",
        });
        res.end(`Ошибка сервера: ${error}`)
      }
    }

    else {
      res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      res.end('Not found')
    }
  })
  .listen(PORT);

console.log(`сервер запущен на http://localhost:${PORT}`);