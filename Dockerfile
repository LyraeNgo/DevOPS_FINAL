FROM node:20-slim

RUN apt-get update && apt-get upgrade -y && apt-get clean

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]