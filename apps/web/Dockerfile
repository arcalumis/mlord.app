# syntax=docker/dockerfile:1

# ============================================
# Stage 1: Build Stage - Build Vite app
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./

# Install bun
RUN apk add --no-cache curl unzip bash && \
    curl -fsSL https://bun.sh/install | bash && \
    ln -s /root/.bun/bin/bun /usr/local/bin/bun

# Install dependencies
RUN bun install

# Copy source files
COPY . .

# Build argument for API URL (can be overridden at build time)
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Remove tsconfig extends to avoid monorepo dependency
RUN sed -i '/"extends":/d' tsconfig.json

# Build the application (skip tsc check, Vite handles TypeScript)
RUN bun vite build

# ============================================
# Stage 2: Production Stage - Nginx server
# ============================================
FROM nginx:1.25-alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration to a safe location
# Then move it in the RUN command to avoid read-only filesystem issues
COPY nginx.conf /tmp/default.conf

# Create nginx user permissions and setup config
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    rm /etc/nginx/conf.d/default.conf && \
    cp /tmp/default.conf /etc/nginx/conf.d/default.conf && \
    chmod 644 /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Expose port 80
EXPOSE 80

# Start nginx (runs as root, which is standard for nginx in containers)
# Nginx will automatically drop privileges after binding to port 80
CMD ["nginx", "-g", "daemon off;"]
