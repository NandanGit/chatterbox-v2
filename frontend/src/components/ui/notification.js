import React from 'react';
import { useDispatch } from 'react-redux';
import { notificationActions } from '../../store/notification-slice';
import { Icon } from '@iconify/react';

import './notification.css';

function Notification(props) {
	const fire = useDispatch();

	setTimeout(() => {
		fire(notificationActions.deNotify());
	}, props.closeTime);
	return (
		<div className={`notification ${props.type}`}>
			<span className="body">{props.body}</span>
			<button
				className="icon-button"
				onClick={() => {
					fire(notificationActions.deNotify());
				}}
			>
				<Icon icon="gg:close-r" className="icon" />
			</button>
		</div>
	);
}

export default Notification;
