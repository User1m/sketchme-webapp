#!/bin/bash

if [ -z "$1" ]; then
	echo "missing image prod tag. use 'latest' if you want 'latest' tag"
	exit 1
fi

docker build -t sketchme-webapp:prod-$1 \
	-f /Users/claudius/Documents/workspace/_ML/sketchme/sketchme-docker/sketchme-webapp/Dockerfile.prod \
	/Users/claudius/Documents/workspace/_ML/sketchme/sketchme-docker/sketchme-webapp/.
