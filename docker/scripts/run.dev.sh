#!/bin/bash

if [ -z "$1" ]; then
	echo "missing image tag. use 'latest' if you want 'latest' tag"
	exit 1
fi

docker run --rm -it \
	-v /Users/claudius/Documents/workspace/_ML/sketchme/sketchme-docker/frontend/docker/scripts/init.sh:/scripts/init.sh \
	-v /Users/claudius/Documents/workspace/_ML/sketchme/sketchme-docker/frontend/:/workdir/app/ \
	-e PORT=80 \
	-e API_URL=http://localhost:8081 \
	-p 8080:80 \
	--name sketchme-frontend \
	sketchme-webapp:prod-$1 \
	bash -c "/scripts/init.sh"
