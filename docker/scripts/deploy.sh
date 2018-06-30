#!/bin/bash

if ! command -V az >/dev/null 2>&1; then
    echo "Need Azure Cli installed to proceed. Please install the command 'az'."
    exit 1;
fi

UUID=$(echo $RANDOM | tr '[0-9]' '[a-zA-Z]')
FRONT_END=user1m/sketchme-webapp:prod-v2
BACK_END=user1m/sketchme-backend:prod-v2

# create resource group
az group create --name sketchme-$UUID --location "westus"

# create app service plan
az appservice plan create --name sketchme-$UUID \
--resource-group sketchme-$UUID --sku S1 --is-linux

# deploy backend
az webapp create --resource-group sketchme-$UUID \
--plan sketchme-$UUID --name sketchme-back-$UUID --deployment-container-image-name $BACK_END

# deploy frontend
az webapp create --resource-group sketchme-$UUID \
--plan sketchme-$UUID --name sketchme-front-$UUID --deployment-container-image-name $FRONT_END

## Set Container ENVs
### https://docs.microsoft.com/en-us/cli/azure/webapp/config/appsettings?view=azure-cli-latest#az_webapp_config_appsettings_set
az webapp config appsettings set \
--resource-group sketchme-$UUID \
--name sketchme-back-$UUID \
--settings PORT=80 \
WEBSITES_ENABLE_APP_SERVICE_STORAGE=false \
WEBSITE_NODE_DEFAULT_VERSION=9.4 \
WORKSPACE_PATH=/workdir/model \
PY_PATH=/usr/local/bin/python


az webapp config appsettings set \
--resource-group sketchme-$UUID \
--name sketchme-front-$UUID \
--settings PORT=80 \
API_URL="//sketchme-back-$UUID.azurewebsites.net" \
WEBSITE_NODE_DEFAULT_VERSION=9.4

## Enable CI
### https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-ci-cd
# echo "Take the CI_CD_URL below and create a Docker Hub Webhook..."
az webapp deployment container config --name sketchme-back-$UUID --resource-group sketchme-$UUID --enable-cd true
az webapp deployment container config --name sketchme-front-$UUID --resource-group sketchme-$UUID --enable-cd true

## Restart webapps
az webapp restart --resource-group sketchme-$UUID  --name sketchme-back-$UUID
az webapp restart --resource-group sketchme-$UUID  --name sketchme-front-$UUID

echo -e "\n\nNOTE:\nScript completed.\nYour app will available at https://sketchme-front-$UUID.azurewebsites.net\nBut it will take serveral mintues for the services on Azure to fully be up.\nPlease be patient."