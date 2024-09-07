# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY BikeRideReactApp/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY BikeRideReactApp/ .

# Build the React app
RUN npm run build

# Serve the app
CMD ["npm", "start"]
