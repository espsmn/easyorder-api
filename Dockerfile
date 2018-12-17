FROM node:alpine

ARG cache_bust=1

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

# Port
EXPOSE 3000

# Execution commands
CMD ["npm", "start", "--address=0.0.0.0"]
