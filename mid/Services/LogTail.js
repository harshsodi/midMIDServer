/***********************
 * Author: Harsh Sodiwala
 ************************/

var Tail = require('always-tail');

class LogTail {

    constructor() {}

    /**
     * Initiate log tailing
     * Read on the log file and send event with updated line to cloud server
     */
    start(socket) {

        console.log("Started to emit logs.");
        
        const filename = '../logs/agent0.log.0'; // <Debugging> __dirname + '/test.txt'
        var tail = new Tail(filename);

        tail.on('line', function (line) { // When new log is added
            socket.emit('tailGenerated', line);
        });

        tail.on('close', function () {
            console.log('watching stopped');
        })

        tail.watch();

    }
}

exports.LogTail = LogTail;