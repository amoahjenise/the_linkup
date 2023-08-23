# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files from the root directory
COPY package*.json ./

# Install dependencies for the root directory
RUN npm install

# Copy the entire app into the container
COPY . .

# Build the frontend app
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
RUN npm run build

# Go back to the root directory
WORKDIR /app

# Expose the port used by the client server
EXPOSE 3000

# Start the client server
CMD ["npm", "run", "client"]
