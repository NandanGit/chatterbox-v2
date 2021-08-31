import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chatActions } from '../../store/chat-slice';

import './chatSpace.css';
import Message from './message/message';

// const MESSAGES = [
// 	{ type: 'received', body: 'Hi ra Nandan' },
// 	{ type: 'sent', body: 'Hi ra Jayanth', status: 'sent' },
// 	{
// 		type: 'received',
// 		body: 'Em chesthunnav?'.repeat(25),
// 		sender: 'Jayanth',
// 	},
// 	{ type: 'sent', body: 'You?', status: 'failed' },
// 	{ type: 'sent', body: 'Nothing', status: 'sending' },
// 	{ type: 'sent', body: 'You?', status: 'failed' },
// 	{ type: 'sent', body: 'You?', status: 'failed' },
// 	{ type: 'sent', body: 'You?'.repeat(30), status: 'failed' },
// 	{ type: 'sent', body: 'You?', status: 'failed' },
// ];

function ChatSpace({ socket }) {
	// console.log(activeChat);
	const activeChat = useSelector((state) => state.chat.activeChat);
	const { user: currentUser } = useSelector((state) => state.app);
	console.log(currentUser);
	const messages = activeChat.messages.map((message, ind) => (
		<Message key={ind} {...message} />
	));
	return <div className="chat-space">{messages}</div>;
}

export default ChatSpace;
