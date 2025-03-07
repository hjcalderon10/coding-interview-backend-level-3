# -------- DEVELOPMENT STAGE --------
FROM node:20 AS dev

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install ALL dependencies (dev + prod)
RUN npm install

# Copy the rest of the project (except node_modules, ignored via .dockerignore)
COPY . .

# Expose necessary ports
EXPOSE 3000

# Ensure dependencies are installed, run migrations, and start app with --watch
CMD ["sh", "-c", "npx knex migrate:latest --knexfile knexfile.js && node --watch ./src/index.js"]
