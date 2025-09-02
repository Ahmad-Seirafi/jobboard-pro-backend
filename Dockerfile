# --- Builder ---
    FROM node:22-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY tsconfig.json ./
    COPY src ./src
    RUN npm run build
    
    # --- Runner ---
    FROM node:22-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    COPY package*.json ./
    RUN npm ci --omit=dev
    COPY --from=builder /app/dist ./dist
    EXPOSE 4000
    CMD ["node", "dist/server.js"]
    