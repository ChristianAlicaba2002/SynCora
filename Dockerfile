FROM node:20-alpine

WORKDIR /app

# Install Expo CLI
RUN npm install -g expo-cli

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expo ports
EXPOSE 8081

CMD ["npx", "expo", "start", "--tunnel"]