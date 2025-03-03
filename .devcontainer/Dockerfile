# -------- BASE STAGE (Build Dependencies) --------
FROM node:20 AS builder

# Install OpenSSL for Prisma compatibility on ARM64
RUN apt update && apt install -y libssl-dev

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy Prisma schema
COPY prisma ./prisma/

# **Generate Prisma Client with correct binary**
RUN npx prisma generate

# Copy the entire source code
COPY . .

# Compile TypeScript
RUN npm run build


# -------- FINAL STAGE (Production-Ready App) --------
FROM node:20 AS runner

WORKDIR /app

# Install OpenSSL in production container
RUN apt update && apt install -y libssl-dev

# Copy only necessary files from builder
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --only=production

# **Copy Prisma Client from builder**
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# **Copy Prisma schema (needed for migrations)**
COPY --from=builder /app/prisma ./prisma

# Copy built dist/ folder
COPY --from=builder /app/dist ./dist

# Set environment variables
ENV NODE_ENV=production
ENV NODE_PATH=dist
ENV DEVCONTAINER=true

# Expose necessary port
EXPOSE 3000

# Run the compiled app
CMD ["npm", "run", "start"]
