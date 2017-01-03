var server = require("cloudcms-server/server");

var frameworkControllers = require("cloudcms-server/framework/controllers");
var frameworkSockets = require("cloudcms-server/framework/sockets");

// use the special "net-production" configuration
if (!process.env.CLOUDCMS_STORE_CONFIGURATION) {
    //process.env.CLOUDCMS_STORE_CONFIGURATION = "net-production";
    
    // TODO: for now, fall back to net-development since we rely on the /hosts directory
    process.env.CLOUDCMS_STORE_CONFIGURATION = "net-development";
}

if (!process.env.CLOUDCMS_NET_GITHUB_USERNAME) {
    console.log("Missing env CLOUDCMS_NET_GITHUB_USERNAME");
}

if (!process.env.CLOUDCMS_NET_GITHUB_PASSWORD) {
    console.log("Missing env CLOUDCMS_NET_GITHUB_PASSWORD");
}

if (!process.env.CLOUDCMS_VIRTUAL_DRIVER_CLIENT_KEY) {
    throw new Error("Missing env CLOUDCMS_VIRTUAL_DRIVER_CLIENT_KEY");
}

if (!process.env.CLOUDCMS_VIRTUAL_DRIVER_CLIENT_SECRET) {
    throw new Error("Missing env CLOUDCMS_VIRTUAL_DRIVER_CLIENT_SECRET");
}

if (!process.env.CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_KEY) {
    throw new Error("Missing env CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_KEY");
}

if (!process.env.CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_SECRET) {
    throw new Error("Missing env CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_SECRET");
}

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
        "enabled": true
    },
    "virtualDriver": {
        "enabled": true,
        "clientKey": process.env.CLOUDCMS_VIRTUAL_DRIVER_CLIENT_KEY,
        "clientSecret": process.env.CLOUDCMS_VIRTUAL_DRIVER_CLIENT_SECRET,
        "username": process.env.CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_KEY,
        "password": process.env.CLOUDCMS_VIRTUAL_DRIVER_AUTHGRANT_SECRET
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
    "insight": {
        "enabled": true
    },
    "notifications": {
        "enabled": process.env.CLOUDCMS_NOTIFICATIONS_ENABLED,
        "type": "sqs",
        "configuration": {
            "queueUrl": process.env.CLOUDCMS_NOTIFICATIONS_SQS_QUEUE_URL,
            "accessKey": process.env.CLOUDCMS_NOTIFICATIONS_SQS_ACCESS_KEY,
            "secretKey": process.env.CLOUDCMS_NOTIFICATIONS_SQS_SECRET_KEY,
            "region": process.env.CLOUDCMS_NOTIFICATIONS_SQS_REGION
        }
    }
};

server.start(config);
