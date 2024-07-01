import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Post() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');

	useEffect(() => {
		const fetchPost = async () => {
			const response = await axios.get(`http://localhost:3001/posts/${id}`);
			setPost(response.data);
		};

		const fetchComments = async () => {
			const response = await axios.get(`http://localhost:3003/posts/${id}/comments`);
			setComments(response.data);
		};

		fetchPost();
		fetchComments();
	}, [id]);

	const handleAddComment = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`http://localhost:3003/posts/${id}/comments`, { content: newComment });
			setNewComment('');
			const response = await axios.get(`http://localhost:3003/posts/${id}/comments`);
			setComments(response.data);
		} catch (err) {
			console.error('Error adding comment', err);
		}
	};

	if (!post) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h2>{post.title}</h2>
			<p>{post.content}</p>
			<h3>Comments</h3>
			<ul>
				{comments.map((comment) => (
					<li key={comment.id}>{comment.content}</li>
				))}
			</ul>
			<form onSubmit={handleAddComment}>
				<div>
					<label>New Comment:</label>
					<textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} required />
				</div>
				<button type="submit">Add Comment</button>
			</form>
		</div>
	);
}

export default Post;
