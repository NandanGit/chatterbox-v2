import React, { useRef } from 'react';
import { Icon } from '@iconify/react';

import './messageBox.css';
import { useSelector } from 'react-redux';

function MessageBox({ socket }) {
	const { activeChat } = useSelector((state) => state.chat);
	const inputRef = useRef();
	const receiverName = activeChat.username || activeChat.groupName;
	const receiverType = activeChat.type;

	console.log(receiverName, receiverType);
	const sendMessageHandler = (event) => {
		event.preventDefault();
		const message = inputRef.current.value.trim();
		if (!message) {
			return;
		}
		if (receiverType === 'user') {
			socket.emit(
				'direct:message',
				{ to: receiverName, body: message },
				({ isSent, message }) => {}
			);
		} else {
			socket.emit(
				'group:message',
				{ to: receiverName, body: message },
				({ isSent, message }) => {}
			);
		}
		inputRef.current.value = '';
	};

	return (
		<div className="message-box">
			<form onSubmit={sendMessageHandler}>
				<input
					id="message-box-space"
					ref={inputRef}
					placeholder="Say something"
					autoComplete="off"
				/>
				<button className="send-message-button">
					<Icon
						icon="fluent:send-16-filled"
						className="icon send-icon"
					/>
				</button>
			</form>
		</div>
	);
}

export default MessageBox;
