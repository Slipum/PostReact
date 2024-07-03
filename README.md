## Project "PostReact"

- :ru: [Russian Documentation](./lang-docs/ru.md) - Documentation in Russian.

### Project Description

This project is a web application that allows users to publish content, rate posts, search, comment, upvote/downvote, and includes an admin panel for user management and post deletion. The application utilizes a microservices architecture and can be deployed locally using Docker.

### Functionality

- **Publishing Content**: Users can create and edit posts.
- **Rating System**: Users can like and dislike posts.
- **Search**: Ability to search posts by keywords and users by username.
- **Comments**: Users can leave comments on posts.
- **Upvote/Downvote System**: Users can vote for or against posts.
- **Admin Panel**: Administrators can manage users and delete posts.

### Technologies

- ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat) Frontend library for building user interfaces.
- ![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white&style=flat) Backend framework for building web applications and APIs.
- ![SQLite](https://img.shields.io/badge/-SQLite-003B57?logo=sqlite&logoColor=white&style=flat) Lightweight relational database.
- ![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white&style=flat) Platform for developing, shipping, and running applications in containers.
- ![Nginx](https://img.shields.io/badge/-Nginx-339933?logo=nginx&logoColor=white&style=flat) Web server for proper request redirection.
- ![JWT](https://img.shields.io/badge/-JWT-000000?logo=json-web-tokens&logoColor=white&style=flat) Standard for creating access tokens.
- ![bcrypt](https://img.shields.io/badge/-bcrypt-003A70?logo=shield&logoColor=white&style=flat) Library for hashing passwords.
- ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat) JavaScript runtime environment outside the browser.
- ![Axios](https://img.shields.io/badge/-Axios-671DD7?logo=axios&logoColor=white&style=flat) Library for making HTTP requests.

### Installation and Running the Project

1. **Clone the repository**

   ```bash
   git clone https://github.com/Slipum/PostReact.git
   cd PostReact
   ```

2. **Setup Environment**

   Edit the `.env` file in the project's root directory and replace the following environment variables:

   ```plaintext
   SECRET_KEY=your_secret_key
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=123098
   ```

3. **Run Docker Containers**

   Make sure you have Docker and Docker Compose installed. Then run the following command:

   ```bash
   docker-compose up --build
   ```

4. **Open the Application**

   Open your browser and go to `http://localhost:3000`.

### Project Structure

- **frontend**: Directory containing frontend code in React.
- **services**: Directory containing microservices code (comments, ratings, etc.).
- **docker-compose.yml**: Docker Compose configuration file.
- **Dockerfile**: Dockerfile for creating containers.

### Endpoints

#### Auth Service (port 3000)

- **POST /register**: Register a new user.
- **POST /login**: Authenticate a user.
- **GET /profile**: Get profile information.

#### Posts (port 3001)

- **GET /posts/:id**: Get post information by ID.
- **GET /posts/search**: Search posts by title.
- **GET /posts/search/user**: Search posts by username.

#### Ratings (port 3002)

- **GET /posts/:postId/rating**: Get rating of a post.
- **POST /posts/:postId/like**: Like a post.
- **POST /posts/:postId/dislike**: Dislike a post.

#### Comments (port 3003)

- **GET /posts/:postId/comments**: Get comments for a post.
- **POST /posts/:postId/comments**: Add a new comment to a post.

#### Admin (port 3004)

- **GET /users**: Get all users.
- **DELETE /posts/:id**: Delete post by ID.

### Search Functionality

The search functionality allows users to search for posts by title and for posts by username.

- **Search by Title**: Users can search for posts by entering keywords in the search bar. The search will return posts whose titles contain the entered keywords.

- **Search by Username**: Users can search for posts by entering a username preceded by an "@" symbol in the search bar. The search will return posts created by users whose usernames contain the entered substring.

### Authentication and Roles

To perform administrative actions, users need to be authenticated and have an "admin" role.
To set up the "admin" user, edit the `.env` file and replace the following variables:

```
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123098
```

### License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
