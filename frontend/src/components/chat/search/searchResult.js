import React from 'react';
import { Icon } from '@iconify/react';

import './searchResult.css';

function SearchResult(props) {
	return (
		<div
			className={`search-result panel-item`}
			onClick={props.openChatHandler.bind(this, {
				type: props.type,
				name: props.username || props.groupName,
				displayName: props.displayName,
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

export default SearchResult;
