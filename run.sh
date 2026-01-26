#!/usr/bin/env bash

if [[ "$NODE_ENV" == "production" ]];
then
    npm run start
else
    npm run dev
fi
