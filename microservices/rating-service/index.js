const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config({ path: '../../.env' });

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
	db.run(
		'CREATE TABLE ratings (id INTEGER PRIMARY KEY AUTOINCREMENT, postId INTEGER, userId INTEGER, rating INTEGER)',
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

app.get('/posts/:postId/rating', (req, res) => {
	const { postId } = req.params;
	db.get('SELECT * FROM ratings WHERE postId = ?', [postId], (err, row) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json({ rating: row ? row.rating : 0 });
	});
});

app.post('/posts/:postId/like', (req, res) => {
	const { postId } = req.params;
	db.run('INSERT OR REPLACE INTO ratings (postId, rating) VALUES (?, 1)', [postId], function (err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.sendStatus(204);
	});
});

app.post('/posts/:postId/dislike', (req, res) => {
	const { postId } = req.params;
	db.run(
		'INSERT OR REPLACE INTO ratings (postId, rating) VALUES (?, -1)',
		[postId],
		function (err) {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			res.sendStatus(204);
		},
	);
});

app.listen(3002, () => {
	console.log('Rating Service running on port 3002');
});
