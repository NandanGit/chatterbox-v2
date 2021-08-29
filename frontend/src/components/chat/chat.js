import React from 'react';

import './chat.css';
import ChatSpace from './chatSpace';
import MessageBox from './message/messageBox';
import Recents from './recents/recents';
import Search from './search/search';

function Chat() {
	return (
		<div className="chat-app-container">
			<div className="left-panel">
				<Search searchMode={'groups'} />
				<Recents />
			</div>
			<div className="right-panel">
				<h1 className="header">Jayanth</h1>
				<ChatSpace />
				<MessageBox />
			</div>
		</div>
	);
}

export default Chat;
