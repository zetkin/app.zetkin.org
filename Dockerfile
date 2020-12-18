FROM node:14-alpine

WORKDIR /var/app

ADD package.json /var/app/package.json
ADD package-lock.json /var/app/package-lock.json

RUN npm install

ADD . /var/app

CMD npm run dev
