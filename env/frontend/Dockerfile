FROM node:22

WORKDIR /var/app

COPY package.json /var/app/package.json
COPY package-lock.json /var/app/package-lock.json
RUN npm ci

COPY . /var/app
RUN npm run build

ARG ZETKIN_APP_VERSION
ENV ZETKIN_APP_VERSION=$ZETKIN_APP_VERSION

CMD ./run.sh
