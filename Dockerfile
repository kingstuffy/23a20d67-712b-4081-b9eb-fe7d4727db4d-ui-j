FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .

ARG PORT
ENV PORT=${PORT}

ARG BASE_API_URL
ENV BASE_API_URL=${BASE_API_URL}

ARG DEFAULT_PRODUCT_SLUG
ENV DEFAULT_PRODUCT_SLUG=${DEFAULT_PRODUCT_SLUG}

RUN yarn build

# production stage
FROM socialengine/nginx-spa:latest as production-stage
COPY --from=build-stage /app/application /app
RUN chmod -R 777 /app
EXPOSE ${PORT}
