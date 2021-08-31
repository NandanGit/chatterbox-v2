import { createSlice } from '@reduxjs/toolkit';

const initialSearchState = {
	mode: 'users and groups',
	isActive: false,
	keyword: '',
	userResults: [],
	groupResults: [],
};

const searchSlice = createSlice({
	name: 'search',
	initialState: initialSearchState,
	reducers: {
		updateUserResults(state, { payload: { userResults } }) {
			state.userResults = userResults.map((result) => ({
				...result,
				type: 'user',
			}));
		},
		updateGroupResults(state, { payload: { groupResults } }) {
			state.groupResults = groupResults.map((result) => ({
				...result,
				type: 'group',
			}));
		},
		updateKeyword(state, { payload: { keyword } }) {
			state.keyword = keyword;
		},
		resetSearchState(state) {
			state.keyword = initialSearchState.keyword;
			state.userResults = initialSearchState.userResults;
			state.groupResults = initialSearchState.groupResults;
			state.isActive = false;
		},
		enterSearchState(state) {
			state.isActive = true;
		},
		updateSearchMode(state) {
			switch (state.mode) {
				case 'users':
					state.mode = 'groups';
					break;
				case 'groups':
					state.mode = 'users and groups';
					break;
				default:
					state.mode = 'users';
			}
		},
	},
});

export const searchActions = searchSlice.actions;

export default searchSlice;
