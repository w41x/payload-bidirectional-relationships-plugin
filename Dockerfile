# syntax = docker/dockerfile:1.4.1

FROM node:22.8.0-alpine3.20 AS payload
LABEL name='api build'
# enable corepack
RUN corepack enable
# set user and working directory and copy all project files
USER node
WORKDIR /home/node/workspace
COPY --chown=node . .
# install node module for plugin
RUN pnpm install
# build plugin
RUN pnpm clean && pnpm build
# set working directory for test environment
WORKDIR /home/node/workspace/dev
# install node module for test environment
RUN pnpm install
# set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development
ENV NODE_OPTIONS --no-deprecation
ENV PATH  /home/node/workspace/dev/node_modules/.bin:$PATH
# set internal port
EXPOSE 3000
# start test environment
CMD pnpm run dev

FROM mongo:8.0.0-rc18-noble as db
LABEL name='db build'
# database admin user
ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=secret
# create mongodb directory
WORKDIR /etc/mongodb
# generate key file
RUN openssl rand -base64 756 > keyfile.txt
RUN chmod 400 keyfile.txt
RUN chown mongodb:mongodb keyfile.txt
# copy config file
COPY dev/mongo.conf.yaml config.yaml
# copy init file
COPY dev/mongo.init.js init.js
# set internal port
EXPOSE 27017