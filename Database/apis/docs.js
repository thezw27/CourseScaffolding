//Responsible for routing the static Docusaurus files

const express = require('express');
const app = express.Router();
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'apidocs', 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'apidocs', 'build', 'index.html'));
}); 

app.get('/docs/user', (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'apidocs', 'build', 'docs', 'user', 'index.html'));
}); 

app.get('/docs/user/id', (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'apidocs', 'build', 'docs', 'user', 'id', 'index.html'));
}); 

app.get('/docs/org', (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'apidocs', 'build', 'docs', 'org', 'index.html'));
}); 

app.get('/docs/org/id', (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'apidocs', 'build', 'docs', 'org', 'id', 'index.html'));
}); 

app.get('/docs/auth', (req, res) => {
  res.sendFile(path.join(__dirname, '../..', 'apidocs', 'build', 'docs', 'auth', 'index.html'));
}); 

module.exports = app;