FROM node:20.15.0-bullseye AS builder

WORKDIR /app

COPY package.json ./

RUN yarn

COPY . .

RUN --mount=type=cache,target=/root/.yarn yarn build

FROM node:20.15.0-bullseye-slim

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/web-server.js /app/web-server.js

EXPOSE 5173

CMD ["node" , "web-server.js"]