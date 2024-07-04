import axios from 'axios';
import React, { useState } from 'react';

function CreatePost({ onClose, addPost }) {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('token');
			const response = await axios.post(
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
			addPost(response.data);
			onClose();
		} catch (err) {
			if (err.response) {
				setError(`Failed to create post: ${err.response.data.error}`);
			} else {
				setError('Failed to create post');
			}
		}
	};

	return (
		<div className="create-container">
			<h2>
				<i className="fa-regular fa-clipboard"></i> Create Post
			</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<input
						placeholder="Title"
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
				</div>
				<div className="text-content">
					<textarea
						placeholder="Content"
						value={content}
						onChange={(e) => setContent(e.target.value)}
						required
					/>
				</div>
				{error && <p>{error}</p>}
				<button type="submit">Create Post</button>
			</form>
		</div>
	);
}

export default CreatePost;
