# GovernanceHub

This is a monorepo application containing multiple services that work together. The application is deployed using Docker Compose, which allows us to easily manage, build, and run these services, including a PostgreSQL database.

## Prerequisites

- Docker: Please ensure you have Docker installed on your system. You can find the installation guide for your platform at https://docs.docker.com/engine/install/
- Docker Compose: Make sure Docker Compose is installed. You can find the installation guide at https://docs.docker.com/compose/install/

## Technology Stack:

- BE:

  - Typescript 4
  - NodeJs 16+
  - PostgreSQL

- FE:

To start the application, follow these steps:

1. Clone the repository:

2. Navigate to the repository's root directory:

3. Copy the `.env.example` into `.env` file in the apps/backend directory and adjust the necessary environment variables for the PostgreSQL service, such as:

PORT=8000

# Database

HOST = '127.0.0.1'
DB_PORT = 5432
USER = myuser
PASSWORD = mypassword
DB_NAME = mydbname

Replace the values with your desired PostgreSQL username, password, and database name.

4. Build and start the services using Docker Compose:

docker-compose up -d

5. To start the application, execute the following command:

yaml start
