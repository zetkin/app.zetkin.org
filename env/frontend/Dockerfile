FROM node:14

WORKDIR /var/app

COPY package.json /var/app/package.json
COPY yarn.lock /var/app/yarn.lock
RUN yarn install

COPY . /var/app

CMD ./run.sh
