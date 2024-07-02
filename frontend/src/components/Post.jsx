import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Post() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [rating, setRating] = useState(0);

	useEffect(() => {
		const fetchPost = async () => {
			const token = localStorage.getItem('token');
			const response = await axios.get(`http://localhost:3001/posts/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setPost(response.data);
		};

		const fetchComments = async () => {
			const token = localStorage.getItem('token');
			const response = await axios.get(`http://localhost:3003/posts/${id}/comments`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setComments(response.data);
		};

		const fetchRating = async () => {
			const token = localStorage.getItem('token');
			const response = await axios.get(`http://localhost:3002/posts/${id}/rating`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setRating(response.data.rating);
		};

		fetchPost();
		fetchComments();
		fetchRating();
	}, [id]);

	const handleAddComment = async (e) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem('token');
			await axios.post(
				`http://localhost:3003/posts/${id}/comments`,
				{ content: newComment },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setNewComment('');
			const response = await axios.get(`http://localhost:3003/posts/${id}/comments`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setComments(response.data);
		} catch (err) {
			console.error('Error adding comment', err);
		}
	};

	const handleLike = async () => {
		try {
			const token = localStorage.getItem('token');
			await axios.post(
				`http://localhost:3002/posts/${id}/like`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			const response = await axios.get(`http://localhost:3002/posts/${id}/rating`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setRating(response.data.rating);
		} catch (err) {
			console.error('Error liking post', err);
		}
	};

	const handleDislike = async () => {
		try {
			const token = localStorage.getItem('token');
			await axios.post(
				`http://localhost:3002/posts/${id}/dislike`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			const response = await axios.get(`http://localhost:3002/posts/${id}/rating`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setRating(response.data.rating);
		} catch (err) {
			console.error('Error disliking post', err);
		}
	};

	if (!post) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h2>{post.title}</h2>
			<p>{post.content}</p>
			<p>Rating: {rating}</p>
			<button onClick={handleLike}>Like</button>
			<button onClick={handleDislike}>Dislike</button>
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
