import http from "node:http";
import fs from "node:fs/promises"

const data = await fs.readFile('package.json', 'utf-8');
const PORT = 8080;
const COMEDIANS = './comedians.json';
const CLIENTS = './clients.json';

const checkFiles = async () => {
  try {
    await fs.access(COMEDIANS)
  } catch (error) {
    console.error(`Файл ${COMEDIANS} не найден!`)
    return false
  }

  try {
    await fs.access(CLIENTS)
  } catch (error) {
    await fs.writeFile(CLIENTS, JSON.stringify([]));
    console.error(`Файл ${CLIENTS} был создан!`)
    return false
  }

  return true;
}

const startServer = async () => {
  if (!(await checkFiles())) {
    return;
  }
  http
    .createServer(async (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*")
      const reqUrl = new URL(req.url, `http://${req.headers.host}`);
      const pathName = reqUrl.pathname;
      const segments = req.url.split('/').filter(Boolean);
      console.log("segments: ", segments)

      if (req.method === "GET" && segments[0] === "comedians") {
        try {
          const data = await fs.readFile(COMEDIANS, 'utf-8');

          res.writeHead(200, {
            "Content-Type": "text/json; charset=utf-8",
            "access-control-allow-origin": "*",
          });

          if (segments.length === 2){
            const comedian = JSON.parse(data).find(c => c.id === segments[1])
            if(!comedian){
              res.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8",
              });
              res.end("Stand up  комик не найден");
              return;
            }
            res.end(JSON.stringify(comedian))
          }


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
}

startServer();
