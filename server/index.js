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
app.use(bodyParser.json());

module.exports = ({ handleData, json2markdown }) => {
  // TODO: Use random unused port
  const server = app.listen(3000);

  app.post('/', (req, res) => {
    try {
      handleData(req.body);
    } catch (err) {
      console.error(err);
    }
    res.end();
    server.close();
  });

  app.post('/json2markdown', (req, res) => {
    res.send(json2markdown(req.body));
  });
};
