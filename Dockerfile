# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the application files to the working directory
COPY . .

# Expose the port on which your application listens
EXPOSE 3000

# Specify the command to run your Node.js application
CMD ["node", "app.js"]