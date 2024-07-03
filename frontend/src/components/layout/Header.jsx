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
					<h1>
						<i class="fa-brands fa-react"></i>PostReact
					</h1>
				</a>
			</div>
			<div className="search-wrapper">
				<div className="search-container">
					{window.location.pathname === '/' && (
						<>
							<div className="find-container">
								<i class="fa-solid fa-magnifying-glass"></i>
							</div>
							<input
								type="text"
								placeholder="Search PostReact"
								value={searchQuery}
								onChange={handleSearchChange}
							/>
							{searchQuery && (
								<button onClick={handleClearSearch}>
									<i class="fa-regular fa-circle-xmark"></i>
								</button>
							)}
						</>
					)}
				</div>
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
