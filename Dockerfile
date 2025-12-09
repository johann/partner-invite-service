# Stage 1: Build the React frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build arguments for Vite environment variables
# These MUST be provided at build time (not runtime) as they're baked into the JS bundle
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set environment variables for Vite build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Verify required build-time variables are set
RUN if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then \
      echo "ERROR: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided as build arguments"; \
      echo "These variables are required at BUILD TIME, not runtime"; \
      echo "Example: docker build --build-arg VITE_SUPABASE_URL=... --build-arg VITE_SUPABASE_ANON_KEY=..."; \
      exit 1; \
    fi

# Build the React app
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy server files (includes templates/)
COPY server/ ./server/

# Copy built React app from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Note: Runtime environment variables (BASE_URL, SUPABASE_URL, RESEND_API_KEY, etc.)
# are set by the deployment platform (Dokploy/docker-compose) and don't need to be
# defined here. They are read by the Express server at runtime via process.env.

# Start the Express server
CMD ["npm", "start"]
