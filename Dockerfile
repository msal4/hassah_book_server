FROM node:14.18

ARG PUBLIC_URL=/dashboard
ARG REACT_APP_GRAPHQL_URL
ARG REACT_APP_CDN_URL

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

RUN REACT_APP_GRAPHQL_URL=${REACT_APP_GRAPHQL_URL} REACT_APP_CDN_URL=${REACT_APP_CDN_URL} PUBLIC_URL=${PUBLIC_URL} yarn build

WORKDIR /src

EXPOSE 4000

CMD ["yarn", "prod"]
