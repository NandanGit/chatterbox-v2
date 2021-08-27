import React, { useState } from 'react';
import Auth from './components/auth/auth';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	return (
		<React.Fragment>
			{!isLoggedIn && <Auth fun={setIsLoggedIn} />}
		</React.Fragment>
	);
}

export default App;
