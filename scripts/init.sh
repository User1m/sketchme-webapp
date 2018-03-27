#!/bin/bash

ln -s /workdir/app/pacakge.json /workdir/pacakge.json
cd /workdir/ && npm i
export PATH=/workdir/node_modules/.bin/:$PATH
cd /workdir/app/ && npm start &
bash
