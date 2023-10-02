FROM node:18.18.0-bullseye-slim
RUN apt-get update && apt-get upgrade -y

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn workspace @yukilabs/governance-backend build
RUN --mount=type=secret,id=certificate cp /run/secrets/certificate  /app/workspaces/backend/ca-certificate.crt

WORKDIR /app/workspaces/backend
ENTRYPOINT [ "yarn", "serve" ]
