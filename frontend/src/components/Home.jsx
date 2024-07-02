import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './layout/Header';

function Home() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await axios.get('http://localhost:3001/posts');
			setPosts(response.data);
		};

		fetchPosts();
	}, []);

	return (
		<div>
			<Header />
			<h2>Posts</h2>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<Link to={`/post/${post.id}`}>{post.title}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Home;
