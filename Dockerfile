# Use the official Node.js image as the base image
FROM node:18

# Set the working directory for the backend
WORKDIR /usr/src/app/server

# Copy backend package.json and package-lock.json
COPY server/package*.json ./

# Install backend dependencies
RUN npm install

# Set the working directory for the frontend
WORKDIR /usr/src/app/client

# Copy frontend package.json and package-lock.json
COPY client/package*.json ./

# Install frontend dependencies
RUN npm install

# Install Vite globally
RUN npm install -g vite

# Copy frontend source code and build the frontend
COPY client .
RUN npm run build

# Move back to the backend working directory
WORKDIR /usr/src/app/server

# Copy backend source code
COPY server .


# Expose the port the app runs on
EXPOSE 5000

# Start the backend server
CMD [ "node", "index.js" ]
