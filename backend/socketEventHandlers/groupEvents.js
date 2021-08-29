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
			callback({ isCreated: false, message: error });
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

		await dbOps.GM.create({
			from: 'admin',
			to: groupName,
			body: `${socket.username} created ${groupName}`,
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

	socket.on('group:create', createGroup);
	socket.on('group:search', searchGroup);
};
