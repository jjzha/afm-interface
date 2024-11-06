# Stage 1: Build the React app
FROM node:20.18.0-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install 
RUN npm install lucide-react react-markdown remark-gfm

# Copy the rest of the frontend source code
COPY . .

# Build the app
RUN npm run build

# Stage 2: Serve the React app using Nginx
FROM nginx:stable-alpine

# Remove default Nginx content and configuration
RUN rm -rf /usr/share/nginx/html/* \
    && rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/

# Copy the build output to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
