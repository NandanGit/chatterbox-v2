usernameValidator = (username) => {
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

displayNameValidator = (displayName) => {
	if (!displayName) return 'displayName not provided';
	displayName = displayName.trim();
	if (!displayName) return 'displayName not provided';
	if (displayName.length < 3) return 'displayName is too short';
	if (displayName.length > 15) return 'displayName is too long';
	if (!/^[a-zA-Z]+$/.test(displayName[0]))
		return `displayName should only start with a lowercase alphabet`;
	if (!/^[a-zA-Z0-9 ]+$/.test(displayName)) return 'Invalid displayName';
	return '';
};

passwordValidator = (password) => {
	if (!password) return 'password not provided';
	password = password.trim();
	if (!password) return 'password not provided';
	if (password.length < 3) return 'password is too short';
	if (password.length > 15) return 'password is too long';
	return '';
};

exports.userValidator = ({ username, password, displayName }) => {
	let error;
	error = usernameValidator(username);
	if (error) {
		return error;
	}

	error = displayNameValidator(displayName);
	if (error) {
		return error;
	}

	error = passwordValidator(password);
	if (error) {
		return error;
	}

	return '';
};
