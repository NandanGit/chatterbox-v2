const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

const { server } = require('./serverSetup');
const dbOps = require('./db/operations');

// Establishing a socket connection
const io = socketio(server);

io.use((socket, next) => {
	const { authtoken: authToken } = socket.handshake.headers;
	// console.log(authToken);
	jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return;
		socket.username = user.username;
		socket.displayName = user.displayName;
		next();
	});
});

const {
	dmEventHandler,
	gmEventHandler,
	userEventHandler,
	groupEventHandler,
} = require('./socketEventHandlers');

io.on('connection', async (socket) => {
	socket.join(`user:${socket.username}`);
	console.log(`${socket.displayName} connected`);
	// Get all the friends
	const { friends } = await dbOps.Users.getFriendsOf(socket.username);
	if (!friends) {
		return;
	}
	socket.friends = friends.map((friend) => friend.username);
	console.log('His Friends:', socket.friends);
	// Get all the groups
	const { groups } = await dbOps.Users.getGroupsOf(socket.username);
	if (!groups) {
		return;
	}
	socket.groups = groups.map((group) => group.groupName);
	console.log('His Groups:', socket.groups);

	socket.friends.forEach((friend) => {
		socket.join(`user:${friend}`);
	});
	socket.groups.forEach((group) => {
		socket.join(`group:${group}`);
	});

	socket.emit('notification', 'connection established');
	dmEventHandler(io, socket);
	gmEventHandler(io, socket);
	userEventHandler(io, socket);
	groupEventHandler(io, socket);
});
