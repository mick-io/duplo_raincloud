FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 4000

CMD [ "node", "bin/server.js" ]
