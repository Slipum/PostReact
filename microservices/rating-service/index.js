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
		'CREATE TABLE IF NOT EXISTS ratings (id INTEGER PRIMARY KEY AUTOINCREMENT, postId INTEGER, userId INTEGER, rating INTEGER)',
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

app.post('/ratings', authenticateToken, (req, res) => {
	const { postId, rating } = req.body;
	const userId = req.user.id;
	db.run(
		'INSERT INTO ratings (postId, userId, rating) VALUES (?, ?, ?)',
		[postId, userId, rating],
		function (err) {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			res.status(201).json({ id: this.lastID });
		},
	);
});

app.get('/ratings', (req, res) => {
	db.all('SELECT * FROM ratings', [], (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json(rows);
	});
});

app.post('/posts/:postId/like', authenticateToken, (req, res) => {
	const { postId } = req.params;
	const userId = req.user.id;

	db.get('SELECT * FROM ratings WHERE postId = ? AND userId = ?', [postId, userId], (err, row) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		if (row) {
			db.run(
				'UPDATE ratings SET rating = 1 WHERE postId = ? AND userId = ?',
				[postId, userId],
				function (err) {
					if (err) {
						return res.status(500).json({ error: err.message });
					}
					res.sendStatus(204);
				},
			);
		} else {
			db.run(
				'INSERT INTO ratings (postId, userId, rating) VALUES (?, ?, 1)',
				[postId, userId],
				function (err) {
					if (err) {
						return res.status(500).json({ error: err.message });
					}
					res.sendStatus(204);
				},
			);
		}
	});
});

app.post('/posts/:postId/dislike', authenticateToken, (req, res) => {
	const { postId } = req.params;
	const userId = req.user.id;

	db.get('SELECT * FROM ratings WHERE postId = ? AND userId = ?', [postId, userId], (err, row) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}

		if (row) {
			db.run(
				'UPDATE ratings SET rating = -1 WHERE postId = ? AND userId = ?',
				[postId, userId],
				function (err) {
					if (err) {
						return res.status(500).json({ error: err.message });
					}
					res.sendStatus(204);
				},
			);
		} else {
			db.run(
				'INSERT INTO ratings (postId, userId, rating) VALUES (?, ?, -1)',
				[postId, userId],
				function (err) {
					if (err) {
						return res.status(500).json({ error: err.message });
					}
					res.sendStatus(204);
				},
			);
		}
	});
});

app.get('/posts/:postId/rating', (req, res) => {
	const { postId } = req.params;
	db.get(
		'SELECT SUM(rating) AS totalRating FROM ratings WHERE postId = ?',
		[postId],
		(err, row) => {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			const rating = row ? row.totalRating : 0;
			res.json({ rating });
		},
	);
});

app.listen(3002, () => {
	console.log('Rating Service running on port 3002');
});
