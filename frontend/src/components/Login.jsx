import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post('http://localhost:3000/login', {
				email,
				password,
			});
			localStorage.setItem('token', response.data.token);
			navigate('/');
		} catch (err) {
			setError('Invalid credentials');
		}
	};

	return (
		<div className="auntification">
			<div className="auth-container">
				<form onSubmit={handleLogin}>
					<h2>Auth</h2>
					<p>Welcome back</p>
					<div className="form-controll">
						<label>Email:</label>
						<input
							type="text"
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
					{error && <p>{error}</p>}
					<button type="submit">Login</button>
					<div className="quest">
						<a href="/register">Don't have an account?</a>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
