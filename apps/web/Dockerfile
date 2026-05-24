FROM node:24

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json    ./packages/shared/
COPY apps/web/package.json           ./apps/web/

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npm run dev -w apps/web"]
