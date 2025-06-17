FROM node:22.16.0-alpine AS BASE

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src .

EXPOSE 3001

CMD [ "npm", "start" ]