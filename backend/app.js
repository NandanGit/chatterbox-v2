// require('dotenv').config();

// App and server
const { app, server } = require('./serverSetup');

// connect to database
const db = require('./db/setup');
db.connect();

// Import db operations
const dbOps = require('./db/operations');
