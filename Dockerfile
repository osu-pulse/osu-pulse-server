FROM node:16-alpine as build-stage

WORKDIR /server

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --only=development
COPY . .
RUN yarn run build


FROM node:16-alpine as serve-stage

ENV NODE_ENV production

USER node
WORKDIR /server

COPY --from=build-stage /server/package.json ./
COPY --from=build-stage /server/node_modules ./node_modules
COPY --from=build-stage /server/dist ./dist

CMD ["yarn", "run", "start:prod"]
