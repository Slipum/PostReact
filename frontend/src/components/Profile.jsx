import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import EditPost from './EditPost';
import Modal from './Modal';

function Profile() {
	const [profile, setProfile] = useState(null);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [activePost, setActivePost] = useState(null);
	const [error, setError] = useState('');
	const [currentPost, setCurrentPost] = useState(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const moreMenuRefs = useRef([]);

	const formatDate = (date) => {
		const now = new Date();
		const postDate = new Date(date);

		const diffInMilliseconds = now - postDate;
		const diffInSeconds = diffInMilliseconds / 1000;
		const diffInMinutes = diffInSeconds / 60;
		const diffInHours = diffInMinutes / 60;
		const diffInDays = diffInHours / 24;

		if (diffInHours < 24) {
			return `${postDate.getHours().toString().padStart(2, '0')}:${postDate
				.getMinutes()
				.toString()
				.padStart(2, '0')}`;
		} else if (diffInDays < 7) {
			const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			const dayOfWeek = daysOfWeek[postDate.getDay()];
			return `${dayOfWeek} ${postDate.getHours().toString().padStart(2, '0')}:${postDate
				.getMinutes()
				.toString()
				.padStart(2, '0')}`;
		} else {
			const formattedDate = postDate.toLocaleDateString('en-GB', {
				day: 'numeric',
				month: 'short',
			});
			return formattedDate;
		}
	};

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:3005/profile', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setProfile(response.data);
				setLoading(false);
			} catch (err) {
				setError('Failed to fetch profile');
				setLoading(false);
			}
		};

		const fetchPosts = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await axios.get('http://localhost:3001/posts/mine', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				setPosts(response.data);
			} catch (err) {
				setError('Failed to fetch posts');
			}
		};

		fetchProfile();
		fetchPosts();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem('token');
		setProfile(null);
	};

	const handleMoreClick = (postId) => {
		setActivePost(postId === activePost ? null : postId);
	};

	const closeMoreMenu = (e) => {
		if (!moreMenuRefs.current.some((ref) => ref && ref.contains(e.target))) {
			setActivePost(null);
		}
	};

	const openEditModal = (post) => {
		setCurrentPost(post);
		setIsEditModalOpen(true);
	};

	const closeEditModal = () => {
		setIsEditModalOpen(false);
		setCurrentPost(null);
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

	if (error) {
		return <p>{error}</p>;
	}

	if (loading) {
		return <p>Loading profile...</p>;
	}

	if (!profile) {
		return <Navigate to="/" />;
	}

	return (
		<>
			<div className="profile-cont">
				<div className="h-logo">
					<a href="/">
						<h1>
							<i className="fa-solid fa-caret-left"></i>
						</h1>
					</a>
				</div>
				<div className="back">
					<h2 className="p-user">
						<i className="fa-solid fa-user"></i> {profile.username}
					</h2>
				</div>
				<button onClick={handleLogout}>
					<i className="fa-solid fa-right-from-bracket"></i>
				</button>
			</div>
			<div className="content-list">
				<div className="profile-container">
					<div className="profile-content">
						<p className="p-email">
							<i className="fa-solid fa-envelope"></i> {profile.email}
						</p>
					</div>
					{posts.map((post, index) => (
						<li key={post.id}>
							<div className="post-container">
								<div className="post-content">
									<p className="post-author">
										<i className="fa-solid fa-circle-user"></i> Me
									</p>
									<Link to={`/post/${post.id}`}>
										<div>
											<p className="post-title">{post.title}</p>
											<p className="post-description">{post.content}</p>
										</div>
									</Link>
									<div className="more-menu" ref={(el) => (moreMenuRefs.current[index] = el)}>
										<button onClick={() => handleMoreClick(post.id)}>
											<i className="fa-solid fa-ellipsis"></i>
										</button>
										{activePost === post.id && (
											<div className="dropdown-menu">
												<button onClick={() => openEditModal(post)}>
													<i className="fa-solid fa-pen"></i> Edit
												</button>
												<button onClick={() => deletePost(post.id, profile.id)}>
													<i className="fa-regular fa-trash-can"></i> Delete
												</button>
											</div>
										)}
									</div>
									<div className="post-details">
										<p className="post-date">{formatDate(post.createdAt)}</p>
									</div>
								</div>
							</div>
						</li>
					))}
				</div>
			</div>
			{isEditModalOpen && currentPost && (
				<Modal onClose={closeEditModal}>
					<EditPost onClose={closeEditModal} post={currentPost} updatePost={updatePost} />
				</Modal>
			)}
		</>
	);
}

export default Profile;
