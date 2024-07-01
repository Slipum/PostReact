import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';
import reportWebVitals from './reportWebVitals';

axios.defaults.baseURL = 'http://localhost:3000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
reportWebVitals();
