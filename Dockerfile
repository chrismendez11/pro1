FROM --platform=linux/amd64 node:21.6.1 AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY prisma/schema.prisma ./prisma/

RUN pnpm prisma generate

COPY . .

RUN pnpm build

FROM --platform=linux/amd64 node:21.6.1 AS production

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]