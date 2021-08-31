const dbOps = require('../db/operations');

module.exports = (io, socket) => {
	const searchUser = async (payload, callback) => {
		const { keyword } = payload;
		if (!keyword) {
			return callback({
				status: 'error',
				message: 'Keyword not provided',
			});
		}
		const { matchedUsers } = await dbOps.Users.search(keyword);
		console.log(matchedUsers);
		callback({ matchedUsers });
	};

	const getFriends = async (payload, callback) => {
		const { friends, message } = await dbOps.Users.getFriendsOf(
			socket.username
		);
		if (!friends) return callback({ message });
		callback({ friends });
	};

	const getGroups = async (payload, callback) => {
		const { groups, message } = await dbOps.Users.getGroupsOf(
			socket.username
		);
		if (!groups) return callback({ message });
		callback({ groups });
	};

	socket.on('user:search', searchUser);
	socket.on('user:fetch:friends', getFriends);
	socket.on('user:fetch:groups', getGroups);
};
