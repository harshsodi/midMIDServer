const io = require('socket.io-client');
const LogTailService = require('./Services/LogTail');
const FileSystemManager = require('./Utils/FileSystemManager');
const fs = new FileSystemManager.FileSystemManager();

const optionDefinitions = [
    { name: 'config', alias: 'c', type: String },
    { name: 'tail', alias: 't', type: Boolean },
];
const commandLineArgs = require('command-line-args')
const options = commandLineArgs(optionDefinitions)
console.log(options);

function loadConfig() {

    const configPath = './config.json';
    var configContent = fs.readFile(configPath);

    if (configContent) {

        try {

            const parsedConfig = JSON.parse(configContent);
            return parsedConfig;
        
        } catch(exception) {    
            console.log("Invalid syntax in config found.");
            return null;
        }

    } else {
        return null;
    }
}

function validateConfig(config) {

    if(config) {

        if(!config.mid_server_id) {
            console.log("Please provide mid_server_id in the configuration.");
            return false;
        }

        return true;

    } else {
        console.log("Null or empty configuration found.");
        return false;
    }
}

function startTail() {
    
    const config = loadConfig();
    
    if(validateConfig(config)) {

        const logTail = new LogTailService.LogTail(config);
        logTail.start();

    } else {
        console.log("Invalid configuration.");
    }
}

function run() {

    if (options['tail']) {
        startTail();
    }
}

run();