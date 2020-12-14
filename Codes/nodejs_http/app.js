require("dotenv/config");
const fs = require("fs");
const path = require("path");
const mime = require("mime");

const http = require("http");
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    /* Hiển thị index */
    const absPath = path.join(__dirname, "public", "index.html");
    res.writeHead(200, {
      "Content-Type": mime.getType(absPath),
    });
    const file = fs.readFileSync(absPath);
    res.end(file);
  } else {
    /* Load static */
    const paths = req.url.split("/");
    let absPath = path.join(__dirname, "public");
    paths.forEach((p) => {
      absPath = path.join(absPath, p);
    });

    try {
      res.writeHead(200, {
        "Content-Type": mime.getType(absPath),
      });
      res.end(fs.readFileSync(absPath));
    } catch (err) {
      res.writeHead(404);
    }
  }
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
