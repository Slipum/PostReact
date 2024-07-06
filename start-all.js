const concurrently = require('concurrently');

concurrently(
	[
		{
			command: 'cd ./microservices/auth-service && nodemon index.js',
			name: 'auth-service',
			prefixColor: 'blue',
		},
		{
			command: 'cd ./microservices/post-service && nodemon index.js',
			name: 'post-service',
			prefixColor: 'green',
		},
		{
			command: 'cd ./microservices/rating-service && nodemon index.js',
			name: 'rating-service',
			prefixColor: 'magenta',
		},
		{
			command: 'cd ./microservices/comment-service && nodemon index.js',
			name: 'comment-service',
			prefixColor: 'cyan',
		},
		{
			command: 'cd ./microservices/admin-service && nodemon index.js',
			name: 'admin-service',
			prefixColor: 'yellow',
		},
		{ command: 'cd ./frontend && npm start', name: 'frontend', prefixColor: 'red' },
	],
	{
		prefix: 'name',
		killOthers: ['failure', 'success'],
		restartTries: 3,
	},
	(error, exitCode) => {
		if (error) {
			console.error('One of the services failed to start', error);
		} else {
			console.log('All services started successfully');
		}
	},
);
