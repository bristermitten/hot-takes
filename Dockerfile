FROM oven/bun:1
WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
COPY img ./img

ENV NODE_ENV=production
CMD ["bun", "src/bot.ts"]