const { sign } = require('../../utils/createSignature');
const { DirectMessage, User } = require('../models');

exports.create = async (message) => {
	const { from, to, body } = message;
	try {
		const fromUser = await User.findOne(
			{ username: from },
			{ username: 1 }
		);
		if (!fromUser) {
			return { status: 'error', message: `User ${from} not found` };
		}
		const toUser = await User.findOne({ username: to }, { username: 1 });
		if (!toUser) {
			return { status: 'error', message: `User ${to} not found` };
		}
		const signature = sign(fromUser._id, toUser._id);
		const newMessage = new DirectMessage({
			from: fromUser._id,
			to: toUser._id,
			body,
			signature,
		});
		const createdMessage = await newMessage.save();
		return {
			status: 'success',
			createdMessage,
		};
	} catch (err) {
		return {
			status: 'error',
			message: err.message,
		};
	}
};

exports.retrieve = async (username1, username2) => {
	try {
		const user1 = await User.findOne(
			{ username: username1 },
			{ username: 1 }
		);
		if (!user1) {
			return { status: 'error', message: `User ${user1} not found` };
		}
		const user2 = await User.findOne(
			{ username: username2 },
			{ username: 1 }
		);
		if (!user2) {
			return { status: 'error', message: `User ${user2} not found` };
		}
		const signature = sign(user1._id, user2._id);
		let messages = await DirectMessage.find(
			{ signature },
			{ from: 1, to: 1, createdAt: 1, body: 1, _id: 0 }
		)
			.sort({ createdAt: 1 })
			.populate({ path: 'from to', select: 'username displayName -_id' });
		// messages = messages.map((message) => {
		// 	return {
		// 		from: message.from.username,
		// 		to: message.to.username,
		// 		body: message.body,
		// 		createdAt: message.createdAt,
		// 	};
		// });
		return {
			status: 'success',
			messages,
		};
	} catch (err) {
		return {
			status: 'error',
			message: err.message,
		};
	}
};
