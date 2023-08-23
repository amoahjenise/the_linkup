# Use an official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app/server/auth-service

# Copy package.json and package-lock.json to the container
COPY package*.json ./

#  Rebuild the bcrypt module inside the Docker containers to ensure compatibility with the container's architecture
# RUN npm rebuild bcrypt --build-from-source
RUN npm uninstall bcrypt
RUN npm install bcrypt@latest

# Install dependencies
RUN npm install

# Expose the port that your backend service will listen on
EXPOSE 3001

# Specify the command to start the backend service
CMD ["npm", "start"]
