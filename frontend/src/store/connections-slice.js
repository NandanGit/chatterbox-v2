import { createSlice } from '@reduxjs/toolkit';

const initialConnectionsState = {
	friends: [],
	groups: [],
};

const connectionsSlice = createSlice({
	name: 'connections',
	initialState: initialConnectionsState,
	reducers: {
		updateFriends(state, { payload: { friends } }) {
			state.friends = friends;
		},
		updateGroups(state, { payload: { groups } }) {
			state.groups = groups;
		},
		updateFriendsAndGroups(state, { payload: { friends, groups } }) {
			state.friends = friends;
			state.groups = groups;
		},
	},
});

export const connectionsActions = connectionsSlice.actions;

export default connectionsSlice;
