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
		callback({ matchedUsers });
	};

	socket.on('user:search', searchUser);
};
