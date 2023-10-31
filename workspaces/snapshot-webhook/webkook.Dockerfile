FROM node:18.18.0-bullseye-slim
RUN apt-get update && apt-get upgrade -y

WORKDIR /app
COPY . .
RUN yarn install
#RUN --mount=type=secret,id=certificate \
#          cat /run/secrets/certificate >> /app/workspaces/backend/ca-certificate.crt
#RUN yarn build     todo: use yarn build for produciton with yarn dev
ENTRYPOINT [ "yarn", "dev" ]
