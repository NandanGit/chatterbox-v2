import React from 'react';
import { useSelector } from 'react-redux';
import Recent from './recent';

import './recents.css';

const RECENTS = [
	{ username: 'jay', displayName: 'Jayanth', type: 'user', active: false },
	{
		username: 'boss',
		displayName: 'Navadeep',
		type: 'user',
		active: false,
	},
	{
		username: 'sp1',
		displayName: 'Super 100 1',
		type: 'group',
		active: false,
	},
	{
		username: 'abdul',
		displayName: 'Abdul Kalam',
		type: 'user',
		active: true,
	},
	{
		username: 'sp2',
		displayName: 'Super 100 2',
		type: 'group',
		active: false,
	},
];

function Recents(props) {
	const user = useSelector((state) => state.app.user);
	return (
		<div className="recents panel-items">
			<h3 className="panel-title">Recents for {user.displayName}</h3>
			{RECENTS.map((recent) => (
				<Recent key={recent.username} {...recent} />
			))}
		</div>
	);
}

export default Recents;
