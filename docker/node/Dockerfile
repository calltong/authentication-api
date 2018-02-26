FROM node:6.9.1-alpine

RUN mkdir /app
WORKDIR /app

RUN npm install --global nodemon
RUN npm install --global pm2
RUN npm install --global babel-cli

CMD ["npm", "start"]
