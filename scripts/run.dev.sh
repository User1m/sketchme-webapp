#!/bin/bash

if [ -z "$1" ]; then
	echo "missing image tag. use 'latest' if you want 'latest' tag"
	exit 1
fi

docker run --rm -it \
	-v /Users/claudius/Documents/workspace/_ML/sketchme/sketchme-docker/sketchme-webapp/:/workdir/app/ \
	-e PORT=80 \
	-e API_URL=http://localhost:8081 \
	-p 8080:80 \
	sketchme-webapp:$1 \
	bash

#API_URL=http://clmbsketchme1.azurewebsites.net:80 \
