# syntax=docker/dockerfile:1

# Base stage with Bun runtime
FROM oven/bun:1.3.3-alpine AS base
WORKDIR /app

# Install production dependencies
FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --production

# Install all dependencies (including dev)
FROM base AS deps-all
COPY package.json bun.lock* ./
RUN bun install

# Build stage
FROM deps-all AS build
COPY . .
# Generate Prisma Client (needs dummy DATABASE_URL for schema parsing)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN bunx prisma generate
# Build the application (skip typecheck - already done in CI)
RUN bun run build

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Copy production dependencies
COPY --from=deps /app/node_modules ./node_modules
# Copy source files (run from source instead of bundled)
COPY --from=build /app/src ./src
COPY --from=build /app/index.ts ./index.ts
# Copy Prisma schema and generated client
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
# Copy necessary files
COPY package.json ./

# Use the bun user that comes with the base image
USER bun

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run -e 'fetch("http://localhost:3000/api/v1/health").then(r => r.ok ? process.exit(0) : process.exit(1))'

# Start the application from source
CMD ["bun", "run", "index.ts"]
