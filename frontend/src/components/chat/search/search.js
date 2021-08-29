import React, { useState } from 'react';
import { Icon } from '@iconify/react';

import './search.css';
import { capitalize } from '../../../utils/strings';

function Search() {
	const [searchMode, setSearchMode] = useState('users');

	const toggleSearchMode = () => {
		setSearchMode((prev) => {
			if (prev === 'users') return 'groups';
			return 'users';
		});
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
				<Icon
					icon={searchMode === 'users' ? 'la:user' : 'la:users'}
					className="icon"
				/>
				{/* <span>{searchMode === 'users' ? 'Groups' : 'Users'}</span> */}
			</button>
			<form className="search-bar-container">
				<input
					className="search-bar"
					placeholder={`Search ${searchMode}...`}
				/>
				<button>
					<Icon icon="fa-solid:search" className="icon" />
				</button>
			</form>
		</div>
	);
}

export default Search;
