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

let didFetchMessages = false;

function Chat() {
	const fire = useDispatch();
	const { authToken } = useSelector((state) => state.app);
	const { activeChat } = useSelector((state) => state.chat);
	const { isActive: isSearching } = useSelector((state) => state.search);
	const [socketConnected, setSocketConnected] = useState(false);

	useEffect(() => {
		if (socketConnected) {
			socket.on('all:messages', (allMessages) => {
				console.log(allMessages);
				fire(chatActions.updateAllMessages({ allMessages }));
			});
			socket.on('all:friends', (allFriends) => {
				console.log(allFriends);
				fire(connectionsActions.updateFriends({ friends: allFriends }));
			});
			socket.on('all:groups', (allGroups) => {
				console.log(allGroups);
				fire(connectionsActions.updateGroups({ groups: allGroups }));
			});
		}
	}, [socketConnected, fire]);

	useEffect(() => {
		if (!socketConnected) {
			socket.auth.authtoken = authToken;
			socket.connect();
		}
	}, [authToken, socketConnected]);
	if (!didFetchMessages && socketConnected) {
		console.log('Fetching all messages');
		socket.emit('user:fetch:all:messages', {}, ({ allMessages }) => {
			console.log(allMessages);
		});

		didFetchMessages = true;
	}

	socket.on('connect', () => {
		// Fetch all the messages
		// console.log('Fetching all messages');
		// socket.emit('user:fetch:all:messages', {}, ({ allMessages }) => {
		// 	console.log(allMessages);
		// });
		setSocketConnected(true);
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
							<SearchResults />
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
