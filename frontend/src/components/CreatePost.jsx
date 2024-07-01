import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [error, setError] = useState('');
	const history = useNavigate();

	const handleCreatePost = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem('token');
		try {
			await axios.post(
				'http://localhost:3001/posts',
				{
					title,
					content,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setTitle('');
			setContent('');
			history.push('/posts');
		} catch (err) {
			setError('Failed to create post');
		}
	};

	return (
		<div>
			<h2>Create Post</h2>
			<form onSubmit={handleCreatePost}>
				<div>
					<label>Title:</label>
					<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
				</div>
				<div>
					<label>Content:</label>
					<textarea value={content} onChange={(e) => setContent(e.target.value)} required />
				</div>
				{error && <p>{error}</p>}
				<button type="submit">Create Post</button>
			</form>
		</div>
	);
}

export default CreatePost;
