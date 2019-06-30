const DBSQLite = require('./db_sqlite.js');
const RWPServer = require('./server.js');

// TODO: db for 1 session only
const db = new DBSQLite(':memory:');
const server = new RWPServer(3333, db);
server.serve();

