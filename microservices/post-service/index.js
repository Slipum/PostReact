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
		'CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, userId INTEGER)',
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

app.put('/posts/:id', authenticateToken, (req, res) => {
	const { id } = req.params;
	const { title, content } = req.body;
	const userId = req.user.id;
	const userRole = req.user.role;

	if (userRole === 'admin' || userId === req.body.userId) {
		db.run(
			'UPDATE posts SET title = ?, content = ? WHERE id = ?',
			[title, content, id],
			function (err) {
				if (err) {
					return res.status(500).json({ error: err.message });
				}
				if (this.changes === 0) {
					return res.status(404).json({ error: 'Post not found' });
				}
				res.status(200).json({ id, title, content });
			},
		);
	} else {
		res.status(403).json({ error: 'Unauthorized' });
	}
});

app.delete('/posts/:id', authenticateToken, (req, res) => {
	const { id } = req.params;
	const userRole = req.user.role;
	const userId = req.user.id;

	if (userRole === 'admin' || userId === req.body.userId) {
		db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
			if (err) {
				return res.status(500).json({ error: err.message });
			}
			if (this.changes === 0) {
				return res.status(404).json({ error: 'Post not found' });
			}
			res.status(204).send();
		});
	} else {
		res.status(403).json({ error: 'Unauthorized' });
	}
});

app.get('/posts/:id', (req, res) => {
	const postId = req.params.id;
	db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, row) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		if (!row) {
			return res.status(404).json({ error: 'Post not found' });
		}
		res.json(row);
	});
});

app.get('/posts', (req, res) => {
	db.all('SELECT * FROM posts', [], (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json(rows);
	});
});

app.listen(3001, () => {
	console.log('Post Service running on port 3001');
});
