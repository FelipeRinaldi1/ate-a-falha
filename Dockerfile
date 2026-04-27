FROM node:24

WORKDIR /app

# Copy manifests for all workspaces so npm ci can resolve internal packages
COPY package.json package-lock.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json    ./packages/shared/
COPY packages/pipeline/package.json  ./packages/pipeline/
COPY packages/assets/package.json    ./packages/assets/
COPY apps/api/package.json           ./apps/api/
COPY apps/web/package.json           ./apps/web/

# Install from lockfile, clean install
RUN npm ci

COPY . .

RUN npm run db:generate -w @ate-a-falha/database

RUN npm run build -w apps/api

EXPOSE 3333

CMD ["npm", "run", "start", "-w", "apps/api"]
