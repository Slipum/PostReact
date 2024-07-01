const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config({ path: '../../.env' });

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
	db.run(
		'CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, role TEXT)',
	);

	// Тестовый пользователь
	const username = 'test';
	const password = bcrypt.hashSync('test', 10);
	db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [
		username,
		password,
		'user',
	]);
});

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({ error: 'Access token not found' });
	}

	jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
		if (err) {
			return res.status(403).json({ error: 'Invalid token' });
		}
		req.user = user;
		next();
	});
}

app.post('/register', (req, res) => {
	const { username, password } = req.body;
	const hashedPassword = bcrypt.hashSync(password, 10);
	db.run(
		'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
		[username, hashedPassword, 'user'],
		function (err) {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			res.status(201).json({ id: this.lastID });
		},
	);
});

app.post('/login', (req, res) => {
	const { username, password } = req.body;
	db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		if (!user || !bcrypt.compareSync(password, user.password)) {
			return res.status(401).json({ error: 'Invalid credentials' });
		}
		const token = jwt.sign(
			{ id: user.id, username: user.username, role: user.role },
			process.env.SECRET_KEY,
			{ expiresIn: '1h' },
		);
		res.json({ token });
	});
});

app.post('/posts', authenticateToken, (req, res) => {
	const { title, content } = req.body;
	const userId = req.user.id;
	db.run(
		'INSERT INTO posts (title, content, userId) VALUES (?, ?, ?)',
		[title, content, userId],
		function (err) {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			res.status(201).json({ id: this.lastID });
		},
	);
});

app.listen(3000, () => {
	console.log('Auth Service running on port 3000');
});
