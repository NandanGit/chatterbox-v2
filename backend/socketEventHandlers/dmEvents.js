const dbOps = require('../db/operations');

module.exports = (io, socket) => {
	const sendDirectMessage = async (payload, callback) => {
		let { to, body } = payload;
		body = body ? body.trim() : '';
		if (!body) {
			return callback({ isSent: false, message: 'Body not provided' });
		}
		// Check if the recipient is in user's friends list
		if (!socket.friends.includes(to)) {
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
		callback({ isSent: true });

		// io logic
		socket
			.to(`user:${to}`)
			.emit('direct:message', { from: socket.username, body });
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

	socket.on('direct:message', sendDirectMessage);
	socket.on('direct:fetch:conversation', fetchMessages);
};
