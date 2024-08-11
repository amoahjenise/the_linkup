# Use a Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy root package.json and lock files
COPY package*.json ./

# Install root dependencies
RUN npm install --legacy-peer-deps

# Copy the client and server folders
COPY client ./client
COPY server ./server

# Build the client
RUN npm run build:client

# Build all server services
RUN npm run build:server

# Expose the port for the client
EXPOSE 3000

# Run the client and server
CMD ["npm", "run", "start:all"]
