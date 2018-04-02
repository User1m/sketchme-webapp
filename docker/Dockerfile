FROM node:9
WORKDIR /workdir
COPY package.json /workdir/package.json
RUN cd /workdir/ && npm i
COPY . /workdir/app/
ENV PATH=/workdir/node_modules/.bin/:$PATH
EXPOSE 80
CMD cd /workdir/app/ && npm start
