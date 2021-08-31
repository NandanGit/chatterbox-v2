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

const socket = io(env.variables.HOST_URL, {
	transports: ['websocket', 'polling', 'flashsocket'],
	autoConnect: false,
	auth: {},
});

function Chat() {
	const fire = useDispatch();
	const { authToken } = useSelector((state) => state.app);
	const [socketConnected, setSocketConnected] = useState(false);

	useEffect(() => {
		if (!socketConnected) {
			socket.auth.authtoken = authToken;
			socket.connect();
			setSocketConnected(true);
		}
	}, [authToken, socketConnected]);

	const logoutHandler = () => {
		fire(appActions.logout());
	};

	return (
		<div className="chat-app-container">
			{socketConnected ? (
				<React.Fragment>
					<div className="left-panel">
						<Search socket={socket} searchMode={'groups'} />
						<Recents socket={socket} />
					</div>
					<div className="right-panel">
						<h1 className="header">
							<span>Jayanth</span>
							<button
								onClick={logoutHandler}
								className="icon-button"
							>
								<abbr title="Logout">
									<Icon
										icon="heroicons-outline:logout"
										className="icon"
									/>
								</abbr>
							</button>
						</h1>
						<ChatSpace socket={socket} />
						<MessageBox socket={socket} />
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
