import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
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
	const [totalPosts, setTotalPosts] = useState(0);
	const [activePost, setActivePost] = useState(null);
	const moreMenuRefs = useRef([]);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:3001/posts');
				setPosts(response.data);
				setTotalPosts(response.data.length);

				const postsWithDetails = await Promise.allSettled(
					response.data.map(async (post) => {
						try {
							const userResponse = await axios.get(`http://localhost:3005/users/${post.userId}`, {
								headers: {
									Authorization: `Bearer ${token}`,
								},
							});
							if (userResponse.status === 200) {
								return {
									...post,
									author: userResponse.data.username,
									createdAt: new Date(post.createdAt),
								};
							} else {
								console.error(`User not found: ${post.userId}`);
								return post;
							}
						} catch (userError) {
							console.error(`Error fetching user ${post.userId}`, userError);
							return post;
						}
					}),
				);

				setPosts(postsWithDetails.map((result) => result.value || result.reason));
			} catch (err) {
				console.error('Error fetching posts', err);
			}
		};

		const fetchCurrentUser = async () => {
			const token = localStorage.getItem('token');
			if (token) {
				try {
					const response = await axios.get('http://localhost:3005/profile', {
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

	useEffect(() => {
		moreMenuRefs.current = moreMenuRefs.current.slice(0, posts.length);
	}, [posts]);

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
			const token = localStorage.getItem('token');

			let response;
			if (query.startsWith('@')) {
				response = await axios.get(
					`http://localhost:3001/posts/search/user?q=${encodeURIComponent(query)}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
			} else {
				response = await axios.get(
					`http://localhost:3001/posts/search?q=${encodeURIComponent(query)}`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					},
				);
			}

			const searchResultsWithDetails = await Promise.all(
				response.data.map(async (post) => {
					const userResponse = await axios.get(`http://localhost:3005/users/${post.userId}`, {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					});
					return {
						...post,
						author: userResponse.data.username,
						createdAt: new Date(post.createdAt),
					};
				}),
			);

			setSearchResults(searchResultsWithDetails);
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
		if (!isCreateModalOpen && !isEditModalOpen) {
			const fetchPosts = async () => {
				const response = await axios.get('http://localhost:3001/posts');
				setPosts(response.data);
			};
			fetchPosts();
		}
	}, [isCreateModalOpen, isEditModalOpen]);

	const displayPosts = searchQuery ? searchResults : posts;

	// Функция для форматирования даты
	const formatDate = (date) => {
		const now = new Date();
		const postDate = new Date(date);

		const diffInMilliseconds = now - postDate;
		const diffInSeconds = diffInMilliseconds / 1000;
		const diffInMinutes = diffInSeconds / 60;
		const diffInHours = diffInMinutes / 60;
		const diffInDays = diffInHours / 24;

		if (diffInHours < 24) {
			// Если менее 24 часов назад, показываем часы и минуты
			return `${postDate.getHours().toString().padStart(2, '0')}:${postDate
				.getMinutes()
				.toString()
				.padStart(2, '0')}`;
		} else if (diffInDays < 7) {
			// Если более 24 часов, но менее 7 дней назад, показываем день недели и время
			const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			const dayOfWeek = daysOfWeek[postDate.getDay()];
			return `${dayOfWeek} ${postDate.getHours().toString().padStart(2, '0')}:${postDate
				.getMinutes()
				.toString()
				.padStart(2, '0')}`;
		} else {
			// Если более 7 дней назад, показываем день и месяц без времени
			const formattedDate = postDate.toLocaleDateString('en-GB', {
				day: 'numeric',
				month: 'short',
			});
			return formattedDate;
		}
	};

	const handleMoreClick = (postId) => {
		setActivePost(postId === activePost ? null : postId);
	};

	const closeMoreMenu = (e) => {
		if (!moreMenuRefs.current.some((ref) => ref && ref.contains(e.target))) {
			setActivePost(null);
		}
	};

	useEffect(() => {
		document.addEventListener('click', closeMoreMenu);
		document.addEventListener('scroll', closeMoreMenu);
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				setActivePost(null);
			}
		});

		return () => {
			document.removeEventListener('click', closeMoreMenu);
			document.removeEventListener('scroll', closeMoreMenu);
			document.removeEventListener('keydown', (e) => {
				if (e.key === 'Escape') {
					setActivePost(null);
				}
			});
		};
	}, []);

	return (
		<>
			<Header onSearch={handleSearch} onClearSearch={clearSearchResults} />
			<div className="posts-container">
				<div className="posts-head">
					<h2>
						<i className="fa-solid fa-newspaper"></i> Posts ({totalPosts})
					</h2>
					{currentUser && (
						<div className="add-post">
							<button onClick={openModal}>
								<i className="fa-solid fa-circle-plus"></i>
							</button>
						</div>
					)}
				</div>
				<ul>
					{displayPosts.map((post, index) => (
						<li key={post.id}>
							<div className="post-container">
								<div className="post-content">
									{!currentUser || currentUser.id !== post.userId ? (
										<p className="post-author">
											<i className="fa-regular fa-circle-user"></i> {post.author}
										</p>
									) : (
										<p className="post-author">
											<i className="fa-solid fa-circle-user"></i> Me
										</p>
									)}
									<Link to={`/post/${post.id}`}>
										<div>
											<p className="post-title">{post.title}</p>
											<p className="post-description">{post.content}</p>
										</div>
									</Link>
									{currentUser &&
										(currentUser.id === post.userId || currentUser.role === 'admin') && (
											<div className="more-menu" ref={(el) => (moreMenuRefs.current[index] = el)}>
												<button onClick={() => handleMoreClick(post.id)}>
													<i className="fa-solid fa-ellipsis"></i>
												</button>
												{activePost === post.id && (
													<div className="dropdown-menu">
														<button onClick={() => openEditModal(post)}>
															<i className="fa-solid fa-pen"></i> Edit
														</button>
														<button onClick={() => deletePost(post.id, currentUser.id)}>
															<i className="fa-regular fa-trash-can"></i> Delete
														</button>
													</div>
												)}
											</div>
										)}
									<div className="post-details">
										<p className="post-date">{formatDate(post.createdAt)}</p>
									</div>
								</div>
							</div>
							<hr />
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
