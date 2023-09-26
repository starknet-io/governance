FROM node:18.18.0-bullseye-slim as build
ENV NODE_ENV=production
ENV VITE_APP_TRPC_URL=https://api-review.yuki-labs.dev/trpc
RUN apt-get update && apt-get upgrade -y
WORKDIR /app
COPY . .
RUN yarn install
RUN NODE_OPTIONS="--max-old-space-size=8192" yarn workspace @yukilabs/governance-frontend build
WORKDIR /app/workspaces/frontend
EXPOSE 3000
ENTRYPOINT [ "node", "./src/server/index.cjs" ]
