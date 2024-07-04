import axios from 'axios';
import React, { useState } from 'react';

function EditPost({ onClose, post, updatePost }) {
	const [title, setTitle] = useState(post.title);
	const [content, setContent] = useState(post.content);
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('token');
			const response = await axios.put(
				`http://localhost:3001/posts/${post.id}`,
				{
					title,
					content,
					userId: post.userId,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			updatePost(response.data);
			onClose();
		} catch (err) {
			if (err.response) {
				setError(`Failed to update post: ${err.response.data.error}`);
			} else {
				setError('Failed to update post');
			}
		}
	};

	return (
		<div className="create-container">
			<h2>
				<i class="fa-solid fa-pen-to-square"></i> Edit Post
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
				<button type="submit">Update Post</button>
			</form>
		</div>
	);
}

export default EditPost;
