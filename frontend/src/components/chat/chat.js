import React from 'react';
import { Icon } from '@iconify/react';

import './chat.css';
import ChatSpace from './chatSpace';
import MessageBox from './message/messageBox';
import Recents from './recents/recents';
import Search from './search/search';
import { useDispatch } from 'react-redux';
import { appActions } from '../../store/app-slice';

function Chat() {
	const fire = useDispatch();
	const logoutHandler = () => {
		fire(appActions.logout());
	};

	return (
		<div className="chat-app-container">
			<div className="left-panel">
				<Search searchMode={'groups'} />
				<Recents />
			</div>
			<div className="right-panel">
				<h1 className="header">
					<span>Jayanth</span>
					<button onClick={logoutHandler} className="icon-button">
						<abbr title="Logout">
							<Icon
								icon="heroicons-outline:logout"
								className="icon"
							/>
						</abbr>
					</button>
				</h1>
				<ChatSpace />
				<MessageBox />
			</div>
		</div>
	);
}

export default Chat;
