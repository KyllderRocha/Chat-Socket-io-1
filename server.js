'use strict';
const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require("socket.io")(server);
const porta = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "public"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (req, res, next) => {
    res.render('index.html');
});

app.get('/favicon.ico', (req, res, next) => {
    next();
});

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    socket.emit('previousMessages',messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

app.listen(porta, () => {
    console.log('Servidor rodando na porta '+ porta);
});