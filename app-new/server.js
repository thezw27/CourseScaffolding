const express = require('express');
const https = require('https');
const cors = require('cors');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextapp = next({dev});
const handle = nextapp.getRequestHandler();

const db = require('./db');

const corsOptions = {
  origin: 'http://67.242.77.142:8000',
  optionsSuccessStatus: 200
};

nextapp.prepare().then(() => {
  const app = express();
  app.use(cors(corsOptions));
  const port = 3000;

  app.use('/db', db);

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  app.listen(port, () => {
    console.log(`Listening on *:${port}`);
  })
})