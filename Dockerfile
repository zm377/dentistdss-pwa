# Use official Node.js image as the base
FROM node:18-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the app
RUN npm run build

# Production stage, Serve the built app with nginx
FROM nginx:alpine

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy SSL certificates if needed
COPY ./certs /etc/nginx/certs

# Expose ports for HTTP and HTTPS
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]