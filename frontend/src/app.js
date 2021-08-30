import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Auth from './components/auth/auth';
import Chat from './components/chat/chat';

function App() {
	const isLoggedIn = useSelector((state) => state.app.isLoggedIn);
	// const [isLoggedIn, setIsLoggedIn] = useState(true);
	return <React.Fragment>{!isLoggedIn ? <Auth /> : <Chat />}</React.Fragment>;
}

export default App;
