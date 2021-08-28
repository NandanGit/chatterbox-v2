const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

const { server } = require('./serverSetup');

// Establishing a socket connection
const io = socketio(server);

io.use((socket, next) => {
	const { authtoken: authToken } = socket.handshake.headers;
	// console.log(authToken);
	jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return;
		console.log(user);
		next();
	});
});

const {
	dmEventHandler,
	gmEventHandler,
	userEventHandler,
	groupEventHandler,
} = require('./socketEventHandlers');

io.on('connection', (socket) => {
	console.log('Connected');
	socket.emit('notification', 'connection established');
	dmEventHandler(io, socket);
	gmEventHandler(io, socket);
	userEventHandler(io, socket);
	groupEventHandler(io, socket);
});
