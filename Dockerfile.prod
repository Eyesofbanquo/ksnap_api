FROM node:16

ENV NODE_ENV=production

# Create and cd to new folder
WORKDIR /app

# Copy local package files into this directory
COPY package*.json ./

RUN npm install

RUN ["mkdir", "src"]

COPY ./src ./src

COPY tsconfig.json .

EXPOSE 4000

RUN ["npm", "run", "build:babel"]

CMD ["node", "./dist/index.js"]
