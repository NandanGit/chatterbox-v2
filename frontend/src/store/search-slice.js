import { createSlice } from '@reduxjs/toolkit';

const initialSearchState = {
	isActive: false,
	keyword: '',
	userResults: [],
	groupResults: [],
};

const searchSlice = createSlice({
	name: 'search',
	initialState: initialSearchState,
	reducers: {
		updateUserResults(state, payload) {},
		updateGroupResults(state, payload) {},
		updateKeyword(state, payload) {},
		resetSearchState(state) {
			state.keyword = initialSearchState.keyword;
			state.userResults = initialSearchState.userResults;
			state.groupResults = initialSearchState.groupResults;
		},
	},
});

export const searchActions = searchSlice.actions;

export default searchSlice;
