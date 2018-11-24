// const Tail = require('tail').Tail;
var Tail = require('always-tail');
// const Tail = require('nodejs-tail');

class LogTail {

    constructor() {

    }

    /**
     * 
     */
    start(socket) {

        // Start emitting the tail
        console.log("Started to emit logs.");

        const filename = './Services/test.txt';
        // const tail = new Tail(filename);

        var tail = new Tail(filename);

        tail.on('line', function (line) {
            console.log(line);
            socket.emit('tailGenerated', line);
        });

        tail.on('close', function () {
            console.log('watching stopped');
        })

        tail.watch();

    }
}

exports.LogTail = LogTail;