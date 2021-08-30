import { createSlice } from '@reduxjs/toolkit';

const initialNotificationState = {
	active: false,
	body: '', // Notification message
	type: '', // {error | warning | success | neutral}
	closeTime: 1000, // (ms) Time after which the notification has to close itself
};

const notificationSlice = createSlice({
	name: 'notification',
	initialState: initialNotificationState,
	reducers: {
		notify(state, { payload: { body, type, closeTime } }) {
			state.body = body;
			state.type = type;
			state.closeTime = closeTime;
			state.active = true;
		},
		deNotify(state) {
			state.body = '';
			state.type = '';
			state.active = false;
		},
	},
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice;
