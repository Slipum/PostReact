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
		'CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, role TEXT)',
	);
	db.run(
		'CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, userId INTEGER)',
	);
});

const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (token == null) return res.sendStatus(401);

	jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
		if (err) return res.sendStatus(403);
		if (user.role !== 'admin') return res.sendStatus(403);
		req.user = user;
		next();
	});
};

app.get('/users', authenticateToken, (req, res) => {
	db.all('SELECT id, username, role FROM users', [], (err, rows) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.json(rows);
	});
});

app.delete('/posts/:id', authenticateToken, (req, res) => {
	const postId = req.params.id;
	db.run('DELETE FROM posts WHERE id = ?', [postId], function (err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.status(204).end();
	});
});

app.listen(3004, () => {
	console.log('Admin Service running on port 3004');
});
