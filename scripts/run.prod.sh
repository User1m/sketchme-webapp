#!/bin/bash

if [ -z "$1" ]; then
	echo "missing image tag. use 'latest' if you want 'latest' tag"
	exit 1
fi

docker run --rm -itd \
	-e PORT=80 \
	-e API_URL=http://localhost:8081 \
	-p 8080:80 \
	sketchme-webapp:prod-$1

#API_URL=http://clmbsketchme1.azurewebsites.net:80 \
