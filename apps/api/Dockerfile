FROM node:24

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3333

CMD ["npm", "run", "dev", "-w", "apps/api"]