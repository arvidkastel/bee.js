/// <reference path="../typings/globals/node/index.d.ts" />
/// <reference path="../typings/modules/express/index.d.ts" />

import express = require("express");
let app = express();
import http = require("http");
import fs = require("fs");
app.get('/:script', function(req, res) {
  var contents = fs.readFileSync('./build/client/bundle.js').toString();
  res.send(
    `<html>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.2/require.js"></script>
        <script>${contents}</script></head><body><h1></h1></body></html>`);
});


app.listen(4000);