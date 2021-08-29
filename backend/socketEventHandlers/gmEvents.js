const dbOps = require('../db/operations');

module.exports = (io, socket) => {
	const sendGroupMessage = async (payload, callback) => {
		let { to, body } = payload;
		body = body ? body.trim() : '';
		if (!body) {
			return callback({ isSent: false, message: 'Body not provided' });
		}
		// Check if the group is in user's group list
		if (!socket.groups.includes(to)) {
			console.log(to);
			const { status, message } = await dbOps.Users.joinUserTo(
				socket.username,
				to
			);
			if (status !== 'success') {
				return callback({
					isSent: false,
					message: message,
				});
			}
			await dbOps.Groups.add(to, socket.username);
			socket.groups = [...socket.groups, to];
			socket.join(`group:${to}`);
		}
		await dbOps.GM.create({ from: socket.username, to, body });

		// io logic
		socket
			.to(`group:${to}`)
			.emit('group:message', { from: socket.username, body, to });

		callback({ isSent: true });
	};

	const fetchMessages = async (payload, callback) => {
		const { groupName } = payload;
		const { displayName, messages } = await dbOps.GM.retrieve(groupName);
		if (!messages) {
			return callback({
				status: 'error',
				message: 'something went wrong',
			});
		}
		callback({ status: 'success', groupName, displayName, messages });
	};

	socket.on('group:message', sendGroupMessage);
	socket.on('group:fetch:conversation', fetchMessages);
};
