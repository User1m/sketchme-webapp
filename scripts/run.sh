#!/bin/bash

# ./build.sh

docker run --rm -it \
	-v /Users/claudius/Documents/workspace/_ML/sketchme/sketchme-docker/sketchme-webapp/:/workdir/app/ \
	-e PORT=8080 -e API_URL=http://clmbsketchme1.azurewebsites.net:80 \
	-p 8080:8080 \
	sketchme-webapp bash
