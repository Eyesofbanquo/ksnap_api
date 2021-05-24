FROM node:16

ENV DATABASE_URL $DATABASE_URL

# Create and cd to new folder
WORKDIR /app

# Copy local package files into this directory
COPY package.json package-lock.json ./

RUN npm install --include dev

RUN ["mkdir", "src"]

COPY ./src ./src

COPY .babelrc .

COPY ./webpack.config.js .

EXPOSE 4000

RUN ["npm", "run", "build:sass"]

RUN ["npm", "run", "build:babel"]

CMD ["node", "./dist/index.js"]
