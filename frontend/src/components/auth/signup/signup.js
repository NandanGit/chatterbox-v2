import React from 'react';
import Input from '../../form/input/input';
import Button from '../../ui/button';

import './signup.css';

function Signup({ setAuthType }) {
	return (
		<div className="signup-container">
			<h1>Sign Up</h1>
			<Input
				placeholder="Username"
				icon="ci:id-card"
				status={'invalid'}
			/>
			<Input
				placeholder="Profile Name"
				icon="ant-design:user-outlined"
				status={'valid'}
			/>
			<Input
				placeholder="Password"
				type="password"
				icon="ri:lock-password-line"
				status={'valid'}
			/>
			<Input
				placeholder="Confirm Password"
				type="password"
				icon="ri:lock-password-fill"
				status={'checking'}
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
		</div>
	);
}

export default Signup;
