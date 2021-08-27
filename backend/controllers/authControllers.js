const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dbOps = require('../db/operations');
const { userValidator } = require('../utils/validators');

const generateToken = () => {};

exports.signupController = async (req, res) => {
	const { username, displayName, password } = req.body;
	// Validation
	const error = userValidator({ username, displayName, password });
	if (error) {
		return res.json({ status: 'error', message: error });
	}

	const { user } = await dbOps.Users.get(username);
	if (user) {
		return res.json({ status: 'error', message: 'Username is taken' });
	}

	// Hash the password
	const hashedPassword = await bcrypt.hash(password, 10);

	const { message } = await dbOps.Users.create({
		username,
		displayName,
		password: hashedPassword,
	});

	if (message) {
		return res.status(500).json({
			status: 'failure',
			message: 'something went wrong, try after some time',
		});
	}

	// Generate auth token
	const accessToken = jwt.sign(
		{ username, displayName },
		process.env.ACCESS_TOKEN_SECRET
	);

	res.json({
		status: 'success',
		message: 'User created',
		accessToken,
	});
};

exports.loginController = async (req, res) => {
	const { username, password } = req.body;
	const { user } = await dbOps.Users.get(username);
	if (!user) {
		return res.json({ status: 'error', message: 'Invalid Credentials' });
	}

	console.log('Until here');
	if (!(await bcrypt.compare(password, user.password))) {
		return res.json({ status: 'error', message: 'Invalid Credentials' });
	}

	const accessToken = jwt.sign(
		{ username: user.username, displayName: user.displayName },
		process.env.ACCESS_TOKEN_SECRET
	);

	res.json({
		status: 'success',
		accessToken,
	});
};
