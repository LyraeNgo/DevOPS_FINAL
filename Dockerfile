# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Stage 2: runtime (nhẹ + secure)
FROM node:20-alpine

WORKDIR /app

# chỉ copy cần thiết
COPY --from=builder /app ./

# tạo user không phải root (security tốt hơn)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup


RUN mkdir -p /app/public/uploads && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000
CMD ["npm", "start"]