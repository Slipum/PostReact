const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const createUser = (username, password, callback) => {
	db.run(
		`INSERT INTO users (username, password) VALUES (?, ?)`,
		[username, password],
		function (err) {
			callback(err, this.lastID);
		},
	);
};

const findUserByUsername = (username, callback) => {
	db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
		callback(err, row);
	});
};

module.exports = { createUser, findUserByUsername };
