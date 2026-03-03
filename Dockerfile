# =========================
# Base
# =========================
FROM node:20.18.1-alpine AS base

WORKDIR /app
ENV TZ=America/Sao_Paulo

# =========================
# Dependencies
# =========================
FROM base AS deps

RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci

# =========================
# Builder
# =========================
FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# =========================
# Runner
# =========================
FROM node:20.18.1-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV TZ=America/Sao_Paulo

RUN addgroup -S nodejs -g 1001 \
  && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

# Garante permissão de escrita no cache
RUN mkdir -p .next/cache/images && chown -R nextjs:nodejs .next

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]