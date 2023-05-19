FROM nginx:1.22-alpine
LABEL org.opencontainers.image.source = https://github.com/oakestra/dashboard
COPY dist/oakestra-dashboard /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.config.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
