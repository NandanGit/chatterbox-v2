import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import './chatSpace.css';
import Message from './message/message';

function ChatSpace({ socket }) {
	const endRef = useRef();
	const activeChat = useSelector((state) => state.chat.activeChat);
	const messages = activeChat.messages.map((message, ind) => (
		<Message key={ind} {...message} />
	));

	const scrollToBottom = () => {
		endRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<div className="chat-space">
			{messages}
			<div ref={endRef} />
		</div>
	);
}

export default ChatSpace;
