import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
			<h2>Posts</h2>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>{post.title}</li>
				))}
			</ul>
		</div>
	);
}

export default Home;
