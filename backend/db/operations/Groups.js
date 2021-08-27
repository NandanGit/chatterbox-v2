const { Group, User } = require('../models');

exports.create = async (group) => {
	const newGroup = new Group(group);
	try {
		const createdGroup = await newGroup.save();
		return {
			status: 'success',
			createdGroup,
		};
	} catch (err) {
		return {
			status: 'error',
			message: err.message,
		};
	}
};

exports.search = async (keyword) => {
	if (!keyword) {
		return { status: 'success', matchedGroups: [] };
	}
	const keywordRegex = new RegExp(keyword, 'i');
	try {
		const matchedGroups = await Group.find(
			{
				$or: [
					{ groupName: { $regex: keywordRegex } },
					{ displayName: { $regex: keywordRegex } },
				],
			},
			{ groupName: 1, displayName: 1, _id: 0 }
		);
		return { status: 'success', matchedGroups };
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};

exports.add = async (groupName, username) => {
	try {
		const group = await Group.findOne({ groupName }, { groupName: 1 });
		if (!group) {
			return {
				status: 'error',
				message: `Group ${groupName} not found`,
			};
		}
		const user = await User.findOne({ username }, { username: 1 });
		if (!user) {
			return {
				status: 'error',
				message: `User ${username} not found`,
			};
		}
		await Group.updateOne(
			{ groupName },
			{ $addToSet: { members: user._id } }
		);
		return {
			status: 'success',
			message: `${username} joined ${groupName}`,
		};
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};

exports.remove = async (groupName, username) => {
	try {
		const group = await Group.findOne({ groupName }, { groupName: 1 });
		if (!group) {
			return {
				status: 'error',
				message: `Group ${groupName} not found`,
			};
		}
		const user = await User.findOne({ username }, { username: 1 });
		if (!user) {
			return {
				status: 'error',
				message: `User ${username} not found`,
			};
		}
		await Group.updateOne({ groupName }, { $pull: { members: user._id } });
		return {
			status: 'success',
			message: `${username} left ${groupName}`,
		};
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};

exports.getUsers = async (groupName) => {
	try {
		const group = await Group.findOne(
			{ groupName },
			{ members: 1 }
		).populate({
			path: 'members',
			select: 'username displayName -_id',
		});
		return {
			status: 'success',
			members: group.members,
		};
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};
