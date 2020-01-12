FROM docker.io/library/node:8.11.4


RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm install

EXPOSE 3000

CMD ["node", "index.js"]
