module.exports = (io, socket) => {
	const createGroup = (payload) => {};

	const searchGroup = (payload) => {};

	socket.on('group:create', createGroup);
	socket.on('group:search', searchGroup);
};
