FROM node:16

ENV NODE_ENV=production

# Create and cd to new folder
WORKDIR /app

# Copy local package files into this directory
COPY package.json package-lock.json ./

RUN npm install --include dev

RUN ["mkdir", "src"]

COPY ./src ./src

COPY .babelrc .

EXPOSE 4000

RUN ["npm", "run", "build:webpack"]

CMD ["node", "./dist/index.js"]
