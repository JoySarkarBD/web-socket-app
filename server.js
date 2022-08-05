// dependencies
const express = require('express');
const http = require('http');
const ws = require('ws');

// initializing app
const app = express();
const expressHttpServer = http.createServer(app);

// users data
const sockets = [];

// websocket server
const wss = new ws.Server({server: expressHttpServer})
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
});

// connecting new user and getting message data
wss.on('connection', (socket) => {
    sockets.push(socket);
    console.log('new user connected');

    socket.on("message", data => {
        const msg = data.toString()
        // socket.send("Hello From Server.");
        sockets.forEach(clients => {
            if (clients !== socket) {
                clients.send(msg);
            };
        });
    });
    socket.on('close',()=>{
        console.log("user disconnect");
    });
});

// listening server
expressHttpServer.listen(process.env.PORT || 3030, () => {
    console.log(`server is running ${process.env.PORT || 3030}`);
});