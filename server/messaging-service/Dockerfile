# Use an official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app/server/messaging-service

# Copy the entire messaging-service directory into the container
COPY ./server/messaging-service ./

# Install dependencies
RUN npm install

# Expose the port that your backend service will listen on
EXPOSE 3006

# Specify the command to start the backend service
CMD ["npm", "start"]
