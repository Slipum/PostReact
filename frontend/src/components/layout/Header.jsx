import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Header.css';

function Header() {
	const [profile, setProfile] = useState(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:3000/profile', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setProfile(response.data);
			} catch (error) {
				setProfile(null);
			}
		};

		fetchProfile();
	}, []);

	return (
		<header className="header-container">
			<div className="h-logo">
				<a href="/">
					<h1>PostReact</h1>
				</a>
			</div>
			<nav className="h-nav">
				<ul>
					<li>
						<a href="/">Home</a>
					</li>
					<li>
						<a href="/about">About us</a>
					</li>
				</ul>
			</nav>
			<div className="h-auth">
				{profile ? (
					<>
						{profile.username === 'admin' ? (
							<a className="goto" href="/admin">
								Admin
							</a>
						) : null}
						<a className="goto" href="/profile">
							Profile: {profile.username}
						</a>
					</>
				) : (
					<>
						<a className="h-login" href="/login">
							Login
						</a>
						<a className="h-register" href="/register">
							Register
						</a>
					</>
				)}
			</div>
		</header>
	);
}

export default Header;
