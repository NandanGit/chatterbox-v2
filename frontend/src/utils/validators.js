export const usernameValidator = (username) => {
	if (!username) return 'Username not provided';
	username = username.trim();
	if (!username) return 'Username not provided';
	if (username.length < 3) return 'Username is too short';
	if (username.length > 15) return 'Username is too long';
	if (!/^[a-z]+$/.test(username[0]))
		return `Username should only start with a lowercase alphabet`;
	if (!/^[a-z0-9.]+$/.test(username)) return 'Invalid username';
	return '';
};
