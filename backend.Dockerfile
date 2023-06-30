FROM mcr.microsoft.com/devcontainers/typescript-node:16 as build
RUN mkdir /build
WORKDIR /build/
ADD ./ ./
RUN yarn install
RUN yarn workspace @yukilabs/governance-backend build

FROM mcr.microsoft.com/devcontainers/typescript-node:16
RUN mkdir /runtime
COPY --from=build /build/ /runtime/
WORKDIR /runtime/workspaces/backend
ENTRYPOINT [ "node", "dist/index.js" ]
