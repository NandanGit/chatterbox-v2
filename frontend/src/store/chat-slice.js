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

try {
	initialChatSlice.user = JSON.parse(localStorage.getItem('user')).user;
} catch (err) {}

const chatSlice = createSlice({
	name: 'chat',
	initialState: initialChatSlice,
	reducers: {
		addDirectMessage(state, { payload: { from, body, to } }) {
			const message = {
				type: from === state.user.username ? 'sent' : 'received',
				body,
				createdAt: new Date().toDateString(),
			};
			const friend = from === state.user.username ? to : from;
			state.directMessages[friend].push(message);
			if (
				state.activeChat &&
				(friend === state.activeChat.username ||
					friend === state.activeChat.groupName)
			) {
				state.activeChat.messages.push(message);
			}
		},
		addGroupMessage(state, { payload: { from, body, to, isMilestone } }) {
			const message = {
				type: from === state.user.username ? 'sent' : 'received',
				// sender: from,
				sender: from !== state.user.username && from,
				body,
				isMilestone,
				createdAt: new Date().toDateString(),
			};
			state.groupMessages[to].push(message);
			if (
				state.activeChat &&
				(to === state.activeChat.username ||
					to === state.activeChat.groupName)
			) {
				state.activeChat.messages.push(message);
			}
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
		setUser(state, { payload: { username, displayName } }) {
			state.user = {
				username,
				displayName,
			};
		},
		changeActiveChat(state, { payload: { type, name, displayName } }) {
			state.activeChat = {};
			state.activeChat.type = type;
			state.activeChat.displayName =
				displayName || state.activeChat.displayName;
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
		updateActiveChat(state, { payload: { type, name } }) {
			let messages;
			if (type === 'user') {
				messages = state.directMessages[name];
			} else {
				messages = state.groupMessages[name];
			}
			state.activeChat.messages = messages;
		},
		updateAllMessages(state, { payload: { allMessages } }) {
			// console.log('updateAllMessages: ', allMessages);
			// Direct messages
			const directMessages = allMessages.directMessages;
			for (const friendName in directMessages) {
				const messages = directMessages[friendName].map((message) => ({
					body: message.body,
					createdAt: message.createdAt,
					type:
						message.from.username !== allMessages.username
							? 'received'
							: 'sent',
				}));
				state.directMessages[friendName] = messages;
			}

			// Group Messages
			const groupMessages = allMessages.groupMessages;
			for (const groupName in groupMessages) {
				const messages = groupMessages[groupName].map((message) => ({
					body: message.body,
					createdAt: message.createdAt,
					sender:
						message.from.username !== allMessages.username
							? message.from.username
							: undefined,
					isMilestone: message.isMilestone,
					type:
						message.from.username !== allMessages.username
							? 'received'
							: 'sent',
				}));
				state.groupMessages[groupName] = messages;
			}
		},
	},
});

export const chatActions = chatSlice.actions;

export default chatSlice;
