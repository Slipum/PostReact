import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './components/About.jsx';
import Admin from './components/Admin.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import NotFound from './components/NotFound.jsx';
import Post from './components/Post.jsx';
import Profile from './components/Profile.jsx';
import Register from './components/Register.jsx';

function App() {
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
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				{profile && profile.role === 'admin' && <Route path="/admin" element={<Admin />} />}
				<Route path="/post/:id" element={<Post />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/about" element={<About />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
}

export default App;
