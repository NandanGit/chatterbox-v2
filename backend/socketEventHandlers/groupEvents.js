const dbOps = require('../db/operations');
const { groupValidator } = require('../utils/validators');

module.exports = (io, socket) => {
	const createGroup = async (payload, callback) => {
		const { groupName, displayName } = payload;
		if (!groupName || !displayName) {
			return callback({
				isCreated: false,
				message: 'Both Group Name and Display Name should be provided',
			});
		}
		const error = groupValidator({ groupName, displayName });
		if (error) {
			return callback({ isCreated: false, message: error });
		}
		const { status } = await dbOps.Groups.create({
			groupName,
			displayName,
		});
		if (status !== 'success') {
			return callback({
				isCreated: false,
				message: `A group with name ${groupName} already exists`,
			});
		}
		await dbOps.Groups.add(groupName, socket.username);
		await dbOps.Users.joinUserTo(socket.username, groupName);
		socket.groups = [...socket.groups, groupName];
		socket.join(`group:${groupName}`);

		const { status: gmStatus, message: gmMessage } = await dbOps.GM.create({
			from: socket.username,
			to: groupName,
			isMilestone: true,
			body: `${socket.displayName} created ${displayName}`,
		});

		if (gmStatus !== 'success') {
			console.log(gmMessage);
		}

		// io logic
		io.to(`group:${groupName}`).emit('group:message', {
			from: socket.username,
			to: groupName,
			isMilestone: true,
			body: `${socket.displayName} created ${displayName}`,
		});

		callback({ isCreated: true, message: 'Group Created' });
	};

	const searchGroup = async (payload, callback) => {
		const { keyword } = payload;
		if (!keyword) {
			return callback({
				status: 'error',
				message: 'Keyword not provided',
			});
		}
		const { matchedGroups } = await dbOps.Groups.search(keyword);
		callback({ matchedGroups });
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

		const { status: gmStatus, message: gmMessage } = await dbOps.GM.create({
			from: socket.username,
			to: groupName,
			isMilestone: true,
			body: `${socket.displayName} joined the group`,
		});

		if (gmStatus !== 'success') {
			console.log(gmMessage);
		}

		// io logic
		io.to(`group:${groupName}`).emit('group:message', {
			from: socket.username,
			body: `${socket.displayName} joined the group`,
			to: groupName,
			isMilestone: true,
		});

		return callback({
			isJoined: true,
			message: 'Joined the Group',
		});
	};

	const leaveGroup = async (payload, callback) => {
		const { groupName } = payload;
		const { status } = await dbOps.Users.removeUserFrom(
			socket.username,
			groupName
		);
		if (status !== 'success') {
			return callback({
				isLeft: false,
				message: 'Group does not exist',
			});
		}
		await dbOps.Groups.remove(groupName, socket.username);
		socket.groups = socket.groups.filter((group) => group !== groupName);

		const { status: gmStatus, message: gmMessage } = await dbOps.GM.create({
			from: socket.username,
			to: groupName,
			isMilestone: true,
			body: `${socket.username} left the group`,
		});

		if (gmStatus !== 'success') {
			console.log(gmMessage);
		}

		// io logic
		io.to(`group:${groupName}`).emit('group:message', {
			from: socket.username,
			body: `${socket.username} left the group`,
			to: groupName,
			isMilestone: true,
		});
		socket.leave(`group:${groupName}`);

		return callback({
			isLEft: true,
			message: 'Left the Group',
		});
	};

	socket.on('group:create', createGroup);
	socket.on('group:search', searchGroup);
	socket.on('group:join', joinGroup);
	socket.on('group:leave', leaveGroup);
};
