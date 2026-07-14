# ==========================================
# STAGE 1: Build React Frontend
# ==========================================
FROM node:22-alpine AS frontend-builder
WORKDIR /app

# Install frontend dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy frontend source and build
COPY tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts index.html ./
COPY public/ ./public/
COPY src/ ./src/
RUN npm run build

# ==========================================
# STAGE 2: Build Node.js Backend
# ==========================================
FROM node:22-alpine AS backend-builder
WORKDIR /app/server

# Install backend dependencies
COPY server/package.json server/package-lock.json* ./
RUN npm install

# Copy backend source and compile
COPY server/tsconfig.json ./
COPY server/src/ ./src/
RUN npm run build

# Manually copy schema.sql into dist/db/ so it can be resolved by ts-compiled code
RUN cp src/db/schema.sql dist/db/schema.sql

# ==========================================
# STAGE 3: Final Runner Environment
# ==========================================
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy compiled static frontend assets to dist/
COPY --from=frontend-builder /app/dist ./dist

# Copy compiled backend assets
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/package.json ./server/package.json
COPY --from=backend-builder /app/server/package-lock.json* ./server/package-lock.json

# Install production dependencies for the backend
WORKDIR /app/server
RUN npm install --omit=dev

# Expose port and run the server
EXPOSE 3000
CMD ["node", "dist/server.js"]
