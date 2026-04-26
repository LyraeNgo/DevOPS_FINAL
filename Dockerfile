# Base image (secure hơn alpine)
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files trước (tận dụng cache)
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Use non-root user (security best practice)
USER node

# Expose port
EXPOSE 3000

# Run app
CMD ["node", "main.js"]