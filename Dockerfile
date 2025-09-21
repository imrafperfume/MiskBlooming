FROM node:22.15.0-alpine AS builder

WORKDIR /builder

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Runner Stage 

FROM node:22.15.0-alpine AS runner 

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /builder/.next ./.next
COPY --from=builder /builder/node_modules ./node_modules
COPY --from=builder /build/public ./public
COPY --from=builder /builder/package.json ./package.json

EXPOSE 3000

CMD [ "pnpm", "start" ]