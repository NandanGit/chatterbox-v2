module.exports = (io, socket) => {
	const sendDirectMessage = (payload, callback) => {
		callback({ message: 'you wanna send a direct message?' });
	};

	socket.on('direct:message', sendDirectMessage);
};
