const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require('./modules/replaceTemplate');

// FILES

// fs.stat('./templates/overview.html', (err, stat) => {
//     if(err) {
//         console.log(err);
//         return;
//     }
//     stat.size
// })

// console.log('before reading file');
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         fs.writeFile(`./txt/append.txt`, `${data1}\n${data2}`, 'utf-8', (err) => {
//             err && console.log(err);
//         })
//     })
// })
// console.log('after reading file');

// SERVER
/*
---------creating a server is two step process-----------
1) create a server
2) start that server to listen on any port
*/

// this code will run for very first time, as code getting parsed initially
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  //   Overview
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace(/{%CART-TEMPLATE%}/g, cardHtml);

    res.end(output);

    //    Product
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    console.log(product);
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //    Api
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page Not Found</h1>");
  }
});

server.listen("8000", "127.0.0.1", () => {
  console.log("Server is running at port 8000");
});
