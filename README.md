## Synopsis

Web App to show the application of sketch2pix model

## Installation

```
docker run --rm -itd \
    -e API_URL=http://localhost:8081 \
    -p 8080:80 \
    sketchme-webapp:prod-v#
```
* **#** = tag version number (e.g. *2*)
* **API_URL** = user1m/sketchme-backend **host:port**


## Motivation

This application shows how we can consume the `sketchme-backend` api model.


## Acknowledgements

* [https://hub.docker.com/r/user1m/sketchme-webapp](https://hub.docker.com/r/user1m/sketchme-webapp)
* [https://hub.docker.com/r/user1m/sketchme-backend](https://hub.docker.com/r/user1m/sketchme-backend)
* [https://github.com/User1m/sketch2pix](https://github.com/User1m/sketch2pix)

## License

A short snippet describing the license (MIT, Apache, etc.)
