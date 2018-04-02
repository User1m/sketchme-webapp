#!/bin/bash

ln -sf /workdir/app/package.json /workdir/package.json
cd /workdir/app/ && npm start &
bash
