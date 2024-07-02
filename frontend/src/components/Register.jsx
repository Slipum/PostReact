import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post('http://localhost:3000/register', {
				username,
				password,
				email,
			});
			localStorage.setItem('token', response.data.token);
			navigate('/');
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
		<div className="auntification">
			<div className="auth-container">
				<form onSubmit={handleRegister}>
					<h2>Auth</h2>
					<p className="auth-title">Create an account</p>
					<div className="form-controll">
						<label>Username:</label>
						<input
							type="text"
							value={username}
							placeholder="user_name"
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</div>
					<div className="form-controll">
						<label>Email:</label>
						<input
							type="email"
							value={email}
							placeholder="example@example.com"
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className="form-controll">
						<label>Password:</label>
						<input
							type="password"
							value={password}
							placeholder="••••••"
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{error && <p className="error">{error}</p>}
					<button type="submit">Create an account</button>
					<div className="quest">
						<a href="/login">Alredy have an account?</a>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Register;
