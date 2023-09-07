FROM node:18-alpine as serve-stage

ENV NODE_ENV production

USER node
WORKDIR /app

COPY node_modules ./node_modules
COPY dist ./dist

CMD ["node", "dist/src/main.js"]
