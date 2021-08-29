import React, { useState } from 'react';
import Auth from './components/auth/auth';
import Chat from './components/chat/chat';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(true);
	return (
		<React.Fragment>
			{!isLoggedIn ? <Auth fun={setIsLoggedIn} /> : <Chat />}
		</React.Fragment>
	);
}

export default App;
