FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Expose port 5173 (Vite default port)
EXPOSE 5173

# Run development server with host binding for Docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]