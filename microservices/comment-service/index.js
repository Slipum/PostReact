const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('../database.db');

db.serialize(() => {
	db.run(
		'CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, postId INTEGER, userId INTEGER, content TEXT)',
	);
});

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};

app.post('/comments', authenticateToken, (req, res) => {
	const { postId, content } = req.body;
	const userId = req.user.id;
	db.run(
		'INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)',
		[postId, userId, content],
		function (err) {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			res.status(201).json({ id: this.lastID });
		},
	);
});

app.get('/comments', (req, res) => {
	db.all('SELECT * FROM comments', [], (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json(rows);
	});
});

app.post('/posts/:id/comments', authenticateToken, (req, res) => {
	const { id } = req.params;
	const { content } = req.body;
	const userId = req.user.id;

	db.run(
		'INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)',
		[id, userId, content],
		function (err) {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			res.status(201).json({ id: this.lastID });
		},
	);
});

app.get('/posts/:id/comments', (req, res) => {
	const { id } = req.params;
	db.all('SELECT * FROM comments WHERE postId = ?', [id], (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json(rows);
	});
});

app.listen(3003, () => {
	console.log('Comment Service running on port 3003');
});
