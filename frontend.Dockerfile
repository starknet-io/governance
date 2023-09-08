FROM mcr.microsoft.com/devcontainers/typescript-node:16 as build
WORKDIR /build/
ADD ./ ./
RUN yarn install
RUN NODE_OPTIONS="--max-old-space-size=8192" yarn workspace @yukilabs/governance-frontend build

FROM mcr.microsoft.com/devcontainers/typescript-node:16
RUN mkdir /runtime
COPY --from=build /build/ /runtime/
WORKDIR /runtime/workspaces/frontend
EXPOSE 3000
ENTRYPOINT [ "node", "./src/server/index.cjs" ]
