import http from "http";
import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "bigfile.txt");
const COPY_PATH = path.join(process.cwd(), "bigfile_copy.txt");

const server = http.createServer((req, res) => {
  if (req.url === "/copy-stream") {
    // Lê o arquivo por partes usando streams, sem bloquear o event loop
    const readStream = fs.createReadStream(FILE_PATH);
    const writeStream = fs.createWriteStream(COPY_PATH);

    readStream.pipe(writeStream);

    writeStream.on("finish", () => {
      res.end("File copied STREAMING");
    });

    readStream.on("error", (err) => {
      res.statusCode = 500;
      res.end("Error: " + err.message);
    });

    writeStream.on("error", (err) => {
      res.statusCode = 500;
      res.end("Error: " + err.message);
    });
  } else if (req.url === "/copy-sync") {
    try {
      // Lê o arquivo de forma síncrona bloqueante
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
