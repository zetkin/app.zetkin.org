#!/usr/bin/env bash

if [[ "$NODE_ENV" == "production" ]];
then
    yarn start
else
    yarn dev
fi
