FROM node:18.18.0-bullseye-slim
RUN apt-get update && apt-get upgrade -y

WORKDIR /app
COPY . .
RUN yarn install

RUN yarn build

CMD [ "node", "dist/src/index.js" ]
