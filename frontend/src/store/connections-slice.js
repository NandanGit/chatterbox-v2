import { createSlice } from '@reduxjs/toolkit';

const initialConnectionsState = {
	friends: [],
	groups: [],
};

const connectionsSlice = createSlice({
	name: 'connections',
	initialState: initialConnectionsState,
	reducers: {
		addFriend(state, { payload: { username, displayName } }) {
			const friend = state.friends.find(
				(friend) => friend.username === username
			);
			console.log(username, displayName);
			if (!friend) {
				state.friends.unshift({
					username,
					displayName,
					type: 'user',
					active: false,
				});
			}
		},
		addGroup(state, { payload: { groupName, displayName } }) {
			state.groups.unshift({
				groupName,
				displayName,
				type: 'group',
				active: false,
			});
		},
		updateFriends(state, { payload: { friends } }) {
			state.friends = friends.map((friend) => ({
				...friend,
				type: 'user',
				active: false,
			}));
		},
		updateGroups(state, { payload: { groups } }) {
			state.groups = groups.map((group) => ({
				...group,
				type: 'group',
				active: false,
			}));
		},
		updateFriendsAndGroups(state, { payload: { friends, groups } }) {
			state.friends = friends;
			state.groups = groups;
		},
		changeActiveChat(state, { payload: { type, name } }) {
			state.friends = state.friends.map((friend) => ({
				...friend,
				active: name === friend.username && type === 'user',
			}));
			state.groups = state.groups.map((group) => ({
				...group,
				active: name === group.groupName && type === 'group',
			}));
		},
	},
});

export const connectionsActions = connectionsSlice.actions;

export default connectionsSlice;
