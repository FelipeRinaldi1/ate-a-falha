FROM node:24

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json    ./packages/shared/
COPY packages/pipeline/package.json  ./packages/pipeline/
COPY packages/assets/package.json    ./packages/assets/
COPY apps/api/package.json           ./apps/api/
COPY apps/web/package.json           ./apps/web/

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run db:generate -w @ate-a-falha/database && npm run dev -w apps/web"]
