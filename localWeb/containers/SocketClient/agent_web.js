const io = require('socket.io-client');
const LogTailService = require('./Services/LogTail');
const FileSystemManager = require('./Utils/FileSystemManager');
const fs = new FileSystemManager.FileSystemManager();

function startTail(onContentUpdate) {
    const logTail = new LogTailService.LogTail(onContentUpdate);
    logTail.start();
}


// run();