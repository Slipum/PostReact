import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	// Состояния для валидации
	const [usernameError, setUsernameError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [emailError, setEmailError] = useState('');

	// Состояния для отслеживания первого фокуса на input
	const [usernameTouched, setUsernameTouched] = useState(false);
	const [passwordTouched, setPasswordTouched] = useState(false);
	const [emailTouched, setEmailTouched] = useState(false);

	// Функция для валидации формы
	const validateForm = useCallback(() => {
		let valid = true;

		// Проверка имени пользователя
		if (username.length < 3) {
			setUsernameError('Username must be at least 3 characters');
			valid = false;
		} else {
			setUsernameError('');
		}

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
	}, [username, password, email]);

	// Проверка полей при изменении значений
	useEffect(() => {
		validateForm();
	}, [username, password, email, validateForm]);

	const handleRegister = async (e) => {
		e.preventDefault();
		// Проверка введённых данных перед отправкой на сервер
		if (!validateForm()) {
			return;
		}
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
			<div className="icon-container">
				<a href="/">
					<i className="fa-solid fa-arrow-left"></i>
				</a>
			</div>
			<div className="auth-container">
				<form onSubmit={handleRegister} noValidate>
					<h2>Auth</h2>
					<p className="auth-title">Create an account</p>
					<div className="form-controll">
						<label
							className={`form-label ${
								usernameTouched ? (usernameError === '' ? 'fvalid' : 'finvalid') : ''
							}`}>
							Username
						</label>
						<input
							className={`form-input ${
								usernameTouched ? (usernameError === '' ? 'valid' : 'invalid') : ''
							}`}
							type="text"
							value={username}
							placeholder="username"
							onChange={(e) => setUsername(e.target.value)}
							onBlur={() => setUsernameTouched(true)}
							required
						/>
						{usernameTouched &&
							(usernameError === '' ? (
								<i className="fa-solid fa-circle-check"></i>
							) : (
								<i className="fa-solid fa-circle-xmark"></i>
							))}
					</div>
					<p
						className={`error-message ${
							usernameTouched && usernameError !== '' ? 'visibality-er' : 'hidden-er'
						}`}>
						{usernameError}
					</p>
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
								<i className="fa-solid fa-circle-xmark"></i>
							))}
					</div>
					<p
						className={`error-message ${
							emailTouched && emailError !== '' ? 'visibality-er' : 'hidden-er'
						}`}>
						{emailError}
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
								<i className="fa-solid fa-circle-xmark"></i>
							))}
					</div>
					<p
						className={`error-message ${
							passwordTouched && passwordError !== '' ? 'visibality-er' : 'hidden-er'
						}`}>
						{passwordError}
					</p>
					{error && <p className="error">{error}</p>}
					<button type="submit">Create an account</button>
					<div className="quest">
						<p>
							Alredy have an <a href="/login">account?</a>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Register;
