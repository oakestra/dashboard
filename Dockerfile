
FROM nginx:1.17-alpine
COPY dist/edgeIO-frontend /usr/share/nginx/html
COPY docker/angular-environment /usr/src/app
COPY entrypoint.sh .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["sh", "entrypoint.sh", "run"]
