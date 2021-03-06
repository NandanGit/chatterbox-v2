import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { io } from 'socket.io-client';

import './chat.css';
import ChatSpace from './chatSpace';
import MessageBox from './message/messageBox';
import Recents from './recents/recents';
import Search from './search/search';
import { useDispatch, useSelector } from 'react-redux';
import { appActions } from '../../store/app-slice';
import env from '../../env';
import SearchResults from './search/searchResults';
import { connectionsActions } from '../../store/connections-slice';
import { chatActions } from '../../store/chat-slice';

const socket = io(env.variables.HOST_URL, {
	transports: ['websocket', 'polling', 'flashsocket'],
	autoConnect: false,
	auth: {},
});

let areSocketEventsRegistered = false;

function Chat() {
	const fire = useDispatch();
	const { authToken } = useSelector((state) => state.app);
	const { activeChat } = useSelector((state) => state.chat);
	const { isActive: isSearching } = useSelector((state) => state.search);
	const [socketConnected, setSocketConnected] = useState(false);

	if (!areSocketEventsRegistered && socketConnected) {
		socket.on('all:messages', (allMessages) => {
			// console.log(allMessages);
			fire(chatActions.updateAllMessages({ allMessages }));
		});
		socket.on('all:friends', (allFriends) => {
			// console.log(allFriends);
			fire(connectionsActions.updateFriends({ friends: allFriends }));
		});
		socket.on('all:groups', (allGroups) => {
			// console.log(allGroups);
			fire(connectionsActions.updateGroups({ groups: allGroups }));
		});
		socket.on('direct:message', (message) => {
			console.log(message);
			fire(chatActions.addDirectMessage(message));
		});
		socket.on('group:message', (message) => {
			console.log(message);
			fire(chatActions.addGroupMessage(message));
		});

		socket.on('friend:request', ({ from }) => {
			console.log(`A friend request from ${from}`);
			fire(
				connectionsActions.addFriend({
					username: from,
					displayName: from,
				})
			);
			socket.emit(
				'friend:request:accept',
				{ friendName: from },
				() => {}
			);
			window.location.reload();
		});

		areSocketEventsRegistered = true;
	}

	useEffect(() => {
		if (!socketConnected) {
			socket.auth.authtoken = authToken;
			socket.connect();
		}
	}, [authToken, socketConnected]);

	socket.on('connect', () => {
		setSocketConnected(true);
	});

	socket.on('connect_error', (err) => {
		localStorage.removeItem('user');
		window.location.reload();
	});

	const logoutHandler = () => {
		fire(appActions.logout());
		localStorage.removeItem('user');
		window.location.reload();
	};

	return (
		<div className="chat-app-container">
			{socketConnected ? (
				<React.Fragment>
					<div className="left-panel">
						<Search socket={socket} searchMode={'groups'} />
						{isSearching ? (
							<SearchResults socket={socket} />
						) : (
							<Recents socket={socket} />
						)}
					</div>
					<div className="right-panel">
						<button onClick={logoutHandler} className="icon-button">
							<abbr title="Logout">
								<Icon
									icon="heroicons-outline:logout"
									className="icon"
								/>
							</abbr>
						</button>
						{activeChat && (
							<React.Fragment>
								<h1 className="header">
									<span>{activeChat.displayName}</span>
								</h1>
								<ChatSpace
									activeChat={activeChat}
									socket={socket}
								/>
								<MessageBox socket={socket} />
							</React.Fragment>
						)}
					</div>
				</React.Fragment>
			) : (
				<div className="connecting-icon">
					<Icon icon="eos-icons:bubble-loading" className="icon" />
				</div>
			)}
		</div>
	);
}

export default Chat;
