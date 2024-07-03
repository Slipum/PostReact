import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './Header.css';

function Header({ onSearch, onClearSearch }) {
	const [profile, setProfile] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');

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

	const handleSearchChange = (e) => {
		const query = e.target.value;
		setSearchQuery(query);
		onSearch(query);
	};

	const handleClearSearch = () => {
		setSearchQuery('');
		onClearSearch();
	};

	return (
		<header className="header-container">
			<div className="h-logo">
				<a href="/">
					<h1>PostReact</h1>
				</a>
			</div>
			<div className="search-container">
				{window.location.pathname === '/' && (
					<div>
						<input
							type="text"
							placeholder="Search posts or users"
							value={searchQuery}
							onChange={handleSearchChange}
						/>
						<button onClick={handleClearSearch}>Clear</button>
					</div>
				)}
			</div>
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
