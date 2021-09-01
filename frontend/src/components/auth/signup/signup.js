import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Input from '../../form/input/input';
import Button from '../../ui/button';
import env from '../../../env';

import './signup.css';
import { notificationActions } from '../../../store/notification-slice';
import { appActions } from '../../../store/app-slice';
import { chatActions } from '../../../store/chat-slice';

function Signup({ setAuthType }) {
	const fire = useDispatch();
	const usernameRef = useRef();
	const displayNameRef = useRef();
	const passwordRef = useRef();

	const [usernameStatus, setUsernameStatus] = useState('');
	const [displayNameStatus, setDisplayNameStatus] = useState('');
	const [passwordStatus, setPasswordStatus] = useState('');

	const signupHandler = async (event) => {
		event.preventDefault();
		const username = usernameRef.current.value;
		const displayName = displayNameRef.current.value;
		const password = passwordRef.current.value;

		setUsernameStatus('checking');
		setPasswordStatus('checking');
		setDisplayNameStatus('checking');

		let data;
		try {
			const response = await fetch(`${env.variables.HOST_URL}/signup`, {
				method: 'POST',
				mode: 'cors',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, displayName, password }),
			});
			data = await response.json();
			// console.log(data);
		} catch (err) {
			setUsernameStatus('');
			setPasswordStatus('');
			return fire(
				notificationActions.notify({
					body: "Couldn't connect to the internet",
					// body: err.message,
					type: 'error',
					closeTime: 3000,
				})
			);
		}
		if (!data.accessToken) {
			if (data.message.startsWith('displayName')) {
				setDisplayNameStatus('invalid');
			} else {
				setUsernameStatus('checking');
			}
			setPasswordStatus('checking');
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
		setDisplayNameStatus('valid');
		// Store the user to localStorage
		localStorage.setItem(
			'user',
			JSON.stringify({
				authToken: data.accessToken,
				user: {
					username: data.username,
					displayName: data.displayName,
				},
			})
		);
		fire(
			appActions.login({
				authToken: data.accessToken,
				user: {
					username: data.username,
					displayName: data.displayName,
				},
			})
		);
		fire(
			chatActions.setUser({
				username: data.username,
				displayName: data.displayName,
			})
		);
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
		<form onSubmit={signupHandler} className="signup-container">
			<h1>Sign Up</h1>
			<Input
				placeholder="Username"
				icon="ci:id-card"
				status={usernameStatus}
				refer={usernameRef}
				onChange={usernameModifier}
			/>
			<Input
				placeholder="Profile Name"
				icon="ant-design:user-outlined"
				status={displayNameStatus}
				refer={displayNameRef}
			/>
			<Input
				placeholder="Password"
				type="password"
				icon="ri:lock-password-line"
				status={passwordStatus}
				refer={passwordRef}
			/>
			<div className="actions">
				<Button>Signup</Button>
				<Button
					onClick={setAuthType.bind(this, 'login')}
					className="outline"
				>
					Login
				</Button>
			</div>
		</form>
	);
}

export default Signup;
