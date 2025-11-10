# ---------- Stage 1: Build React App ----------
FROM node:25 AS build

# Set working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project files
COPY . .

# Build the React app
RUN npm run build

# ---------- Stage 2: Serve with Nginx ----------
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
