[![Deployment Pipeline](https://github.com/TheJuanAndOnly99/chat/actions/workflows/pipeline.yml/badge.svg)](https://github.com/TheJuanAndOnly99/chat/actions/workflows/pipeline.yml)
![GitHub](https://img.shields.io/github/license/TheJuanAndOnly99/chat)

# Chat Application

A chat application built to practice building applications with TypeScript, Express, Vite, Svelte, JWTs, Socket.IO, and MongoDB.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This chat application is a simple real-time messaging platform that allows users to chat with each other. It provides a basic user registration system and supports real-time message delivery using Socket.IO. The application stores user data in a MongoDB database. The frontend is displayed using Vite and Svelte.

## Features

- User registration: Users can create accounts with a username, email, and password.
- User authentication: Users can login with their credentials and receive a JWT token.
- Create chat rooms: Users can create and join chat rooms.
- Real-time chat: Users can send and receive real-time chat messages in chat rooms.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js: Ensure you have Node.js installed on your system. You can download it from [https://nodejs.org/](https://nodejs.org/).
  - *Note: I used Node.js v16.14.2 to build this project.*
- MongoDB: Install and run MongoDB on your local machine. You can download it from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community).
- MongoDB Compass (optional): Install MongoDB Compass to view and manage your MongoDB databases. You can download it from [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass).
- Git: You'll need Git to clone the project repository.
- Postman (optional): Install Postman to test the API endpoints. You can download it from [https://www.postman.com/downloads/](https://www.postman.com/downloads/).

## Getting Started

1. Clone the repository:

  ```bash
  git clone https://github.com/TheJuanAndOnly99/chat.git
  ```

2. Install project dependencies in both the server and website directories:

   ```bash
   cd chat/server
   npm install
   ```

  ```bash
  cd chat/website
  npm install
  ```

3. Configure environment variables:
   - Create a `.env` file in the server directory.
   - Define the following environment variables:

  ```env
  CLIENT_URL="http://127.0.0.1:5173" # Update with the URL of your frontend client as needed
  JWT_SECRET="your-secret"           # Update with your JWT secret key as needed
  ```

4. Start the server:

  ```bash
  cd chat/server
  npm run start
  ```

The server should now be running at `http://localhost:3000`.

5. Start the website:

  ```bash
  cd chat/website
  npm run start
  ```

## Project Structure

The project structure attempts to follow Hexagonal Software Architecture principles as closely as possible and is organized as follows:

- `server/`: Contains the backend server code
  - `src/`: Contains the source code
    - `backend/`: Backend server code.
      - `Server.ts`: Main server file.
      - `App.ts`: Express application.
      - `server.start.ts`: Server startup script.
      - `controllers/`: Controllers for handling HTTP requests.
      - `middlewares/`: Middleware functions.
      - `repositories/`: Database repositories.
      - `models/`: Database models.
      - `schemas/`: Database schemas.
    - `utilities/`: Contains utility functions.
  - `tests/`: Unit and integration tests 
- `website/`: Contains the frontend website code
  - `src/`: Contains the source code
    - `components/`: Website components.
      - `Home.svelte`: Main component.
    - `main.ts`: Main website file.
    - `App.svelte`: Main website component.
- `README.md`: Project documentation.

## Usage

- Register a new user account.
- Log in with your credentials.
- Join or create a new chatroom
- Start chatting with other users in real-time.

## Testing

To run the tests, run the following command in the `server/` directory:

```bash
npm run test
```

## Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

1. Fork the project repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/your-bug-fix`.
3. Make your changes and commit them.
4. Push your changes to your fork: `git push origin feature/your-feature-name`.
5. Create a pull request on the original repository's `main` branch.

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.
```

