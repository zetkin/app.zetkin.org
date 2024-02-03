FROM phusion/baseimage:focal-1.0.0

RUN apt-get update
RUN apt-get install -y nginx
RUN apt-get install -y python3-pip
RUN apt-get install -y letsencrypt

RUN pip install envtpl

RUN echo 'daemon off;' >> /etc/nginx/nginx.conf

RUN mkdir /etc/service/nginx
ADD run.sh /etc/service/nginx/run

ADD insecure.conf /etc/nginx/sites-templates/
ADD default.conf /etc/nginx/sites-templates/
