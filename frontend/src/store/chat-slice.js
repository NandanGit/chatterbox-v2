import { createSlice } from '@reduxjs/toolkit';

const initialChatSlice = {
	activeUser: undefined,
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
		addDirectMessage(state, { username, message }) {},
		addGroupMessage(state, { groupName, message }) {},
	},
});

export const chatActions = chatSlice.actions;

export default chatSlice;
