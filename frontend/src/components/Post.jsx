import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Post() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState('');
	const [rating, setRating] = useState(0);
	const [userProfile, setUserProfile] = useState(null);
	const [commentAuthors, setCommentAuthors] = useState({});

	useEffect(() => {
		const fetchPost = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(`http://localhost:3001/posts/${id}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setPost(response.data);
			} catch (error) {
				console.error('Error fetching post:', error);
			}
		};

		const fetchComments = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(`http://localhost:3003/posts/${id}/comments`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setComments(response.data);

				// Запрос и установка авторов комментариев
				const authors = {};
				await Promise.all(
					response.data.map(async (comment) => {
						const author = await fetchUserName(comment.userId);
						authors[comment.id] = author;
					}),
				);
				setCommentAuthors(authors);
			} catch (error) {
				console.error('Error fetching comments:', error);
			}
		};

		const fetchRating = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get(`http://localhost:3002/posts/${id}/rating`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setRating(response.data.rating);
			} catch (error) {
				console.error('Error fetching rating:', error);
			}
		};

		const fetchUserProfile = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:3000/profile', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setUserProfile(response.data);
			} catch (error) {
				console.error('Error fetching user profile:', error);
			}
		};

		fetchPost();
		fetchComments();
		fetchRating();
		fetchUserProfile();
	}, [id]);

	const fetchUserName = async (userId) => {
		try {
			const token = localStorage.getItem('token');
			const response = await axios.get(`http://localhost:3003/users/${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data.username;
		} catch (error) {
			console.error('Error fetching user name:', error);
			return 'Unknown User';
		}
	};

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

			// Обновление списка комментариев после добавления
			const response = await axios.get(`http://localhost:3003/posts/${id}/comments`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setComments(response.data);

			// Обновление авторов комментариев
			const authors = {};
			await Promise.all(
				response.data.map(async (comment) => {
					const author = await fetchUserName(comment.userId);
					authors[comment.id] = author;
				}),
			);
			setCommentAuthors(authors);
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

	if (!post || !userProfile) {
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
					<li key={comment.id}>
						{comment.content} <span className="comment-author">({commentAuthors[comment.id]})</span>
					</li>
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
