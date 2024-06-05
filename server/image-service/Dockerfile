# Use an official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app/server/image-service

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose the port that your backend service will listen on
EXPOSE 3007

# Specify the command to start the backend service
CMD ["npm", "start"]
