FROM node:20.18.1-alpine AS client
WORKDIR /app
ADD *.json .
RUN npm ci
ADD . .
RUN npm run build


FROM node:20.18.1-alpine
WORKDIR /app
COPY --from=client /app/.next .next
ADD *.json .
RUN npm ci --omit=dev