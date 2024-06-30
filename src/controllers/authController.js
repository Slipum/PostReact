const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/userModel');

const register = (req, res) => {
	const { username, password } = req.body;

	bcrypt.hash(password, 10, (err, hashedPassword) => {
		if (err) return res.status(500).json({ message: 'Error hashing password' });

		createUser(username, hashedPassword, (err, userId) => {
			if (err) return res.status(500).json({ message: 'Error creating user' });

			const token = jwt.sign({ id: userId }, 'your_jwt_secret', { expiresIn: '1h' });
			res.status(201).json({ token });
		});
	});
};

const login = (req, res) => {
	const { username, password } = req.body;

	findUserByUsername(username, (err, user) => {
		if (err || !user) return res.status(400).json({ message: 'User not found' });

		bcrypt.compare(password, user.password, (err, isMatch) => {
			if (err || !isMatch) return res.status(400).json({ message: 'Invalid credentials' });

			const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
			res.status(200).json({ token });
		});
	});
};

module.exports = { register, login };
