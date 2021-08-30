import { configureStore } from '@reduxjs/toolkit';

import searchSlice from './search-slice';
import connectionsSlice from './connections-slice';
import chatSlice from './chat-slice';
import appSlice from './app-slice';

const store = configureStore({
	reducer: {
		search: searchSlice.reducer,
		connections: connectionsSlice.reducer,
		chat: chatSlice.reducer,
		app: appSlice.reducer,
	},
});

export default store;
