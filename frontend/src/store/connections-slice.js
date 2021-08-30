import { createSlice } from '@reduxjs/toolkit';

const initialConnectionsState = {
	friends: [],
	groups: [],
};

const connectionsSlice = createSlice({
	name: 'connections',
	initialState: initialConnectionsState,
	reducers: {},
});

export const connectionsActions = connectionsSlice.actions;

export default connectionsSlice;
