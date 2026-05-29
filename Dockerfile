FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app
COPY --from=builder /app .

ENV NODE_ENV=production
EXPOSE 8080
ENTRYPOINT ["node", "app.js"]
