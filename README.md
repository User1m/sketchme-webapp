## Synopsis

Web App to show the application of sketch2pix model


## Deploy

#### **_Prereq:_**

* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)

```
> ./docker/scripts/deploy.sh
```

This will deploy your frontend and backend to Microsoft's Azure Cloud and give you a publicly accessible endpoint for the app.

**NOTE:**

Your app will available at `https://<domain>.azurewebsites.net`. But it will take serveral mintues for the services on Azure to fully be up. Please be patient.

Additionally, the 1st run of the service will be very slow but subsequent requests should be "more" performant.

## Installation

```
docker run --rm -itd \
    -e API_URL=http://localhost:8081 \
    -p 8080:80 \
    sketchme-webapp:prod-v#
```

* **#** = tag version number (e.g. *2*)
* **API_URL** = [user1m/sketchme-backend](https://hub.docker.com/r/user1m/sketchme-backend) **host:port**


## Motivation

This application shows how we can consume the `sketchme-backend` api model.


## Acknowledgements

* [https://hub.docker.com/r/user1m/sketchme-webapp](https://hub.docker.com/r/user1m/sketchme-webapp)
* [https://hub.docker.com/r/user1m/sketchme-backend](https://hub.docker.com/r/user1m/sketchme-backend)
* [https://github.com/User1m/sketch2pix](https://github.com/User1m/sketch2pix)

## License

A short snippet describing the license (MIT, Apache, etc.)
