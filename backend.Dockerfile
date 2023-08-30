FROM node:18.17.1-bullseye as build
RUN apt-get update && apt-get upgrade -y

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn workspace @yukilabs/governance-backend build

WORKDIR /app/workspaces/backend
ENTRYPOINT [ "yarn", "serve" ]
