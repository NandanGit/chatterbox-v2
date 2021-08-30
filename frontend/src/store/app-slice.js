import { createSlice } from '@reduxjs/toolkit';

const initialAppState = {
	isLoggedIn: false,
	authToken: undefined,
	socket: undefined,
	user: undefined,
};

const appSlice = createSlice({
	name: 'app',
	initialState: initialAppState,
	reducers: {
		login(state, { authToken, user }) {
			state.isLoggedIn = true;
			state.authToken = authToken;
			state.user = user;
		},
		logout(state) {
			state.isLoggedIn = false;
			state.user = undefined;
			state.socket = undefined;
			state.authToken = undefined;
		},
		setSocket(state, { socket }) {
			state.socket = socket;
		},
	},
});

export const appActions = appSlice.actions;

export default appSlice;
