'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (client) => {
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

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
