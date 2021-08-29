const { GroupMessage, Group, User } = require('../models');

exports.create = async (message) => {
	const { from, to, body } = message;
	try {
		const fromUser = await User.findOne(
			{ username: from },
			{ username: 1 }
		);
		if (!fromUser && from != 'admin') {
			return { status: 'error', message: `User ${from} not found` };
		}
		const toGroup = await Group.findOne(
			{ groupName: to },
			{ groupName: 1 }
		);
		if (!toGroup) {
			return { status: 'error', message: `Group ${to} not found` };
		}
		const newMessage = new GroupMessage({
			from: fromUser ? fromUser._id : from,
			to: toGroup._id,
			body,
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

exports.retrieve = async (groupName) => {
	try {
		const group = await Group.findOne({ groupName }, { groupName: 1 });
		if (!group) {
			return { status: 'error', message: `Group ${group} not found` };
		}
		let messages = await GroupMessage.find(
			{ to: group._id },
			{ from: 1, createdAt: 1, body: 1, _id: 0 }
		)
			.sort({ createdAt: 1 })
			.populate({ path: 'from', select: 'username displayName -_id' });
		return {
			status: 'success',
			groupName,
			displayName: group.displayName,
			messages,
		};
	} catch (err) {
		return {
			status: 'error',
			message: err.message,
		};
	}
};
