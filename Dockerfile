# Builder Stage
FROM node:22.15.0-alpine AS builder
WORKDIR /builder

# Install pnpm
RUN npm install -g pnpm

# Copy package files & install deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy all source code
COPY . .

# Copy env file
COPY .env.production .env

# Build
ENV NODE_ENV=production
RUN pnpm build

# Runner Stage
FROM node:22.15.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built files & node_modules
COPY --from=builder /builder/.next ./.next
COPY --from=builder /builder/node_modules ./node_modules
COPY --from=builder /builder/public ./public
COPY --from=builder /builder/package.json ./package.json
COPY --from=builder /builder/.env ./.env

EXPOSE 3000
CMD ["pnpm", "start"]
