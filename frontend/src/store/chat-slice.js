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
		changeActiveChat(state, { payload: { type, name } }) {
			state.activeChat = {};
			state.activeChat.type = type;
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
