import http from "http";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "bigfile2.txt");
const COPY_PATH = path.join(process.cwd(), "bigfile_copy.txt");

const server = http.createServer((req, res) => {
  if (req.url === "/stream") {
    // Lê arquivo em chunks usando stream
    const stream = fs.createReadStream(FILE_PATH, { encoding: "utf8" });
    stream.pipe(res);

    stream.on("error", (err) => {
      res.statusCode = 500;
      res.end("Error: " + err.message);
    });
  } else if (req.url === "/copy-block") {
    try {
      const data = fs.readFileSync(FILE_PATH);
      fs.writeFileSync(COPY_PATH, data);
      res.end("File copied BLOCKING. Size: " + data.length + " bytes");
    } catch (err) {
      res.statusCode = 500;
      res.end("Error: " + err.message);
    }
  } else if (req.url === "/ping") {
    // Endpoint rápido para testar o event loop
    res.end("pong");
  } else {
    res.end("ok");
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
