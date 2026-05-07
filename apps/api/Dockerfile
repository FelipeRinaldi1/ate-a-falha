FROM node:24-alpine AS base
WORKDIR /app
RUN npm install -g npm@latest

# Dependencies stage
FROM base AS deps
# Copy manifests for all workspaces
COPY package.json package-lock.json ./
COPY packages/database/package.json ./packages/database/
COPY packages/shared/package.json    ./packages/shared/
COPY packages/pipeline/package.json  ./packages/pipeline/
COPY packages/assets/package.json    ./packages/assets/
COPY apps/api/package.json           ./apps/api/
COPY apps/web/package.json           ./apps/web/

# Clean Install dependencies
RUN npm ci

# Development stage
FROM deps AS development
ENV NODE_ENV=development
# Source code and node_modules are usually mounted via volume in development
CMD ["sh", "-c", "npm run db:generate -w @ate-a-falha/database && npm run dev -w apps/api"]

# Builder stage
FROM deps AS builder
COPY . .
# Generate Prisma Client and build the API
RUN npm run db:generate -w @ate-a-falha/database
RUN npm run build -w apps/api

# Production stage
FROM base AS production
ENV NODE_ENV=production
# Copy built artifacts and necessary manifests
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Install only production dependencies
# Using 'install' instead of 'ci' here because we modified package.json main fields
# which might not match the stale package-lock.json for internal workspaces
RUN npm install --omit=dev

# Since the compiled code in dist/ refers to ./generated, we copy it there
COPY --from=builder /app/packages/database/src/generated ./packages/database/dist/generated

EXPOSE 3333

# Start the application with migrations
CMD ["sh", "-c", "npm run db:migrate -w @ate-a-falha/database && node apps/api/dist/server.js"]