FROM node:14

WORKDIR /var/app

COPY package.json /var/app/package.json
COPY yarn.lock /var/app/yarn.lock
RUN yarn install --no-cache --frozen-lockfile

COPY . /var/app

CMD ./run.sh
