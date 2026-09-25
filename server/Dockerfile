FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma

COPY prisma.config.ts ./

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

COPY tsconfig.json ./

COPY src ./src

EXPOSE 5000

CMD ["npm", "run", "start:prod"]