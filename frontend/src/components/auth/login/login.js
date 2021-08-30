import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { notificationActions } from '../../../store/notification-slice';
import { appActions } from '../../../store/app-slice';
import Input from '../../form/input/input';
import Button from '../../ui/button';

import env from '../../../env';
import './login.css';

function Login({ setAuthType }) {
	const fire = useDispatch();
	const usernameRef = useRef();
	const passwordRef = useRef();

	const [usernameStatus, setUsernameStatus] = useState('');
	const [passwordStatus, setPasswordStatus] = useState('');

	const loginHandler = async () => {
		const username = usernameRef.current.value;
		const password = passwordRef.current.value;

		setUsernameStatus('checking');
		setPasswordStatus('checking');

		console.log(username, password);
		let data;
		try {
			const response = await fetch(`${env.variables.HOST_URL}/login`, {
				method: 'POST',
				mode: 'cors',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password }),
			});
			data = await response.json();
			console.log(data);
		} catch (err) {
			setUsernameStatus('');
			setPasswordStatus('');
			return fire(
				notificationActions.notify({
					// body: "Couldn't connect to the internet",
					body: err.message,
					type: 'error',
					closeTime: 3000,
				})
			);
		}
		if (!data.accessToken) {
			if (data.message === 'User not found') {
				setUsernameStatus('invalid');
			} else {
				setUsernameStatus('valid');
			}
			setPasswordStatus('invalid');
			return fire(
				notificationActions.notify({
					// body: "Couldn't connect to the internet",
					body: data.message,
					type: 'error',
					closeTime: 3000,
				})
			);
		}
		setUsernameStatus('valid');
		setPasswordStatus('valid');
		fire(
			notificationActions.notify({
				body: 'Authenticated',
				type: 'success',
				closeTime: 1000,
			})
		);
		setTimeout(() => {
			fire(
				notificationActions.notify({
					body: 'Starting App...',
					type: 'success',
					closeTime: 1000,
				})
			);
		}, 1000);
		setTimeout(() => {
			fire(
				appActions.login({
					authToken: data.accessToken,
					user: {
						username: data.username,
						displayName: data.displayName,
					},
				})
			);
		}, 2000);
	};

	const usernameModifier = (event) => {
		const username = event.target.value
			.trim()
			.toLowerCase()
			.replace(/[^a-zA-Z0-9.]/g, '')
			.slice(0, 15);
		event.target.value = username;
	};

	return (
		<div className="login-container">
			<h1>Login</h1>
			<Input
				placeholder="Username"
				icon="ci:id-card"
				status={usernameStatus}
				onChange={usernameModifier}
				refer={usernameRef}
			/>
			<Input
				placeholder="Password"
				type="password"
				icon="ri:lock-password-line"
				status={passwordStatus}
				refer={passwordRef}
			/>
			<div className="actions">
				<Button onClick={loginHandler}>Login</Button>
				<Button
					onClick={setAuthType.bind(this, 'signup')}
					className="outline"
				>
					Signup
				</Button>
			</div>
		</div>
	);
}

export default Login;
