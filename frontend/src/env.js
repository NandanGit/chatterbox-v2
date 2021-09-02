const configureEnvironment = (environment = 'production') => {
	const variables = {
		APP_NAME: 'ChatterBox',
		ENV: environment,
	};
	variables.HOST_URL =
		environment === 'production'
			? 'https://chatterbox-v2-backend.herokuapp.com'
			: 'http://localhost:5000';
	return { variables };
};

const env = configureEnvironment('production');
console.log(env.variables.HOST_URL);

export default env;
