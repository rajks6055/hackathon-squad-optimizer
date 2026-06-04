FROM node:18-bullseye-slim
RUN apt-get update && apt-get install -y g++
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN g++ -O3 engine/optimizer.cpp -o engine/optimizer
EXPOSE 3000
CMD ["node", "server.js"]