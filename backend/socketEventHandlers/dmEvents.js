const dbOps = require('../db/operations');

module.exports = (io, socket) => {
	const sendDirectMessage = async (payload, callback) => {
		let { to, body } = payload;
		console.log(`From: ${socket.username} To: ${to}`);
		if (to === socket.username) {
			return callback({
				isSent: false,
				message: 'You cant send yourself a message yet',
			});
		}
		body = body ? body.trim() : '';
		if (!body) {
			return callback({ isSent: false, message: 'Body not provided' });
		}
		// Check if the recipient is in user's friends list
		if (!socket.friends.includes(to)) {
			socket
				.to(`user:${to}`)
				.emit('friend:request', { from: socket.username });
			const { status } = await dbOps.Users.addFriendTo(
				socket.username,
				to
			);
			if (status !== 'success') {
				return callback({
					isSent: false,
					message: 'Recipient does not exist',
				});
			}
			await dbOps.Users.addFriendTo(to, socket.username);
			socket.friends = [...socket.friends, to];
		}
		await dbOps.DM.create({ from: socket.username, to, body });

		// io logic
		io.to(`user:${to}`).emit('direct:message', {
			from: socket.username,
			body,
			to,
		});
		if (!socket.friends.includes(to)) {
			socket.emit('direct:message', {
				from: socket.username,
				body,
				to,
			});
		}
		callback({ isSent: true });
	};

	const fetchMessages = async (payload, callback) => {
		const { friendName } = payload;
		const { messages } = await dbOps.DM.retrieve(
			socket.username,
			friendName
		);
		if (!messages) {
			return callback({
				status: 'error',
				message: 'something went wrong',
			});
		}
		callback({ status: 'success', messages });
	};

	const friendRequest = async (payload, callback) => {
		const { friendName } = payload;
		console.log(`friendRequest to ${friendName}`);

		const { status } = await dbOps.Users.addFriendTo(
			socket.username,
			friendName
		);
		if (status !== 'success') {
			return callback({
				isSent: false,
				message: 'Recipient does not exist',
			});
		}
		await dbOps.Users.addFriendTo(friendName, socket.username);
		socket
			.to(`user:${friendName}`)
			.emit('friend:request', { from: socket.username });
		socket.friends = [...socket.friends, friendName];
		callback({ isSent: true });
	};

	const friendRequestAccept = async (payload, callback) => {
		const { friendName } = payload;
		socket.friends = [...socket.friends, friendName];
		callback({ isSent: true });
	};

	socket.on('direct:message', sendDirectMessage);
	socket.on('direct:fetch:conversation', fetchMessages);
	socket.on('friend:request', friendRequest);
	socket.on('friend:request:accept', friendRequestAccept);
};
