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
  	var userName;

	console.log("user connected!");

	client.emit('message', 'Server: please insert user name');

    

	client.on('message', function(message){

        if (!userName) {

			userName = message;

			console.log(userName + ' is connected :)');

			client.emit('message', 'Server: Welcome ' + userName);

			client.broadcast.emit('message', userName + ' is connected');

		}

		else {

			client.emit('message', 'Me: ' + message);

			client.broadcast.emit('message', userName + ' says: ' + message);

		}

    });



    client.on('disconnect', function() {

		if (userName) {

			console.log(userName + " left");

			client.broadcast.emit('message', userName + ' left us :(');

		}

		else {

			console.log("anonymous left");

		}

    });
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
