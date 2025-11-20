FROM node:lts-alpine

RUN yarn set version 4.11.0

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --immutable

EXPOSE 3000
CMD ["yarn", "dev"]