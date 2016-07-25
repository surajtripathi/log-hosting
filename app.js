var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();

app.use(express.static('public'));

app.get('/_status', function (req, res) {
	console.log("hey");
	res.send("ok");
});

var server = http.createServer(app);
io = socket_io(server);

io.on('connection', function (socket) {
	console.log("connected");
	socket.on('disconnect', function () {
		console.log("disconnected");
	});
	socket.on('message sent', function (data) {
		console.log("message recieved", data.message);
		io.emit('chat', {message: data.message});
	});

});


server.listen('3000');