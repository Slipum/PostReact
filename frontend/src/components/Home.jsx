import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CreatePost from './CreatePost';
import EditPost from './EditPost';
import Header from './layout/Header';
import Modal from './Modal';

function Home() {
	const [posts, setPosts] = useState([]);
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [currentPost, setCurrentPost] = useState(null);
	const [currentUser, setCurrentUser] = useState(null);
	const [searchResults, setSearchResults] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await axios.get('http://localhost:3001/posts');
			setPosts(response.data);
		};

		const fetchCurrentUser = async () => {
			const token = localStorage.getItem('token');
			if (token) {
				try {
					const response = await axios.get('http://localhost:3000/profile', {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					setCurrentUser(response.data);
				} catch (err) {
					console.error('Error fetching current user', err);
				}
			}
		};

		fetchCurrentUser();
		fetchPosts();
	}, []);

	const openModal = () => {
		setIsCreateModalOpen(true);
	};

	const closeModal = () => {
		setIsCreateModalOpen(false);
	};

	const openEditModal = (post) => {
		setCurrentPost(post);
		setIsEditModalOpen(true);
	};

	const closeEditModal = () => {
		setIsEditModalOpen(false);
		setCurrentPost(null);
	};

	const addPost = (newPost) => {
		setPosts((prevPosts) => [newPost, ...prevPosts]);
	};

	const updatePost = (updatedPost) => {
		setPosts((prevPosts) =>
			prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
		);
	};

	const deletePost = async (postId, userId) => {
		try {
			const token = localStorage.getItem('token');
			await axios.delete(`http://localhost:3001/posts/${postId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				data: {
					userId: userId,
				},
			});
			setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
		} catch (err) {
			console.error('Error deleting post', err);
		}
	};

	const handleSearch = async (query) => {
		try {
			let response;
			if (query.startsWith('@')) {
				response = await axios.get(
					`http://localhost:3001/posts/search/user?q=${encodeURIComponent(query)}`,
				);
			} else {
				response = await axios.get(
					`http://localhost:3001/posts/search?q=${encodeURIComponent(query)}`,
				);
			}
			setSearchResults(response.data);
		} catch (err) {
			console.error('Error searching posts', err);
		}
		setSearchQuery(query);
	};

	const clearSearchResults = () => {
		setSearchResults([]);
		setSearchQuery('');
	};

	useEffect(() => {
		if (!isCreateModalOpen || !isEditModalOpen) {
			const fetchPosts = async () => {
				const response = await axios.get('http://localhost:3001/posts');
				setPosts(response.data);
			};
			fetchPosts();
		}
	}, [isCreateModalOpen, isEditModalOpen]);

	const displayPosts = searchQuery ? searchResults : posts;

	return (
		<>
			<Header onSearch={handleSearch} onClearSearch={clearSearchResults} />
			<div className="posts-container">
				<div className="posts-head">
					<h2>Posts</h2>
					{currentUser && (
						<div className="add-post">
							<button onClick={openModal}>
								<i className="fa-solid fa-circle-plus"></i>
							</button>
						</div>
					)}
				</div>
				<ul>
					{displayPosts.map((post) => (
						<li key={post.id}>
							<Link to={`/post/${post.id}`}>
								<div className="post-container">
									<div className="post-content">
										<p className="post-title">{post.title}</p>
										<p className="post-description">{post.content}</p>
									</div>
									<hr />
								</div>
							</Link>

							{currentUser && (currentUser.id === post.userId || currentUser.role === 'admin') && (
								<>
									<button onClick={() => openEditModal(post)}>Edit</button>
									<button onClick={() => deletePost(post.id, currentUser.id)}>Delete</button>
								</>
							)}
						</li>
					))}
				</ul>
			</div>
			{isCreateModalOpen && (
				<Modal onClose={closeModal}>
					<CreatePost onClose={closeModal} addPost={addPost} />
				</Modal>
			)}
			{isEditModalOpen && currentPost && (
				<Modal onClose={closeEditModal}>
					<EditPost onClose={closeEditModal} post={currentPost} updatePost={updatePost} />
				</Modal>
			)}
		</>
	);
}

export default Home;
