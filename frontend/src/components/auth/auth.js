import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Signup from './signup/signup';
import './auth.css';
import Login from './login/login';
import Notification from '../ui/notification';

function Auth(props) {
	const [authType, setAuthType] = useState('login');
	const notification = useSelector((state) => state.notification);

	return (
		<div className="auth-wrapper center-elems">
			{notification.active && (
				<Notification
					body={notification.body}
					closeTime={notification.closeTime}
					type={notification.type}
				/>
			)}

			<h1 className="app-title">ChatterBox</h1>
			<div className="auth-container center-elems">
				{authType === 'login' ? (
					<Login setAuthType={setAuthType} />
				) : (
					<Signup setAuthType={setAuthType} />
				)}
			</div>
		</div>
	);
}

export default Auth;
