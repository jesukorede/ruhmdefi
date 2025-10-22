# Build stage
FROM node:20-bullseye-slim AS builder
WORKDIR /app
COPY package*.json tsconfig.json prisma ./ 
RUN npm ci
RUN npx prisma generate
COPY src ./src
RUN npm run build

# Runtime stage
FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
ENV PORT=8080
EXPOSE 8080
CMD ["./docker-entrypoint.sh"]