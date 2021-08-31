import React from 'react';
import { Icon } from '@iconify/react';

import './recent.css';

function Recent(props) {
	return (
		<div
			className={`recent panel-item ${props.className} ${
				props.active ? ' active' : ''
			}`}
			onClick={props.openChatHandler.bind(this, {
				type: props.type,
				name: props.username || props.groupName,
			})}
		>
			<span className="display-name">
				<Icon
					icon={
						props.type === 'user' ? 'la:user' : 'octicon:people-24'
					}
					className="icon"
				/>
				{props.displayName}
			</span>
			<span className="username">
				@{props.username || props.groupName}
			</span>
		</div>
	);
}

export default Recent;
