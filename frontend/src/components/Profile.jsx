import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function Profile() {
	const [profile, setProfile] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

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
				setLoading(false);
			} catch (err) {
				setError('Failed to fetch profile');
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem('token');
		setProfile(null);
	};

	if (error) {
		return <p>{error}</p>;
	}

	if (loading) {
		return <p>Loading profile...</p>;
	}

	if (!profile) {
		return <Navigate to="/" />;
	}

	return (
		<>
			<div className="profile-cont">
				<div className="h-logo">
					<a href="/">
						<h1>
							<i class="fa-solid fa-caret-left"></i>
						</h1>
					</a>
				</div>
				<div className="back">
					<h2 className="p-user">
						<i class="fa-solid fa-user"></i> {profile.username}
					</h2>
				</div>
				<button onClick={handleLogout}>
					<i class="fa-solid fa-right-from-bracket"></i>
				</button>
			</div>
			<div className="profile-container">
				<div className="profile-content">
					<p className="p-email">
						<i class="fa-solid fa-envelope"></i> {profile.email}
					</p>
				</div>
			</div>
		</>
	);
}

export default Profile;
