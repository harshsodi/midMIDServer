const io = require('socket.io-client');

class LogTail {

    constructor(onContentUpdate) { // TODO : Config if from console

        // this.config = config;
        this.onContentUpdate = onContentUpdate;
        this.midServerId = null;

        this.logConn = null;
    }

    setMidServer(midServerId) {
        
        this.midServerId = midServerId;

        if(this.logConn) {
            this.logConn.disconnect();
        }

        this.logConn = io('https://say-no-to-vpn.herokuapp.com/' + this.midServerId);
    }

    start() {

        // const logConn = io('https://say-no-to-vpn.herokuapp.com/' + this.config.mid_server_id );
        
        if(!this.midServerId) { // If MID Server is yet to be set
            console.log("Cannot start without setting MID Server ID.");
            return null;
        }
        
        this.logConn.on('tailGenerated', line => {
            console.log("Line: " + line);
            this.onContentUpdate(line); 
        });
    }
}

exports.LogTail = LogTail;