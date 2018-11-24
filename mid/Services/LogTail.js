const Tail = require('tail').Tail;

class LogTail {

    constructor() {

    }

    /**
     * 
     */
    start(socket) {

        // Start emitting the tail
        console.log("Started to emit logs.");

        // On tail, issue 'tailGenerated' event

        const filename = './Services/test.txt';
        const tail = new Tail(filename);

        tail.on('line', function (line) {
            console.log("Tailed it");
            socket.emit('tailGenerated', line);
        });

        tail.on('close', function () {
            console.log('watching stopped');
        })

        tail.watch();

    }
}

exports.LogTail = LogTail;