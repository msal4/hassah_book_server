FROM node:14.18

ENV DASHBOARD_PUBLIC_URL=/dashboard
ENV DASHBOARD_GRAPHQL_URL=

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

RUN GRAPHQL_URL=${DASHBOARD_GRAPHQL_URL} PUBLIC_URL=${DASHBOARD_PUBLIC_URL} yarn build

WORKDIR /src

EXPOSE 4000

CMD ["yarn", "prod"]
