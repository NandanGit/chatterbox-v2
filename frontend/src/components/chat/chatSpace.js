import React from 'react';

import './chatSpace.css';
import Message from './message/message';

const MESSAGES = [
	{ type: 'received', body: 'Hi ra Nandan' },
	{ type: 'sent', body: 'Hi ra Jayanth', status: 'sent' },
	{
		type: 'received',
		body: 'Em chesthunnav?'.repeat(25),
		sender: 'Jayanth',
	},
	{ type: 'sent', body: 'You?', status: 'failed' },
	{ type: 'sent', body: 'Nothing', status: 'sending' },
	{ type: 'sent', body: 'You?', status: 'failed' },
	{ type: 'sent', body: 'You?', status: 'failed' },
	{ type: 'sent', body: 'You?'.repeat(30), status: 'failed' },
	{ type: 'sent', body: 'You?', status: 'failed' },
];

function ChatSpace() {
	return (
		<div className="chat-space">
			{MESSAGES.map((message, ind) => (
				<Message key={ind} {...message} />
			))}
		</div>
	);
}

export default ChatSpace;
