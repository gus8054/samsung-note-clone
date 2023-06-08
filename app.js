const http = require("node:http");
const { URL } = require("node:url");
const fs = require("node:fs");
const path = require("node:path");
const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(
    req.url,
    `http://localhost:${PORT}`
  );
  if (pathname === "/") {
    try {
      const data = fs.readFileSync(
        path.join(__dirname, "static", "index.html")
      );
      return res.end(data);
    } catch (err) {
      return res.end(JSON.stringify(err));
    }
  } else if (pathname === "/create") {
    try {
      const data = fs.readFileSync(
        path.join(__dirname, "static", "create.html")
      );
      return res.end(data);
    } catch (err) {
      return res.end(JSON.stringify(err));
    }
  } else if (pathname === "/view") {
    try {
      const data = fs.readFileSync(path.join(__dirname, "static", "view.html"));
      return res.end(data);
    } catch (err) {
      return res.end(JSON.stringify(err));
    }
  } else if (pathname === "/edit") {
    try {
      const data = fs.readFileSync(path.join(__dirname, "static", "edit.html"));
      return res.end(data);
    } catch (err) {
      return res.end(JSON.stringify(err));
    }
  }
  try {
    const data = fs.readFileSync(path.join(__dirname, `static${pathname}`));
    return res.end(data);
  } catch (err) {
    return res.writeHead(404).end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
