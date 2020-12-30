FROM node:10.15.3

WORKDIR /src

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn

COPY . .

EXPOSE 4000

CMD ["yarn", "prod"]
