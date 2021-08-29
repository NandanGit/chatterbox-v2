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

	const joinGroup = async (payload, callback) => {
		const { groupName } = payload;
		const { status } = await dbOps.Users.joinUserTo(
			socket.username,
			groupName
		);
		if (status !== 'success') {
			return callback({
				isJoined: false,
				message: 'Group does not exist',
			});
		}
		await dbOps.Groups.add(groupName, socket.username);
		socket.groups = [...socket.groups, groupName];
		socket.join(`group:${groupName}`);
		return callback({
			isJoined: true,
			message: 'Joined the Group',
		});
	};

	socket.on('group:message', sendGroupMessage);
	socket.on('group:join', joinGroup);
};
