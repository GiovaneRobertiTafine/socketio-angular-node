const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        console.log(msg);
        io.emit('message', msg);

    });

    // Código abaixo para quando quer emitir um evento para um socket especifico
    // diferente do código acima, que é um broadcast.
    let sub = setInterval(() => {
        io.to(socket.id).emit('message', { from: 'server', message: 'Message server!' });
    }, 2000);

    socket.on('disconnect', () => {
        clearInterval(sub);
        console.log(`Socket ${socket.id} has just disconnected.`);
    });

    console.log(`Socket ${socket.id} has connected.`);
});


httpServer.listen(4444, () => {
    console.log('Listening on port 4444');
});