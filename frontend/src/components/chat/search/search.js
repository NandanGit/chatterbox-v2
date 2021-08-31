import React, { useState } from 'react';
import { Icon } from '@iconify/react';

import './search.css';
import { useDispatch, useSelector } from 'react-redux';
import { searchActions } from '../../../store/search-slice';
import { notificationActions } from '../../../store/notification-slice';

function Search({ socket }) {
	const fire = useDispatch();
	const searchMode = useSelector((state) => state.search.mode);
	const [searchKeyword, updateSearchKeyword] = useState('');

	const toggleSearchMode = () => {
		// setSearchMode((prev) => {
		// 	if (prev === 'users') return 'groups';
		// 	if (prev === 'groups') return 'users and groups';
		// 	return 'users';
		// });
		fire(searchActions.updateSearchMode());
	};

	const searchModeIconMap = {
		users: 'la:user',
		groups: 'la:users',
		'users and groups': 'ic:baseline-all-inclusive',
	};

	const searchHandler = (event) => {
		fire(searchActions.enterSearchState());
		const keyword = event.target.value.trim();
		updateSearchKeyword(keyword);
		fire(searchActions.updateKeyword({ keyword }));
		if (searchMode !== 'groups') {
			socket.emit(
				'user:search',
				{ keyword },
				({ matchedUsers, message }) => {
					if (message) {
						return fire(
							notificationActions.notify({
								body: message,
								type: 'error',
								closeTime: 3000,
							})
						);
					}
					console.log(matchedUsers);
					fire(
						searchActions.updateUserResults({
							userResults: matchedUsers,
						})
					);
				}
			);
		}
		if (searchMode !== 'users') {
			socket.emit(
				'group:search',
				{ keyword },
				({ matchedGroups, message }) => {
					if (message) {
						return fire(
							notificationActions.notify({
								body: message,
								type: 'error',
								closeTime: 3000,
							})
						);
					}
					console.log(matchedGroups);
					fire(
						searchActions.updateGroupResults({
							groupResults: matchedGroups,
						})
					);
				}
			);
		}
	};

	const exitSearchHandler = () => {
		fire(searchActions.resetSearchState());
	};

	return (
		<div className="search-container">
			{/* <select name="search-mode" id="search-mode-selector">
				<option value="users" selected>
					Users
				</option>
				<option value="rooms">Rooms</option>
			</select> */}
			<button id="search-mode-toggle" onClick={toggleSearchMode}>
				<Icon icon={searchModeIconMap[searchMode]} className="icon" />
				{/* <span>{searchMode === 'users' ? 'Groups' : 'Users'}</span> */}
			</button>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					searchHandler();
				}}
				className="search-bar-container"
			>
				<input
					onChange={searchHandler}
					className="search-bar"
					placeholder={`Search ${searchMode}...`}
					onBlur={exitSearchHandler}
					value={searchKeyword}
				/>
				<button>
					<Icon icon="fa-solid:search" className="icon" />
				</button>
			</form>
		</div>
	);
}

export default Search;
