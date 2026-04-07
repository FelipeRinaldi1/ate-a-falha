FROM node:24 AS base

WORKDIR /app

FROM base AS prepare
RUN npm install -g turbo
COPY . .
RUN turbo prune web --docker

FROM base AS builder
WORKDIR /app
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=prepare /app/out/full .
COPY tsconfig.json .

RUN npx turbo run build --filter=web...

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/ .
EXPOSE 3000

CMD ["npm", "run", "preview", "-w", "apps/web", "--", "--port", "3000", "--host"]
