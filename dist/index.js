"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bun_1 = require("bun");
var port = 3000;
var server = (0, bun_1.serve)({
  port: port,
  fetch: function (req)
  {
    return new Response("Hello, Bun!");
  },
});
console.log("Server is running on http://localhost:".concat(port));
