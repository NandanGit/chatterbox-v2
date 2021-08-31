const getAllMessages = async (socket) => {
	const dbOps = require('../../db/operations/');
	const allMessages = {
		directMessages: {},
		groupMessages: {},
		username: socket.username,
		displayName: socket.displayName,
	};
	// Messages of all friends
	for (friend of socket.friends) {
		const { messages } = await dbOps.DM.retrieve(socket.username, friend);
		if (!messages) {
			continue;
		}
		allMessages.directMessages[friend] = messages;
	}
	// Messages of all groups
	for (group of socket.groups) {
		const { messages } = await dbOps.GM.retrieve(group);
		if (!messages) {
			continue;
		}
		allMessages.groupMessages[group] = messages;
	}
	return allMessages;
};

module.exports = getAllMessages;
