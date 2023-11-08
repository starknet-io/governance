FROM node:18.18.0-bullseye-slim
RUN apt-get update && apt-get upgrade -y

WORKDIR /app
COPY . .
RUN yarn install
RUN --mount=type=secret,id=certificate \
          cat /run/secrets/certificate >> /app/ca-certificate.crt
RUN yarn build

CMD [ "node", "dist/src/index.js" ]
