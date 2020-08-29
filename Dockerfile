FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --only=prod

EXPOSE 4000

COPY . .

CMD ["npm", "start"]


