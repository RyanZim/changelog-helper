'use strict';
const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const bodyParser = require('body-parser');

const app = express();

app.use(
  serveStatic(path.join(__dirname, '../app/'), {
    cacheControl: false,
    lastModified: false,
  })
);
app.use(bodyParser.text());

let sendData;

app.post('/', (req, res) => {
  sendData(req.body);
  res.end();
});

module.exports = (handleData = () => {}) => {
  // TODO: Use random unused port
  const server = app.listen(3000);

  sendData = (data) => {
    server.close();
    try {
      handleData(data);
    } catch (err) {
      console.error(err);
    }
  };
};
