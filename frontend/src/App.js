import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Admin from './components/Admin.jsx';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Post from './components/Post.jsx';
import Register from './components/Register.jsx';

function App() {
	return (
		<Router>
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/login" component={Login} />
				<Route path="/register" component={Register} />
				<Route path="/admin" component={Admin} />
				<Route path="/post/:id" component={Post} />
			</Switch>
		</Router>
	);
}

export default App;
