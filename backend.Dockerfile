FROM node:22.23.4-bookworm-slim
RUN apt-get update && apt-get upgrade -y

WORKDIR /app
COPY . .
RUN yarn install
RUN --mount=type=secret,id=certificate \
          cat /run/secrets/certificate >> /app/workspaces/backend/ca-certificate.crt
RUN yarn workspace @yukilabs/governance-backend build

WORKDIR /app/workspaces/backend
ENTRYPOINT [ "yarn", "serve" ]
