FROM node:9
COPY ./scripts/init.sh /scripts/init.sh
ENTRYPOINT /scripts/init.sh
