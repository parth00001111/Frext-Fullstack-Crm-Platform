FROM oven/bun:1.3.14 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/bun.lock ./
RUN bun install --frozen-lockfile
COPY frontend/ ./
RUN bun run build

FROM oven/bun:1.3.14 AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/bun.lock ./
RUN bun install --frozen-lockfile
COPY backend/src ./src
COPY backend/build.ts ./build.ts
RUN bun run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist
ENV NODE_ENV=production
ENV PORT=10000
USER node
EXPOSE 10000
CMD ["npm", "start"]
