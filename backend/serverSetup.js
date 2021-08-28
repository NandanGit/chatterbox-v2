const express = require('express');
const morgan = require('morgan');
const http = require('http');

// Import Routes
const {
	authRoutes,
	// dbSandboxRoutes, // Temporary routes
} = require('./routes');

// Express setup
const app = express();

// Express middleware
app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
	app.use(morgan('dev'));
}

// Mount Routes
app.use('/', authRoutes);
// app.use('/db', dbSandboxRoutes); // VERY VERY DANGEROUS!!! (IMMEDIATELY REMOVE AFTER TESTING)

const server = http.createServer(app);

module.exports = {
	server,
	app,
};

// SocketSetup
require('./socketServer');
