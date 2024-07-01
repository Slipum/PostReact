import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const history = useHistory();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			await axios.post('http://localhost:3000/register', {
				username,
				password,
			});
			history.push('/login');
		} catch (err) {
			setError('Registration failed');
		}
	};

	return (
		<div>
			<h2>Register</h2>
			<form onSubmit={handleRegister}>
				<div>
					<label>Username:</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Password:</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				{error && <p>{error}</p>}
				<button type="submit">Register</button>
			</form>
		</div>
	);
}

export default Register;
