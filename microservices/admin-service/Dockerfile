FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm rebuild sqlite3 bcrypt

EXPOSE 3004

CMD ["node", "index.js"]
