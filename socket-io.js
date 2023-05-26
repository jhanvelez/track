const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
console.log(io);
io.on('connect', client => {
    console.log(client);
    client.on('data', data => { console.log(data); });
    client.on('disconnect', () => { console.log("disconnected"); });
});
server.listen(4122);