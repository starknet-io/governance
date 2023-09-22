# GovernanceHub

This is a monorepo application containing multiple services that work together. The application is deployed using Docker Compose, which allows us to easily manage, build, and run these services.

## Infrastructure
the application is deployed in DigitalOcean using 2 App platforms (frontend and backend) per environment (Review and development, production) and a Digitalocean Managed database,

the backend app platform has two components: the app and a cronjob worker  
all secrets and variables are declared in the digitalocean app platform

## Prerequisites

- Docker: Please ensure you have Docker installed on your system. You can find the installation guide for your platform at https://docs.docker.com/engine/install/
- Docker Compose v2: Make sure Docker Compose is installed. You can find the installation guide at https://docs.docker.com/compose/install/standalone/

## Technology Stack:

- BE:

  - Typescript 4
  - NodeJs 16+
  - PostgreSQL

- FE:

## Set up a local database

1. Right click Servers tab in PgAdmin and choose `Register -> Server`.
2. In `General` tab, write `governance` in `Name` field.
3. In `Connection` tab, write `localhost` for `Host name/address` field. 
4. Click `save`

> If you get `role "postgress" does not exist` error, do following steps.

-  Connect to psql shell (e.g  `psql -U postgres`)
- Run the command below in shell

  ```SQL
  CREATE ROLE postgres SUPERUSER LOGIN PASSWORD 'governance';
  ```

  > In this example, we are giving `SUPERUSER` to `postgres` role but `CREATEDB` should work as well. 

- Confirm that the role is created by running `\du` in psql shell. 

  > TIP: You can exit psql vim-like view by hitting `q` 
- Go back to PgAdmin and try saving now.
- Go to project root and run `yarn seed` to seed your local db.

## To start the application, follow these steps:

1. Clone the repository:

2. Navigate to the repository's root directory:

3. Update the docker-compose.local.yml with local environment variables

4. Build and start the services using Docker Compose:
   ```bash
       docker-compose up -d -f docker-compose.local.yml
    ```
5. migrate local database using 
    ```bash
      yarn migration:generate
    ```


