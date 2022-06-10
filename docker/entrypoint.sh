#!/bin/bash
echo ""
echo "ENTRYPOINT: Installing NodeJS and NPM"
apk add --update nodejs npm
echo ""
sync

echo "ENTRYPOINT: Installing angular-server-side-configuration"
cd /usr/src/app
npm install
echo ""
sync

echo "ENTRYPOINT: Adding environment variables to index.html"
npm run set-env
sync

echo "ENTRYPOINT: Removing node and other stuff"
# rm /usr/src/app
apk del npm nodejs
echo ""
sync

echo "ENTRYPOINT: Starting NGINX"
nginx -g "daemon off;"
