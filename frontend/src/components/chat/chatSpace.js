import React from 'react';
import { useSelector } from 'react-redux';

import './chatSpace.css';
import Message from './message/message';

function ChatSpace({ socket }) {
	// console.log(activeChat);
	const activeChat = useSelector((state) => state.chat.activeChat);
	// const { user: currentUser } = useSelector((state) => state.app);
	// console.log(currentUser);
	const messages = activeChat.messages.map((message, ind) => (
		<Message key={ind} {...message} />
	));
	return <div className="chat-space">{messages}</div>;
}

export default ChatSpace;
