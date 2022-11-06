FROM node:16-alpine AS base
RUN mkdir -p /var/www/app
COPY . .
WORKDIR /var/www/app

FROM base AS builder-server
WORKDIR /var/www/app
COPY ./package*.json .
RUN npm install --loglevel warn --only=production

FROM builder-server AS development
WORKDIR /var/www/app
COPY . ./
RUN npm install --loglevel warn --only=development && npm run build
# czy nie powinno być tutaj build? po co ma nasłuchiwać
CMD ["npm", "run", "start:dev"]
