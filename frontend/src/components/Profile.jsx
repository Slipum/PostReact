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
		<div>
			<h2>Profile</h2>
			<p>Username: {profile.username}</p>
			<p>Email: {profile.email}</p>
			<p>Role: {profile.role}</p>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}

export default Profile;
