FROM node:23-alpine3.20 as base
FROM base AS builder
VOLUME /app
COPY package.json /app/
WORKDIR /app
RUN npm i 
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
