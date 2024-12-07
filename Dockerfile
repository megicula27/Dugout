# Use Node.js LTS as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN ln -sf /usr/share/zoneinfo/Asia/Kolkata /etc/localtime && echo "Asia/Kolkata" > /etc/timezone

# Copy the rest of the project files
COPY . .
# Copy environment variables
COPY .env .env

# Expose ports for Next.js (3000) and Socket.IO (4000)
EXPOSE 3000 4000

# Start the application (adjust as per your scripts in package.json)
CMD ["npm", "run", "dev"]
