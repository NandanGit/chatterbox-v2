import React from 'react';
import { Icon } from '@iconify/react';

import './messageBox.css';

function MessageBox(props) {
	return (
		<div className="message-box">
			<form>
				<input id="message-box-space" />
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
