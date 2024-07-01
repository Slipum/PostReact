import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Profile() {
	const [profile, setProfile] = useState(null);
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
			} catch (err) {
				setError('Failed to fetch profile');
			}
		};

		fetchProfile();
	}, []);

	if (error) {
		return <p>{error}</p>;
	}

	if (!profile) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			<h2>Profile</h2>
			<p>Username: {profile.username}</p>
			<p>Role: {profile.role}</p>
		</div>
	);
}

export default Profile;
