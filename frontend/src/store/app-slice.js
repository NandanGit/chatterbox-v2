import { createSlice } from '@reduxjs/toolkit';

const initialAppState = {
	socket: undefined,
};

try {
	const user = JSON.parse(localStorage.getItem('user'));
	initialAppState.user = user.user;
	initialAppState.authToken = user.authToken;
	initialAppState.isLoggedIn = true;
} catch (err) {
	initialAppState.isLoggedIn = false;
	initialAppState.user = undefined;
	initialAppState.authToken = undefined;
}

const appSlice = createSlice({
	name: 'app',
	initialState: initialAppState,
	reducers: {
		login(state, { payload: { authToken, user } }) {
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
		setSocket(state, { payload: { socket } }) {
			state.socket = socket;
		},
	},
});

export const appActions = appSlice.actions;

export default appSlice;
