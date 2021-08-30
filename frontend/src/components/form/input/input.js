import React from 'react';
import { Icon } from '@iconify/react';

import './input.css';

function Input(props) {
	const statusMapper = {
		checking: 'eos-icons:loading',
		valid: 'akar-icons:circle-check-fill',
		invalid: 'uis:times-circle',
	};
	return (
		<div className="custom-input-wrapper">
			<div className="custom-input">
				{props.icon && <Icon icon={props.icon} className="icon" />}
				<input
					{...props}
					type={props.type || 'text'}
					className={`${props.className || ''}`}
					ref={props.refer}
				/>
				{props.status && (
					<Icon
						icon={statusMapper[props.status]}
						className={`status ${props.status}`}
					/>
				)}
			</div>
			<p className={`feedback ${props.status}`}>{props.error}</p>
		</div>
	);
}

export default Input;
