FROM node:12
RUN apt-get update && apt-get install -y graphicsmagick &&apt-get install -y tesseract-ocr
ENV	PORT="${PORT}"
ENV TZ=Europe/Moscow
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${PORT}
CMD [ "npm", "start" ]