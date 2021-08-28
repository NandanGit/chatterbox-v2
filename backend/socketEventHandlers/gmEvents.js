module.exports = (io, socket) => {
	const sendGroupMessage = (payload) => {};

	socket.on('group:message', sendGroupMessage);
};
