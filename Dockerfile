FROM node:12
RUN apt-get update && apt-get install -y imagemagick &&apt-get install -y tesseract-ocr
ENV TZ=Europe/Moscow
WORKDIR /usr/src/app
COPY /api/package*.json ./api/
COPY /frontEnd/package*.json ./frontEnd/
WORKDIR /usr/src/app/api
RUN npm install
COPY . .
CMD [ "npm", "start" ]
WORKDIR /usr/src/app/frontEnd
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]