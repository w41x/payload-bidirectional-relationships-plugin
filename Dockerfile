# syntax = docker/dockerfile:1.4.1

FROM node:21.7.1-alpine3.19 AS payload
LABEL name='api build'
# enable pnpm
RUN corepack enable
RUN corepack prepare pnpm@8.15.5 --activate
# set user and working directory and copy all project files
USER node
WORKDIR /home/node/workspace
COPY --chown=node . .
# set environment variables
ENV NODE_ENV development
# install node modules for plugin
# RUN pnpm install
# ENV PATH  /home/node/workspace/node_modules/.bin:$PATH
# build plugin
# RUN pnpm run build
# set working directory for test environment
WORKDIR /home/node/workspace/dev
# install node module for test environment
RUN pnpm install
ENV NEXT_TELEMETRY_DISABLED 1
ENV PATH  /home/node/workspace/dev/node_modules/.bin:$PATH
# set internal port
EXPOSE 3000
# start test environment
CMD pnpm run dev

FROM mongo:7.0.6-jammy as db
LABEL name='db build'
# database config
ENV MONGO_INITDB_ROOT_USERNAME=root
ENV MONGO_INITDB_ROOT_PASSWORD=secret
# set internal port
EXPOSE 27017