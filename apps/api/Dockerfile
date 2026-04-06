FROM node:24 AS base

WORKDIR /app

FROM base AS prepare

RUN npm install -g turbo

COPY . .

RUN turbo prune @ate-a-falha/api --docker

FROM base AS builder

WORKDIR /app

COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/package-lock.json ./package-lock.json

RUN npm install

COPY --from=prepare /app/out/full .

COPY tsconfig.json .

RUN DATABASE_URL="postgresql://fake:fake@localhost:5432/fake" npm run db:gen --workspace=@ate-a-falha/database

RUN npx turbo run build --filter=@ate-a-falha/api...

FROM base AS runner

WORKDIR /app

COPY --from=builder /app/ .

EXPOSE 3333

CMD ["npm", "run", "start", "-w" , "apps/api"]