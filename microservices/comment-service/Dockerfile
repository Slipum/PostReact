FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache make gcc g++ python3 py3-setuptools

RUN npm cache clean --force

RUN npm install --only=production

COPY . .

RUN npm rebuild sqlite3 --build-from-source
RUN npm rebuild bcrypt --build-from-source

EXPOSE 3003

CMD ["node", "index.js"]
