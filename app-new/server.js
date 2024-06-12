const express = require('express');
const cors = require('cors');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextapp = next({dev});
const handle = nextapp.getRequestHandler();

const db = require('./db');


nextapp.prepare().then(() => {
  const app = express();
  app.use(cors());
  const port = 3000;

  app.use('/db', db);

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  app.listen(port, () => {
    console.log(`Listening on *:${port}`);
  })
})