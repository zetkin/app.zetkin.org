#!/bin/sh

set -e

exec 2>&1

echo "Generating nginx config files"
rm /etc/nginx/sites-enabled/*
for tpl in /etc/nginx/sites-templates/*.conf
do
    conf=`basename $tpl`
    envtpl < $tpl > /etc/nginx/sites-enabled/$conf
done

if [ -n "$APP_USE_TLS" ]
then
    echo "Requesting TLS certificate for system"
    letsencrypt certonly \
        --standalone \
        --keep-until-expiring \
        --expand \
        --non-interactive \
        --agree-tos \
        --email info@zetkin.org \
        --domain $APP_DOMAIN
else
    echo "Not using TLS"
fi

echo "Booting nginx"
exec nginx
