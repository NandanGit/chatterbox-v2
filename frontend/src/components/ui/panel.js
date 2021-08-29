import React from 'react';

function Panel(props) {
	return (
		<div className="panel">
			<h3 className="panel-title">{props.title}</h3>
			{props.items}
		</div>
	);
}

export default Panel;
