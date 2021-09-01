import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chatActions } from '../../../store/chat-slice';
import { connectionsActions } from '../../../store/connections-slice';
import CreateGroup from './createGroup';
import SearchResult from './searchResult';

import './searchResults.css';

function SearchResults({ socket }) {
	const fire = useDispatch();
	const { keyword, userResults, groupResults, mode } = useSelector(
		(state) => state.search
	);

	const openChatHandler = (chatDetails) => {
		console.log(chatDetails);
		if (chatDetails.type === 'user') {
			fire(
				connectionsActions.addFriend({
					username: chatDetails.name,
					displayName: chatDetails.displayName,
				})
			);
			socket.emit(
				'friend:request',
				{ friendName: chatDetails.name },
				() => {}
			);
			window.location.reload();
		} else {
			fire(
				connectionsActions.addGroup({
					groupName: chatDetails.name,
					displayName: chatDetails.displayName,
				})
			);
			socket.emit(
				'group:join',
				{ groupName: chatDetails.name },
				() => {}
			);
			window.location.reload();
		}
		fire(chatActions.changeActiveChat(chatDetails));
		fire(connectionsActions.changeActiveChat(chatDetails));
	};

	return (
		<div className="search-results panel-items">
			{mode !== 'groups' && (
				<React.Fragment>
					<h3 className="panel-title">Users for {keyword}</h3>
					{userResults.length ? (
						userResults.map((result) => (
							<SearchResult
								openChatHandler={openChatHandler}
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
								openChatHandler={openChatHandler}
								key={result.username || result.groupName}
								{...result}
							/>
						))
					) : (
						<div className="no-friends">
							<h2>No groups found</h2>
							<CreateGroup socket={socket} />
						</div>
					)}
				</React.Fragment>
			)}
		</div>
	);
}

export default SearchResults;
