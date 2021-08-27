const { Schema, model } = require('mongoose');

const groupMessageSchema = new Schema(
	{
		from: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Origin is required'],
		},
		to: {
			type: Schema.Types.ObjectId,
			ref: 'Group',
			required: [true, 'Destination is required'],
		},
		body: {
			type: String,
			required: [true, 'Message body cannot be empty'],
		},
	},
	{ timestamps: true }
);

const GroupMessage = model('GroupMessage', groupMessageSchema);
module.exports = GroupMessage;
