FROM node:14.18

WORKDIR /src

COPY ./package.json .
COPY ./yarn.lock .

RUN yarn

WORKDIR /src/dashboard

COPY ./dashboard/package.json .
COPY ./dashboard/yarn.lock .

RUN yarn

WORKDIR /src

COPY . .

WORKDIR /src/dashboard

RUN yarn build

WORKDIR /src

EXPOSE 4000

CMD ["yarn", "prod"]
