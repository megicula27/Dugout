# Esports Dugout

Esports Dugout is a powerful platform designed for esports enthusiasts and teams to engage in competitive gaming. It allows users to create teams, join tournaments, and monitor team performance in real-time, providing a seamless experience for both casual players and competitive esports teams.

This platform integrates with real-time communication systems, live match tracking, and team management features to provide a comprehensive esports experience.

## Features

- **User Authentication**: Users can sign up and log in through Google authentication.
- **Team Management**: Users can create teams, join teams, and manage team rosters for various games.
- **Tournament Creation**: Organize and join tournaments with dynamic team and bracket management.
- **Real-Time Communication**: Chat with teammates and interact with the community.
- **Live Match Tracking**: Monitor live match statuses and tournament results.
- **Player Invitation**: Invite other players to join your team or tournaments.
- **Performance Monitoring**: Integrated with Grafana and Prometheus to monitor platform performance in real-time.

## Tech Stack

### Frontend

- Next.js for building the user interface
- React for building interactive UIs
- Socket.IO for real-time communication
- React Hot Toast for notifications

### Backend

- Node.js and Express.js for building RESTful APIs
- MongoDB for storing user, team, and tournament data
- Redis for caching and session management
- Prometheus for system monitoring and metrics collection
- Grafana for visualizing metrics and performance dashboards

### Deployment

- Vercel for hosting the frontend Next.js app
- Railway for hosting the Socket.IO server
- Docker for containerizing the application and its dependencies
- Render for deploying Grafana and Prometheus in the cloud

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/dugout.git
cd dugout
```

### 2. Install dependencies for the frontend

```bash
cd dugout
npm install
```

### 3. Install dependencies for the backend (Socket Server)

```bash
cd socket
npm install
```

### 4. Set up environment variables

Create a `.env` file in the root directory and provide the necessary environment variables. You can refer to `.env.example` for a list of required variables.

### 5. Run the project locally

Frontend:

```bash
npm run dev
```

Socket Server:

```bash
cd socket
npm run start
```

You should now be able to access the frontend at `http://localhost:3000` and the backend (Socket.IO server) at `http://localhost:4000`.

## Deployment

### Vercel (Frontend - Next.js)

1. Push the repository to GitHub.
2. Connect the GitHub repository to Vercel using their deployment platform.
3. Configure environment variables in Vercel (e.g., API URLs, Socket server, etc.).
4. Deploy the project, and Vercel will handle continuous deployment automatically on every push to the main branch.

### Railway (Backend - Socket Server)

1. Create a new project in Railway.
2. Link the GitHub repository and choose the backend folder.
3. Set up environment variables such as MongoDB and Redis URLs.
4. Deploy the Socket server, which will automatically run on Railway.

### Docker (Prometheus and Grafana)

Prometheus and Grafana can be deployed using Docker containers for monitoring and visualizing platform performance.

1. Clone the repositories for Grafana and Prometheus.
2. Ensure that the `prometheus.yml` and Dockerfiles are set up correctly.
3. Run the following command to bring up the services locally:

```bash
docker-compose up --build
```

4. Access Prometheus at `http://localhost:9090` and Grafana at `http://localhost:3001` for metrics visualization.

### Render (Prometheus and Grafana on Cloud)

1. Deploy Prometheus and Grafana services on Render.
2. Set up the required environment variables such as Prometheus scrape configurations for external services.
3. Access your Grafana dashboard and Prometheus metrics on the provided Render URLs.

## Monitoring with Grafana and Prometheus

1. Access Prometheus at `http://localhost:9090` (or Render URL).
2. Add your services (e.g., Socket server, MongoDB, Redis, Next.js app) to the Prometheus scrape configurations.
3. Access Grafana at `http://localhost:3001` (or Render URL).
4. Set Prometheus as the data source in Grafana and create dashboards to monitor various metrics such as request count, error rates, latency, and server resource usage.

## Contributing

We welcome contributions! If you'd like to improve the platform or fix bugs, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to your fork (`git push origin feature/your-feature`).
6. Create a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
