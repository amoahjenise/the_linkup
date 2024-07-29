# Use the official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files from the root directory
COPY package*.json ./

# Install dependencies for the root directory
RUN npm install --legacy-peer-deps

# # Run npm audit fix --force
# RUN npm audit fix --force

# Set the working directory to the client directory
WORKDIR /app/client

# Copy the package.json and package-lock.json files from the client directory
COPY client/package*.json ./

# Install client dependencies
RUN npm install --legacy-peer-deps

# # Run npm audit fix --force
# RUN npm audit fix --force

# Copy the rest of the client application code
COPY ./client/ ./

# Expose the port used by the client server
EXPOSE 3000

# Start the client server
CMD ["npm", "start"]

# # Start the client server
# CMD ["npm", "run", "start:client"]
