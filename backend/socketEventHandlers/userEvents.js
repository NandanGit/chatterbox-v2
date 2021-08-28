module.exports = (io, socket) => {
	const createUser = (payload) => {};

	const searchUser = (payload) => {};

	socket.on('user:create', createUser);
	socket.on('user:search', searchUser);
};
