FROM node:10.15.3

WORKDIR /src

COPY . .

RUN yarn

WORKDIR /src/dashboard

RUN yarn

RUN yarn build

WORKDIR /src

EXPOSE 4000

CMD ["yarn", "prod"]
