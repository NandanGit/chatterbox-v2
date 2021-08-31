import React from 'react';
import { useSelector } from 'react-redux';
import SearchResult from './searchResult';

import './searchResults.css';

function SearchResults(props) {
	const { keyword, userResults, groupResults, mode } = useSelector(
		(state) => state.search
	);
	return (
		<div className="search-results panel-items">
			{mode !== 'groups' && (
				<React.Fragment>
					<h3 className="panel-title">Users for {keyword}</h3>
					{userResults.length ? (
						userResults.map((result) => (
							<SearchResult
								key={result.username || result.groupName}
								{...result}
							/>
						))
					) : (
						<div className="no-friends">
							<h2>No users found</h2>
						</div>
					)}
				</React.Fragment>
			)}

			{mode !== 'users' && (
				<React.Fragment>
					<h3 className="panel-title">Groups for {keyword}</h3>
					{groupResults.length ? (
						groupResults.map((result) => (
							<SearchResult
								key={result.username || result.groupName}
								{...result}
							/>
						))
					) : (
						<div className="no-friends">
							<h2>No groups found</h2>
						</div>
					)}
				</React.Fragment>
			)}
		</div>
	);
}

export default SearchResults;
