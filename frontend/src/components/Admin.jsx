import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Admin() {
	const [users, setUsers] = useState([]);
	const [posts, setPosts] = useState([]);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:3004/users', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setUsers(response.data);
			} catch (err) {
				setError('Failed to fetch users');
			}
		};

		const fetchPosts = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:3004/posts', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setPosts(response.data);
			} catch (err) {
				setError('Failed to fetch posts');
			}
		};

		fetchUsers();
		fetchPosts();
	}, []);

	const handleDeletePost = async (postId) => {
		try {
			const token = localStorage.getItem('token');
			await axios.delete(`http://localhost:3004/posts/${postId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setPosts(posts.filter((post) => post.id !== postId));
		} catch (err) {
			console.error('Error deleting post', err);
			setError('Failed to delete post');
		}
	};

	return (
		<div>
			<h2>Admin Panel</h2>
			<div>
				<h3>Registered Users</h3>
				<ul>
					{users.map((user) => (
						<li key={user.id}>{user.username}</li>
					))}
				</ul>
			</div>
			<div>
				<h3>Posts</h3>
				{error && <p>{error}</p>}
				<ul>
					{posts.map((post) => (
						<li key={post.id}>
							<p>{post.title}</p>
							<button onClick={() => handleDeletePost(post.id)}>Delete</button>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default Admin;
