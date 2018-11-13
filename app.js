var server = require("cloudcms-server/server");

var frameworkControllers = require("cloudcms-server/framework/controllers");
var frameworkSockets = require("cloudcms-server/framework/sockets");

if (process.env.CLOUDCMS_NOTIFICATIONS_ENABLED) {

    if (!process.env.CLOUDCMS_NOTIFICATIONS_SQS_QUEUE_URL) {
        process.env.CLOUDCMS_NOTIFICATIONS_ENABLED = false;
    }

    if (!process.env.CLOUDCMS_NOTIFICATIONS_SQS_ACCESS_KEY) {
        process.env.CLOUDCMS_NOTIFICATIONS_ENABLED = false;
    }

    if (!process.env.CLOUDCMS_NOTIFICATIONS_SQS_SECRET_KEY) {
        process.env.CLOUDCMS_NOTIFICATIONS_ENABLED = false;
    }

    if (!process.env.CLOUDCMS_NOTIFICATIONS_SQS_REGION) {
        process.env.CLOUDCMS_NOTIFICATIONS_ENABLED = false;
    }
}

/**
 * Default route handlers
 */
server.routes(function(app, callback) {
    frameworkControllers.init(app, function(err) {
        callback(err);
    });
});

/**
 * Default socket handlers
 */
server.sockets(function(socket, callback) {
    frameworkSockets.init(socket, function(err) {
        callback(err);
    });
});

/*
// after
server.after(function(app, callback) {
    callback();
});
*/

// report
server.report(function(callback) {
    
    console.log("");
    console.log("Cloud CMS Virtual Server started! (v" + process.env.CLOUDCMS_APPSERVER_PACKAGE_VERSION + ")");
    console.log("");
            
    var cpuCount = require('os').cpus().length;
    
    // provide some debug info
    console.log("");
    console.log("Node Version: " + process.version);
    console.log("Server Mode: " + process.env.CLOUDCMS_APPSERVER_MODE);
    console.log("Server Base Path: " + process.env.CLOUDCMS_APPSERVER_BASE_PATH);
    console.log("Gitana Scheme: " + process.env.GITANA_PROXY_SCHEME);
    console.log("Gitana Host: " + process.env.GITANA_PROXY_HOST);
    console.log("Gitana Port: " + process.env.GITANA_PROXY_PORT);
    console.log("CPU Count: " + cpuCount);
    
    var virtualHost = null;
    if (process.env.CLOUDCMS_VIRTUAL_HOST) {
        virtualHost = process.env.CLOUDCMS_VIRTUAL_HOST;
    }
    if (!virtualHost && process.env.CLOUDCMS_VIRTUAL_HOST_DOMAIN) {
        virtualHost = "*." + process.env.CLOUDCMS_VIRTUAL_HOST_DOMAIN;
    }
    if (virtualHost)
    {
        console.log("Virtual Host: " + virtualHost);
    }
    
    console.log("Store Configuration: " + process.env.CLOUDCMS_STORE_CONFIGURATION);
    console.log("Broadcast Provider: " + process.env.CLOUDCMS_BROADCAST_TYPE);
    console.log("Cache Provider: " + process.env.CLOUDCMS_CACHE_TYPE);
    console.log("Temp Directory: " + process.env.CLOUDCMS_TEMPDIR_PATH);
    console.log("LaunchPad Mode: " + process.env.CLOUDCMS_LAUNCHPAD_SETUP);
    console.log("Max Files Detected: " + process.env.CLOUDCMS_MAX_FILES);
    console.log("Virtual Host Enabled: " + config.virtualHost.enabled);
    
    console.log("");        
    console.log("Web Server: http://localhost:" + process.env.PORT);
    console.log("");        
    
    callback();
    
});

// start the server
// use xhr-polling since socket connections seem to fail after awhile?
var config = {
    "setup": "single",
    "virtualHost": {
        "enabled": false
    },
    "virtualDriver": {
        "enabled": false
    },
    "wcm": {
        "enabled": true,
        "cache": false
    },
    "serverTags": {
        "enabled": true
    },
    "autoRefresh": {
        "log": true
    },
    "welcome": {
        "enabled": true,
        "file": "index.html"
    }
};

if (process.env.CLOUDCMS_NOTIFICATIONS_ENABLED)
{
    config.notifications = {
        "enabled": process.env.CLOUDCMS_NOTIFICATIONS_ENABLED,
        "type": "sqs",
        "configuration": {
            "queueUrl": process.env.CLOUDCMS_NOTIFICATIONS_SQS_QUEUE_URL,
            "accessKey": process.env.CLOUDCMS_NOTIFICATIONS_SQS_ACCESS_KEY,
            "secretKey": process.env.CLOUDCMS_NOTIFICATIONS_SQS_SECRET_KEY,
            "region": process.env.CLOUDCMS_NOTIFICATIONS_SQS_REGION
        }        
    };
}

// configure virtual driver
if (process.env.CLOUDCMS_VIRTUAL_DRIVER_CLIENT_KEY && 
    process.env.CLOUDCMS_VIRTUAL_DRIVER_CLIENT_SECRET && 
    process.env.CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_KEY &&
    process.env.CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_SECRET)
{
    config.virtualHost.enabled = true;
    
    config.virtualDriver.enabled = true;
    config.virtualDriver.clientKey = process.env.CLOUDCMS_VIRTUAL_DRIVER_CLIENT_KEY;
    config.virtualDriver.clientSecret = process.env.CLOUDCMS_VIRTUAL_DRIVER_CLIENT_SECRET;
    config.virtualDriver.username = process.env.CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_KEY;
    config.virtualDriver.password = process.env.CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_SECRET;
}

// auto-configure stores
if (!process.env.CLOUDCMS_STORE_CONFIGURATION) {

    if (config.virtualHost.enabled)
    {
        process.env.CLOUDCMS_STORE_CONFIGURATION = "net-development";        
    }
    else
    {
        process.env.CLOUDCMS_STORE_CONFIGURATION = "default";        
    }
}

server.start(config);
