import axios from 'axios';
import React, { useEffect, useState } from 'react';

function Admin() {
	const [users, setUsers] = useState([]);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await axios.get('http://localhost:3004/users');
			setUsers(response.data);
		};

		const fetchPosts = async () => {
			const response = await axios.get('http://localhost:3004/posts');
			setPosts(response.data);
		};

		fetchUsers();
		fetchPosts();
	}, []);

	const handleDeletePost = async (postId) => {
		try {
			await axios.delete(`http://localhost:3004/posts/${postId}`);
			setPosts(posts.filter((post) => post.id !== postId));
		} catch (err) {
			console.error('Error deleting post', err);
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
