#!/bin/bash

if [ -z "$1" ]; then
	echo "missing image tag. use 'latest' if you want 'latest' tag"
	exit 1
fi

docker build -t sketchme-webapp:$1 \
	-f /Users/claudius/Documents/workspace/_ML/sketchme/sketchme-docker/sketchme-webapp/Dockerfile \
	/Users/claudius/Documents/workspace/_ML/sketchme/sketchme-docker/sketchme-webapp/.
