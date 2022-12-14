FROM nginx:1.22-alpine
LABEL org.opencontainers.image.source = https://github.com/oakestra/dashboard
COPY dist/edgeIO-frontend /usr/share/nginx/html
COPY docker/angular-environment /usr/src/app
COPY docker/entrypoint.sh .
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["sh", "entrypoint.sh", "run"]
