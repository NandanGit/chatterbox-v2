import { createSlice } from '@reduxjs/toolkit';

const initialChatSlice = {
	activeUser: undefined,
	activeChat: undefined,
	directMessages: {
		// key          : value
		// username     : messages
	},
	groupMessages: {
		// key          : value
		// groupName    : messages
	},
};

const chatSlice = createSlice({
	name: 'chat',
	initialState: initialChatSlice,
	reducers: {
		addDirectMessage(state, { payload: { username, message } }) {
			state.directMessages[username].push(message);
		},
		addGroupMessage(state, { payload: { groupName, message } }) {
			state.groupMessages[groupName].push(message);
		},
		updateDirectMessages(state, { payload: { username, messages } }) {
			messages = messages.map((message) => ({
				body: message.body,
				createdAt: message.createdAt,
				type: message.from.username === username ? 'received' : 'sent',
			}));
			state.directMessages[username] = messages;
		},
		updateGroupMessages(
			state,
			{ payload: { groupName, messages, currentUsername } }
		) {
			messages = messages.map((message) => ({
				body: message.body,
				createdAt: message.createdAt,
				sender:
					message.from.username !== currentUsername
						? message.from.username
						: undefined,
				isMilestone: message.isMilestone,
				type:
					message.from.username !== currentUsername
						? 'received'
						: 'sent',
			}));
			state.groupMessages[groupName] = messages;
		},
		changeActiveChat(state, { payload: { type, name, displayName } }) {
			state.activeChat = {};
			state.activeChat.type = type;
			state.activeChat.displayName = displayName;
			let messages;
			if (type === 'user') {
				state.activeChat.username = name;
				messages = state.directMessages[name];
				if (!messages) {
					state.directMessages[name] = [];
					messages = [];
				}
			} else {
				state.activeChat.groupName = name;
				messages = state.groupMessages[name];
				if (!messages) {
					state.groupMessages[name] = [];
					messages = [];
				}
			}
			state.activeChat.messages = messages;
		},
	},
});

export const chatActions = chatSlice.actions;

export default chatSlice;
