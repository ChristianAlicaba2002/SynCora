FROM node:20-alpine

WORKDIR /app

RUN addgroup -g 1001 appgroup && adduser -S appuser -u 1001 -G appgroup

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/.expo && chown -R appuser:appgroup /app

USER appuser

EXPOSE 5173

CMD ["npx", "expo", "start", "--tunnel", "--clear"]
