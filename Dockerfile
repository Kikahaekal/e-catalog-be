# ============================================
# E-Catalog Backend — Dockerfile
# ============================================
# Multi-stage build:
#   Stage 1 (builder) : install deps + compile TypeScript via tsdown
#   Stage 2 (runtime) : lean image with built output + prisma support
# ============================================

# ── Stage 1: Build ─────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# ── Stage 2: Production ───────────────────────
FROM node:22-alpine

WORKDIR /app

# Copy package manifests and install all deps
# (dev deps needed for prisma CLI to run migrations)
COPY --from=builder /app/package*.json ./
RUN npm ci

# Copy built output
COPY --from=builder /app/dist ./dist

# Copy Prisma config + migration files (needed for `prisma db migrate`)
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/prisma-composer.config.ts ./
COPY --from=builder /app/service.ts ./
COPY --from=builder /app/module.ts ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src/prisma ./src/prisma
COPY --from=builder /app/migrations ./migrations

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Create uploads directory for multer file uploads
RUN mkdir -p uploads

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/server.mjs"]
