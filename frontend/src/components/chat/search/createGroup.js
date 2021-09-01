import React, { useRef, useState } from 'react';

import './createGroup.css';
import Input from '../../form/input/input';
import Button from '../../ui/button';

function CreateGroup({ socket }) {
	const groupNameRef = useRef();
	const displayNameRef = useRef();

	const [groupNameStatus, setGroupNameStatus] = useState('');
	const [displayNameStatus, setDisplayNameStatus] = useState('');

	const createGroupHandler = (event) => {
		event.preventDefault();
		socket.emit(
			'group:create',
			{
				groupName: groupNameRef.current.value,
				displayName: displayNameRef.current.value.trim(),
			},
			({ isCreated }) => {
				if (!isCreated) {
					setDisplayNameStatus('invalid');
					return setGroupNameStatus('invalid');
				}
				setDisplayNameStatus('valid');
				setGroupNameStatus('valid');
				window.location.reload();
			}
		);
	};

	const groupNameModifier = (event) => {
		const groupName = event.target.value
			.trim()
			.toLowerCase()
			.replace(/[^a-zA-Z0-9.]/g, '')
			.slice(0, 15);
		event.target.value = groupName;
	};

	return (
		<div className="create-group">
			<form onSubmit={createGroupHandler}>
				<Input
					placeholder="Group Name"
					refer={groupNameRef}
					status={groupNameStatus}
					onChange={groupNameModifier}
				/>
				<Input
					placeholder="Display Name"
					refer={displayNameRef}
					status={displayNameStatus}
				/>
				<Button className="create-group-btn">Create</Button>
			</form>
		</div>
	);
}

export default CreateGroup;
