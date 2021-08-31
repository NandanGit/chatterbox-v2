import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { chatActions } from '../../../store/chat-slice';
import Recent from './recent';

import './recents.css';

function Recents({ socket }) {
	const fire = useDispatch();
	const user = useSelector((state) => state.app.user);

	const { friends: friendsArr, groups: groupsArr } = useSelector(
		(state) => state.connections
	);
	const recents = friendsArr
		.map((friend) => ({ ...friend, type: 'user', active: false }))
		.concat(
			groupsArr.map((group) => ({
				...group,
				type: 'group',
				active: false,
			}))
		);
	const openChatHandler = (chatDetails) => {
		// console.log(chatDetails);
		fire(chatActions.changeActiveChat(chatDetails));
	};

	const recentsArr = recents.map((recent) => (
		<Recent
			openChatHandler={openChatHandler}
			key={recent.username || recent.groupName}
			{...recent}
		/>
	));
	return (
		<div className="recents panel-items">
			<h3 className="panel-title">{user.displayName}'s Recent chats</h3>
			{recentsArr.length ? (
				recentsArr
			) : (
				<div className="no-friends">
					<h2>No friends to show!!</h2>
					<br />
					<h3>Use the search bar to find friends</h3>
				</div>
			)}
		</div>
	);
}

export default Recents;
