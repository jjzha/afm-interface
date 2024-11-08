# Stage 1: Build the Next.js app
FROM node:20.18.0-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies in one command
RUN npm install --legacy-peer-deps

# Copy the rest of the application source code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Run the Next.js app
FROM node:20.18.0-alpine

WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public 

# Expose the Next.js port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
