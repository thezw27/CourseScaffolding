const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const DB_PASS = process.env.DB_PASS;
const app = express();
const port = 3000;

const db = require('./apis/db');
/*
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
}); 
*/

app.use('/db', db);

app.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
