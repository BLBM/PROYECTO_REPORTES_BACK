FROM node:18.16-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 7007

CMD ["npm", "start"]