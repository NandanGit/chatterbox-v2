const { User, Group } = require('../models');

exports.create = async (user) => {
	const newUser = new User(user);
	try {
		const createdUser = await newUser.save();
		return {
			status: 'success',
			createdUser,
		};
	} catch (err) {
		return {
			status: 'error',
			message: err.message,
		};
	}
};

exports.get = async (username) => {
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return {
				status: 'error',
				message: `User not found`,
			};
		}
		return {
			status: 'success',
			user,
		};
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};

exports.search = async (keyword) => {
	const keywordRegex = new RegExp(`${keyword}`, 'i');
	try {
		const matchedUsers = await User.find(
			{
				$or: [
					{ username: { $regex: keywordRegex } },
					{ displayName: { $regex: keywordRegex } },
				],
			},
			{ username: 1, displayName: 1, _id: 0 }
		);
		return {
			status: 'success',
			matchedUsers,
		};
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};

exports.addFriendTo = async (username, friendUsername) => {
	try {
		const user = await User.findOne({ username }, { username: 1 });
		if (!user) {
			return { status: 'error', message: `User ${username} not found` };
		}
		const friend = await User.findOne(
			{ username: friendUsername },
			{ username: 1 }
		);
		if (!friend) {
			return {
				status: 'error',
				message: `User ${friendUsername} not found`,
			};
		}
		const result = await User.updateOne(
			{ username },
			{ $addToSet: { friends: friend._id } }
		);
		return {
			status: 'success',
			message: `${friendName} joined ${username}'s friendlist`,
		};
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};

exports.removeFriendFrom = async (username, friendUsername) => {
	try {
		const user = await User.findOne({ username }, { username: 1 });
		if (!user) {
			return { status: 'error', message: `User ${username} not found` };
		}
		const friend = await User.findOne(
			{ username: friendUsername },
			{ username: 1 }
		);
		if (!friend) {
			return {
				status: 'error',
				message: `User ${friendUsername} not found`,
			};
		}
		const result = await User.updateOne(
			{ username },
			{ $pull: { friends: friend._id } }
		);
		return {
			status: 'success',
			message: `${friendName} left ${username}'s friendlist`,
		};
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};

exports.joinUserTo = async (username, groupName) => {
	try {
		const user = await User.findOne({ username }, { username: 1 });
		if (!user) {
			return {
				status: 'error',
				message: `User ${username} not found`,
			};
		}
		const group = await Group.findOne({ groupName }, { groupName: 1 });
		if (!group) {
			return {
				status: 'error',
				message: `Group ${groupName} not found`,
			};
		}
		await User.updateOne(
			{ username },
			{ $addToSet: { groups: group._id } }
		);
		return {
			status: 'success',
			message: `${username} joined ${groupName}`,
		};
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};

exports.removeUserFrom = async (username, groupName) => {
	try {
		const user = await User.findOne({ username }, { username: 1 });
		if (!user) {
			return { status: 'error', message: `User ${username} not found` };
		}
		const group = await Group.findOne({ groupName }, { groupName: 1 });
		if (!group) {
			return {
				status: 'error',
				message: `Group ${groupName} not found`,
			};
		}
		const result = await User.updateOne(
			{ username },
			{ $pull: { groups: group._id } }
		);
		return {
			status: 'success',
			message: `${username} left ${groupName}`,
		};
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};

exports.getFriendsOf = async (username) => {
	try {
		const user = await User.findOne({ username }, { friends: 1 }).populate({
			path: 'friends',
			select: 'username displayName -_id',
		});
		if (!user) {
			return { status: 'error', message: `User ${username} not found` };
		}
		return { status: 'success', friends: user.friends };
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};

exports.getGroupsOf = async (username) => {
	try {
		const user = await User.findOne({ username }, { groups: 1 }).populate({
			path: 'groups',
			select: 'groupName displayName -_id',
		});
		if (!user) {
			return { status: 'error', message: `User ${username} not found` };
		}
		return { status: 'success', groups: user.groups };
	} catch (err) {
		return { status: 'error', message: err.message };
	}
};

// Optional
exports.updatePasswordOf = async (username, newPassword) => {};

exports.updateUsernameOf = async (username, newUsername) => {};
