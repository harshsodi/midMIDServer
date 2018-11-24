var io = require('socket.io-client')('https://say-no-to-vpn.herokuapp.com/');
var logTail = require('./Services/LogTail');

// Build MID Server data required by cloud agent
midServerData = {
    "id" : "9898548458"
}

// Issue the register request
io.emit('registerMIDServer', JSON.stringify(midServerData));

console.log("Registration done.");
logTail = new logTail.LogTail();
logTail.start(io);