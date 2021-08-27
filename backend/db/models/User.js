const { Schema, model } = require('mongoose');

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: true,
		},
		displayName: {
			type: String,
			required: [true, 'Display Name is required'],
		},
		password: {
			type: String, // Hashed
			required: [true, 'Password is required'],
		},
		friends: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		groups: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Group',
			},
		],
	},
	{ timestamps: true }
);

userSchema.virtual('friendCount').get(function () {
	return this.friends.length;
});

userSchema.virtual('groupCount').get(function () {
	return this.groups.length;
});

const User = model('User', userSchema);
module.exports = User;
