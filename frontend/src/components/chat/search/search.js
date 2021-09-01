import React, { useState } from 'react';
import { Icon } from '@iconify/react';

import './search.css';
import { useDispatch, useSelector } from 'react-redux';
import { searchActions } from '../../../store/search-slice';

function Search({ socket }) {
	const fire = useDispatch();
	const user = useSelector((state) => state.app.user);

	const searchMode = useSelector((state) => state.search.mode);
	const [searchKeyword, updateSearchKeyword] = useState('');

	const toggleSearchMode = () => {
		fire(searchActions.updateSearchMode());
	};

	const searchModeIconMap = {
		users: 'la:user',
		groups: 'la:users',
		'users and groups': 'ic:baseline-all-inclusive',
	};

	const searchHandler = (event) => {
		fire(searchActions.enterSearchState());
		const keyword = event.target.value.trimStart();
		updateSearchKeyword(keyword);
		if (!keyword) return;
		fire(searchActions.updateKeyword({ keyword: keyword.trim() }));
		if (searchMode !== 'groups') {
			socket.emit(
				'user:search',
				{ keyword: keyword.trim() },
				({ matchedUsers, message }) => {
					if (message) {
						return;
					}
					// console.log(matchedUsers);
					matchedUsers = matchedUsers.filter(
						(matchedUser) => matchedUser.username !== user.username
					);
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
						return;
					}
					// console.log(matchedGroups);
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
		updateSearchKeyword('');
		fire(searchActions.resetSearchState());
	};

	return (
		<div className="search-container">
			<button id="search-mode-toggle" onClick={toggleSearchMode}>
				<Icon icon={searchModeIconMap[searchMode]} className="icon" />
			</button>
			<form
				onSubmit={(event) => {
					event.preventDefault();
				}}
				className="search-bar-container"
			>
				<input
					onChange={searchHandler}
					className="search-bar"
					placeholder={`Search ${searchMode}...`}
					value={searchKeyword}
				/>
				<button
					style={{ display: !searchKeyword ? 'none' : '' }}
					onClick={exitSearchHandler}
				>
					<Icon icon="uil:times-square" className="icon" />
				</button>
			</form>
		</div>
	);
}

export default Search;
