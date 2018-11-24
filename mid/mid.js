const io = require('socket.io-client')('https://say-no-to-vpn.herokuapp.com/');
const logTailService = require('./Services/LogTail');

const FileSystemManager = require('./Utils/FileSystemManager');
const xml = require("xml-parse");

const fs = new FileSystemManager.FileSystemManager();

// Issue the register request

function loadConfig() {

    const configPath = '../config.xml';
    var configContent = fs.readFile(configPath);

    if (configContent) {
        return configContent;
    } else {
        return null;
    }
}

function registerMIDServer(midServerId) {

    midServerData = {
        "id": midServerId
    }
    io.emit('registerMIDServer', JSON.stringify(midServerData));
}

function startServices() {

    var logTail = new logTailService.LogTail();
    logTail.start(io);
}

function run() {

    io.on('disconnect', () => {
        console.log("Disconnected");
    });

    const config = loadConfig();
    var midServerId;

    if (config) {

        midServerId = config.match(/name\=\"mid_sys_id\" value\=\"([a-zA-Z0-9]{32})\"/)[1];

        if (midServerId) {
            registerMIDServer(midServerId);
            startServices();
        } else {
            console.log("Failed to fetch ID from config.xml");
        }

    } else {
        console.log("Failed to read config file.");
    }
}

run();