'use strict';

var express = require('express');
var socketIO = require('socket.io');
var path = require('path');

var PORT = process.env.PORT || 3000;
var INDEX = path.join(__dirname, 'index.html');

var server = express().use(function(req, res){res.sendFile(INDEX)})
  .listen(PORT, function(){console.log('Listening on '+PORT+", waiting for connections. For example, Enter : http://127.0.0.1:"+PORT+" on client, for connection to me")});

var io = socketIO(server);

io.on('connection', function(client){
  	var userName, msg;

	console.log("user connected!");

	client.emit('message', 'Server: please insert user name');

    

	client.on('message', function(message){

        if (!userName) {

			userName = message;

			console.log(userName + ' is connected :)');

			msg = {by : "Server", contain : 'Welcome ' + userName};
			client.emit('message', msg);

			msg = {by : "Server", contain : userName + ' is connected'};
			client.broadcast.emit('message', msg);

		}

		else {
			msg = {by : "Me", contain : message};
			client.emit('message', msg);

			msg = {by : "Server", contain : userName + ' says : ' + message};
			client.broadcast.emit('message', msg);

		}

    });



    client.on('disconnect', function() {

		if (userName) {

			console.log(userName + " left");

			msg = {by : "Server", contain : userName + ' left us :('};
			client.broadcast.emit('message', msg);

		}

		else {

			console.log("anonymous left");

		}

    });
});

setInterval(function(){io.emit('time', new Date().toTimeString())}, 1000);
