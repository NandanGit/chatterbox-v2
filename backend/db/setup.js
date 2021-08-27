const { server } = require('../serverSetup');

const mongoose = require('mongoose');

const db = {
	connect() {
		mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`, {
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
