FROM node:14.15.1-alpine3.12

WORKDIR /app

ENV NODE_ENV development
COPY yarn.lock ./
RUN npm install

COPY . .

COPY .env.development ./

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]