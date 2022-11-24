FROM node:17-alpine as build
WORKDIR /usr/src/bot/

COPY package.json package-lock.json ./
RUN apk add python3 make g++
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

FROM node:17-alpine
WORKDIR /usr/src/bot/
COPY src/ ./
COPY img/ ./
COPY hotTakeData.json ./
COPY --from=build /usr/src/bot/node_modules ./node_modules/
COPY --from=build /usr/src/bot/bin ./bin/
COPY --from=build /usr/src/bot/package.json ./package.json
ENV NODE_ENV production
CMD ["node", "bin/bot.js"]
