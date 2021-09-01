import React from 'react';
import { useSelector } from 'react-redux';

import './chatSpace.css';
import Message from './message/message';

function ChatSpace({ socket }) {
	const activeChat = useSelector((state) => state.chat.activeChat);
	const messages = activeChat.messages.map((message, ind) => (
		<Message key={ind} {...message} />
	));
	return <div className="chat-space">{messages}</div>;
}

export default ChatSpace;
