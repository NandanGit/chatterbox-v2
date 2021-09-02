const { server } = require('../serverSetup');

const mongoose = require('mongoose');

const MONGODB_URI =
	process.env.NODE_ENV !== 'production'
		? process.env.DEV_MONGODB_URI
		: process.env.PROD_MONGODB_URI;

console.log(process.env.NODE_ENV);

const db = {
	connect() {
		mongoose.connect(`${MONGODB_URI}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		const database = mongoose.connection;
		database.on('error', () => {
			console.log('An error occurred while connecting to database');
		});
		database.once('open', () => {
			const PORT = process.env.PORT || 5000;
			server.listen(PORT, () => {
				console.log(`Server is listening on port ${PORT}`);
			});
			console.log('Successfully connected to the database!!');
		});
	},
};
module.exports = db;
