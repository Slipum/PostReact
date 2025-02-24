import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	// Состояния для валидации
	const [passwordError, setPasswordError] = useState('');
	const [emailError, setEmailError] = useState('');

	// Состояния для отслеживания первого фокуса на input
	const [passwordTouched, setPasswordTouched] = useState(false);
	const [emailTouched, setEmailTouched] = useState(false);

	// Функция для валидации формы
	const validateForm = useCallback(() => {
		let valid = true;

		// Проверка пароля
		if (password.length < 8) {
			setPasswordError('Password must be at least 8 characters');
			valid = false;
		} else {
			setPasswordError('');
		}

		// Проверка email
		if (!/\S+@\S+\.\S+/.test(email)) {
			setEmailError('Invalid email format');
			valid = false;
		} else {
			setEmailError('');
		}

		return valid;
	}, [password, email]);

	// Проверка полей при изменении значений
	useEffect(() => {
		validateForm();
	}, [password, email, validateForm]);

	const handleLogin = async (e) => {
		e.preventDefault();
		if (!validateForm()) {
			return;
		}
		try {
			const response = await axios.post('http://localhost:3005/login', {
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
			<div className="icon-container">
				<a href="/">
					<i className="fa-solid fa-arrow-left"></i>
				</a>
			</div>
			<div className="auth-container">
				<form onSubmit={handleLogin} noValidate>
					<h2>Auth</h2>
					<p className="auth-title">Welcome back</p>
					<div className="form-controll">
						<label
							className={`form-label ${
								emailTouched ? (emailError === '' ? 'fvalid' : 'finvalid') : ''
							}`}>
							Email
						</label>
						<input
							className={`form-input ${
								emailTouched ? (emailError === '' ? 'valid' : 'invalid') : ''
							}`}
							type="email"
							value={email}
							placeholder="example@example.com"
							onChange={(e) => setEmail(e.target.value)}
							onBlur={() => setEmailTouched(true)}
							required
						/>
						{emailTouched &&
							(emailError === '' ? (
								<i className="fa-solid fa-circle-check"></i>
							) : (
								<i className="fa-solid fa-circle-xmark fa-cx"></i>
							))}
					</div>
					<p
						className={`error-message ${
							emailTouched && emailError !== '' ? 'visibality-er' : 'hidden-er'
						}`}>
						{emailError}
						{emailError === '' && <p className="hidden-er">Correct</p>}
					</p>
					<div className="form-controll">
						<label
							className={`form-label ${
								passwordTouched ? (passwordError === '' ? 'fvalid' : 'finvalid') : ''
							}`}>
							Password
						</label>
						<input
							className={`form-input ${
								passwordTouched ? (passwordError === '' ? 'valid' : 'invalid') : ''
							}`}
							type="password"
							value={password}
							placeholder="••••••••"
							onChange={(e) => setPassword(e.target.value)}
							onBlur={() => setPasswordTouched(true)}
							required
						/>
						{passwordTouched &&
							(passwordError === '' ? (
								<i className="fa-solid fa-circle-check"></i>
							) : (
								<i className="fa-solid fa-circle-xmark fa-cx"></i>
							))}
					</div>
					<p
						className={`error-message ${
							passwordTouched && passwordError !== '' ? 'visibality-er' : 'hidden-er'
						}`}>
						{passwordError}
						{passwordError === '' && <p className="hidden-er">Correct</p>}
					</p>
					{error && <p className="error">{error}</p>}
					<button type="submit">Login</button>
					<div className="quest">
						<p>
							Don't have an <a href="/register">account?</a>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Login;
