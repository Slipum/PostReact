import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			await axios.post('http://localhost:3000/register', {
				username,
				password,
			});
			navigate('/login');
		} catch (err) {
			if (err.response) {
				setError(`Registration failed: ${err.response.data.error}`);
			} else if (err.request) {
				setError('Registration failed: No response from server');
			} else {
				setError(`Registration failed: ${err.message}`);
			}
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
