/******************************************************************************
 * The agent to deploy on the MID Server
 * Copy the 'mid' directory in the agent directory and run the following command
 * $ node mid.js > stdout.txt 2> stderr.txt &
 * 
 * Author: Harsh Sodiwala
 *******************************************************************************/

var socket_client = require('socket.io-client');
const logTailService = require('./Services/LogTail');

const FileSystemManager = require('./Utils/FileSystemManager');
const fs = new FileSystemManager.FileSystemManager();
var io;

/**
 * Fetch the content of config.xml
 * 
 * @returns {String}
 */
function loadConfig() {

    const configPath = '../config.xml';
    var configContent = fs.readFile(configPath);

    if (configContent) {
        return configContent;
    } else {
        return null;
    }
}

/**
 * Register the MID Server on the cloud server
 * @param {String} midServerId 
 * @param {String} midServerName 
 */
function registerMIDServer(midServerId ,midServerName) {

    console.log("Registering MID Server: " + midServerName + ": " + midServerId);
    
    var midServerData = {
        "id": midServerId,
        "name": midServerName
    }
    
    // Establish new socket channel and send registration request
    io = require('socket.io-client')('https://say-no-to-vpn.herokuapp.com/');
    io.on('disconnect', () => {
        console.log("Disconnected.");
        console.log("Reconnecting...");
        registerMIDServer(midServerId, midServerName);
    });
    io.emit('registerMIDServer', JSON.stringify(midServerData));

    // Ping every 2 minutes
    setInterval(() => {
        io.emit('keep-alive');
    }, 120000);

    // Start tailing logs
    var logTail = new logTailService.LogTail();
    logTail.start(io);
}

/**
 * The entry point
 */
function run() {

    // Get content from config.xml
    const config = loadConfig();
    var midServerId, midServerName;

    if (config) {

        // Fetch MID Server ID and MID Server name from config.xml
        midServerId = config.match(/name\=\"mid_sys_id\" value\=\"([a-zA-Z0-9]{32})\"/)[1];
        midServerName = config.match(/name\=\"name\" value\=\"([^\"]+)\"/)[1];

        if (midServerId && midServerName) {
            registerMIDServer(midServerId, midServerName);
        } else {
            console.log("Failed to fetch ID from config.xml");
        }

    } else {
        console.log("Failed to read config file.");
    }
}

run();