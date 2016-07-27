var socket_io = require('socket.io');
var http = require('http');
var express = require('express');
var Transform = require('stream').Transform;
var util = require('util');
var split = require("split");

var tailStream = require('tail-stream');
var tail_stream = tailStream.createReadStream('./example.txt', {interval: 100});

var app = express();

app.use(express.static('public'));

app.get('/_status', function (req, res) {
	console.log("hey");
	res.send("ok");
});

var server = http.createServer(app);
io = socket_io(server);

util.inherits(GetDataStream, Transform);

function GetDataStream() {
	Transform.call(this);
}

io.on('connection', function (socket) {
	console.log("connected");
	socket.on('disconnect', function () {
		console.log("disconnected");
	});
	socket.on('message sent', function (data) {
		io.emit('chat1', {message: data.message});
	});
});

GetDataStream.prototype._transform = function(line, encoding, processed) {
	io.emit('chat', {message: line.toString('utf8')});
	processed();
}

tail_stream.pipe(split()).pipe(new GetDataStream());

server.listen('3000');