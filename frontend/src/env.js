const configureEnvironment = (environment = 'production') => {
	const variables = {
		APP_NAME: 'ChatterBox',
		ENV: environment,
	};
	variables.HOST_URL =
		environment === 'production'
			? 'http://localhost:5000'
			: 'http://localhost:5000';
	return { variables };
};

const env = configureEnvironment('development');

export default env;
