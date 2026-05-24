FROM node:24-alpine AS base
WORKDIR /app
RUN npm install -g npm@latest

FROM base AS deps

COPY package.json package-lock.json ./
COPY packages/shared/package.json    ./packages/shared/
COPY packages/database/package.json ./packages/database/
COPY apps/api/package.json           ./apps/api/

RUN npm ci

FROM deps AS development
ENV NODE_ENV=development
CMD ["sh", "-c", "npm run db:generate -w @ate-a-falha/database && npm run dev -w apps/api"]

FROM deps AS builder
COPY . .
RUN npm run db:generate -w @ate-a-falha/database
RUN npm run build -w apps/api

FROM base AS production
ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

RUN npm install --omit=dev

COPY --from=builder /app/packages/database/src/generated ./packages/database/dist/generated
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/packages/database/prisma.config.ts ./packages/database/prisma.config.ts
COPY --from=builder /app/apps/api/public ./apps/api/public

EXPOSE 3333

CMD ["sh", "-c", "npm run db:migrate -w @ate-a-falha/database && node apps/api/dist/server.js"]