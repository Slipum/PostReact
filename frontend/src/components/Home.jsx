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

	useEffect(() => {
		if (!isCreateModalOpen || !isEditModalOpen) {
			const fetchPosts = async () => {
				const response = await axios.get('http://localhost:3001/posts');
				setPosts(response.data);
			};
			fetchPosts();
		}
	}, [isCreateModalOpen, isEditModalOpen]);

	return (
		<div>
			<Header />
			<div className="add-post">
				<button onClick={openModal}>
					<i className="fa-solid fa-circle-plus"></i>
				</button>
			</div>
			<h2>Posts</h2>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<Link to={`/post/${post.id}`}>{post.title}</Link>
						{currentUser && (currentUser.id === post.userId || currentUser.role === 'admin') && (
							<>
								<button onClick={() => openEditModal(post)}>Edit</button>
								<button onClick={() => deletePost(post.id, currentUser.id)}>Delete</button>
							</>
						)}
					</li>
				))}
			</ul>
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
		</div>
	);
}

export default Home;
