const socketio = require('socket.io');
const jwt = require('jsonwebtoken');

const { server } = require('./serverSetup');
const dbOps = require('./db/operations');

// Establishing a socket connection
const io = socketio(server);

io.use((socket, next) => {
	const authToken =
		socket.handshake.headers.authtoken || socket.handshake.auth.authtoken;
	// console.log(authToken);
	jwt.verify(
		authToken,
		process.env.ACCESS_TOKEN_SECRET,
		async (err, user) => {
			if (err)
				return next(
					new Error('Invalid Auth Token, Try logging in again')
				);
			const { user: gotUser } = await dbOps.Users.get(user.username);
			// console.log(gotUser);
			if (!gotUser) return next(new Error('User not found'));
			socket.username = user.username;
			socket.displayName = user.displayName;
			next();
		}
	);
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
	console.log(socket.username, "'s Friends:", socket.friends);
	// Get all the groups
	const { groups } = await dbOps.Users.getGroupsOf(socket.username);
	if (!groups) {
		return;
	}
	socket.groups = groups.map((group) => group.groupName);
	console.log(socket.username, "'s Groups:", socket.groups);

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
	socket.on('check:connection', (payload, callback) => {
		callback({ isConnected: true });
	});
});
