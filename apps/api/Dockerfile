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

# Install from lockfile 
RUN npm ci

COPY . .

EXPOSE 3333

# Source code is mounted via volume at runtime
CMD ["sh", "-c", "npm run db:generate -w @ate-a-falha/database && npm run dev -w apps/api"]