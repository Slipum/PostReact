const sqlite3 = require('sqlite3').verbose();

const initDB = () => {
	const db = new sqlite3.Database('./database.sqlite', (err) => {
		if (err) {
			console.error('Error opening database', err.message);
		} else {
			console.log('Connected to SQLite database');
			db.run(
				`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )`,
				(err) => {
					if (err) {
						console.error('Error creating users table', err.message);
					}
				},
			);
		}
	});
};

module.exports = { initDB };
