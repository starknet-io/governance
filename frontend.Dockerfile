FROM mcr.microsoft.com/devcontainers/typescript-node:16 as build
WORKDIR /build/
ADD ./ ./
RUN yarn install
RUN yarn workspace @yukilabs/governance-frontend build

FROM mcr.microsoft.com/devcontainers/typescript-node:16
RUN mkdir /runtime
COPY --from=build /build/ /runtime/
WORKDIR /runtime/workspaces/frontend
ENTRYPOINT [ "node", "./src/server/index.cjs" ]
