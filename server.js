const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({
    static: path.join(__dirname, 'public')
});

const porta = 3000;

app.use(middlewares);
app.use(express.json());
app.use(router);

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});