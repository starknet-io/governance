FROM node:18.18.0-bullseye-slim

ARG VITE_APP_GOOGLE_TAG_ID
ARG VITE_APP_SNAPSHOT_SPACE
ARG VITE_APP_SNAPSHOT_CHAIN_ID
ARG VITE_APP_DELEGATION_TOKEN
ARG VITE_APP_DYNAMIC_ID
ARG VITE_APP_IFRAMELY_ID
ARG VITE_APP_TRPC_URL
ARG VITE_APP_DELEGATION_SYMBOL
ARG VITE_APP_SNAPSHOT_URL
ARG VITE_APP_DELEGATION_REGISTRY
ARG VITE_APP_DELEGATION_CHAIN_ID
ARG VITE_APP_ALGOLIA_APP_ID
ARG VITE_APP_ALGOLIA_PUBLIC_API_KEY
ARG VITE_APP_ALGOLIA_INDEX
ARG VITE_APP_TELEGRAM_BOT_KEY
ARG VITE_APP_STARKNET_REGISTRY
ARG VITE_APP_SNAPSHOTX_SPACE
ARG VITE_APP_SNAPSHOTX_URL
ARG VITE_APP_IPFS_GATEWAY
ARG VITE_APP_INFURA_API_KEY

ENV NODE_ENV=production
ENV VITE_APP_TRPC_URL $VITE_APP_TRPC_URL
ENV VITE_APP_GOOGLE_TAG_ID $VITE_APP_GOOGLE_TAG_ID
ENV VITE_APP_SNAPSHOT_SPACE $VITE_APP_SNAPSHOT_SPACE
ENV VITE_APP_SNAPSHOT_CHAIN_ID $VITE_APP_SNAPSHOT_CHAIN_ID
ENV VITE_APP_DELEGATION_TOKEN $VITE_APP_DELEGATION_TOKEN
ENV VITE_APP_DYNAMIC_ID $VITE_APP_DYNAMIC_ID
ENV VITE_APP_IFRAMELY_ID $VITE_APP_IFRAMELY_ID
ENV VITE_APP_DELEGATION_SYMBOL $VITE_APP_DELEGATION_SYMBOL
ENV VITE_APP_SNAPSHOT_URL $VITE_APP_SNAPSHOT_URL
ENV VITE_APP_DELEGATION_REGISTRY $VITE_APP_DELEGATION_REGISTRY
ENV VITE_APP_DELEGATION_CHAIN_ID $VITE_APP_DELEGATION_CHAIN_ID
ENV VITE_APP_ALGOLIA_APP_ID $VITE_APP_ALGOLIA_APP_ID
ENV VITE_APP_ALGOLIA_PUBLIC_API_KEY $VITE_APP_ALGOLIA_PUBLIC_API_KEY
ENV VITE_APP_ALGOLIA_INDEX $VITE_APP_ALGOLIA_INDEX
ENV VITE_APP_TELEGRAM_BOT_KEY $VITE_APP_TELEGRAM_BOT_KEY
ENV VITE_APP_STARKNET_REGISTRY $VITE_APP_STARKNET_REGISTRY
ENV VITE_APP_SNAPSHOTX_SPACE $VITE_APP_SNAPSHOTX_SPACE
ENV VITE_APP_SNAPSHOTX_URL $VITE_APP_SNAPSHOTX_URL
ENV VITE_APP_IPFS_GATEWAY $VITE_APP_IPFS_GATEWAY
ENV VITE_APP_INFURA_API_KEY $VITE_APP_INFURA_API_KEY

RUN apt-get update && apt-get upgrade -y
WORKDIR /app
COPY . .
RUN yarn install
RUN NODE_OPTIONS="--max-old-space-size=8192" yarn workspace @yukilabs/governance-frontend build
WORKDIR /app/workspaces/frontend
EXPOSE 3000
ENTRYPOINT [ "node", "./src/server/index.cjs" ]
