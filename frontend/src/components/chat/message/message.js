import React from 'react';

import { customDate } from '../../../utils/date';
import './message.css';

function Message(props) {
	return (
		<div className={`message ${props.type}`}>
			<h6 className="sender">{props.sender}</h6>
			<div className="body">{props.body}</div>
			<div className="message-status">
				<div className="time">{customDate(props.createdAt)}</div>
			</div>
		</div>
	);
}

export default Message;
