# Cloud CMS Virtual Server

This project provides an empty hosted application for the Cloud CMS Virtual Hosting tier.  

By being available, it allows the application server to serve requests for externally hosted applications that seek to use the Cloud CMS Application server APIs, controllers and other features.

## Basic Usage

To launch the app server, you basically need to do the following:

    docker run -e "PORT=8080" -p 8080:8080 cloudcms/app-server

This launches the app server on port 8080.

## Static Web Root

If you have a single set of files you'd like to serve, mount in a `public` directory.

    docker run --volume /dev/public:/var/app/current/public -p 8080:8080 cloudcms/app-server

## Virtual Hosting

To take advantage of virtual hosting, you will need to have an on-premise Cloud CMS instance.
Provide the following environment variables:

    CLOUDCMS_VIRTUAL_HOST_ENABLED=true
    CLOUDCMS_VIRTUAL_DRIVER_CLIENT_KEY=
    CLOUDCMS_VIRTUAL_DRIVER_CLIENT_SECRET=
    CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_KEY=
    CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_SECRET=
    
These should match the values in your API properties file.

## Notifications

To support SQS notifications, configure the following:

    CLOUDCMS_NOTIFICATIONS_ENABLED=true
    CLOUDCMS_NOTIFICATIONS_SQS_QUEUE_URL=
    CLOUDCMS_NOTIFICATIONS_SQS_ACCESS_KEY=
    CLOUDCMS_NOTIFICATIONS_SQS_SECRET_KEY=
    CLOUDCMS_NOTIFICATIONS_SQS_REGION=
    
## Deployment

To support code deployment, configure the following:

    CLOUDCMS_NET_GITHUB_USERNAME=
    CLOUDCMS_NET_GITHUB_PASSWORD=
    