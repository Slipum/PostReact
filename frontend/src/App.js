import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import About from './components/About.jsx';
import Admin from './components/Admin.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Post from './components/Post.jsx';
import Profile from './components/Profile.jsx';
import Register from './components/Register.jsx';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/admin" element={<Admin />} />
				<Route path="/post/:id" element={<Post />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/about" element={<About />} />
			</Routes>
		</Router>
	);
}

export default App;
