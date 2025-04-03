FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install

EXPOSE 5000

ENV NODE_ENV=production
CMD [ "node", "index.js" ]
