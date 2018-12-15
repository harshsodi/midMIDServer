/*****************************************
 * A seperate handler for MID Server
 * Because MID Server matters for everyone
 * 
 * Author: Harsh Sodiwala
 ******************************************/

class MIDServer {

    constructor(data, socket, io) {

        this.data = data;
        this.socket = socket;
        this.io = io;
    }

    /**
     * Create event listeners on dedicated channel (room) 
     */
    createRoom() {

        try {

            var midServerID = this.data.id;
            this.room = this.io.of(midServerID);
            
            return true;

        } catch (exception) {
            console.log("Exception creating room: " + exception.toString());
            return false;
        }

    }

    /**
     * Start Tailing service
     */
    startListeningTail() {

        try {

            var context = this;

            if (this.room) {

                // On tail event, emit the received tail in the room
                this.socket.on('tailGenerated', data => {
                    console.log("Tail received:" + data);
                    context.room.emit('tailGenerated', data)
                });

                return true;
            } else {
                console.log("Listening request issued before creating room.");
                return false;
            }

        } catch (exception) {
            console.log("Exception starting tailing : " + exception.toString());
        }
    }
}

class MIDServerManager {

    constructor() {

        this.midServers = {};
    }

    /**
     * Get the list of registered MID Servers
     * 
     * @returns {Array}
     */
    getMidServers() {

        return this.midServers;
    }

    _getMidServerBySocket(socket) {

        for(var midServerKey in this.midServers) {
            
            var midServer = this.midServers[midServerKey];
            
            if(midServer.socket == socket) {
                return midServer;
            } 
        }

        return null;
    }

    /**
     * Lookup for a MID Server
     * @param {Socket} socket Reference for MID Server
     * 
     * @returns {MIDServer} 
     */
    getMidServer(identifier) {

        var midServer;

        if (typeof identifier == "string") {
            midServer = this.midServers[identifier];
        } else if (typeof identifier == "object") {
            midServer = this._getMidServerBySocket(identifier);
        }

        if (midServer) {
            return midServer;
        } else {
            return null;
        }
    }

    /**
     * 
     * @param {Socket} socket 
     * @param {String} dataRaw JSON string of MID Server data 
     */
    registerMIDServer(socket, data, io) {

        // Create new MID Server object and add to list
        try {

            if (data && data.id) {

                var midServerID = data.id
                
                if (this.midServers[midServerID]) {

                    console.log("MID Server already registered");
                    return null;
                
                } else {
                
                    var newMidServer = new MIDServer(data, socket, io);
                    this.midServers[midServerID] = newMidServer;
                    return this.midServers[midServerID];
                
                }

            } else {
                console.log('Problem with data.');
                return null;
            }

        } catch (exception) {
            console.log("Error while registering : " + exception.toString());
            return null
        }
    }

    unRegisterMIDServer(socket, io) {

        try {
            for(var midServerKey in this.midServers) {
                var midServer = this.midServers[midServerKey];
                
                if(midServer.socket == socket) {
                    
                    var room = midServer.room

                    const connectedNameSpaceSockets = Object.keys(room.connected); // Get Object with Connected SocketIds as properties
                    connectedNameSpaceSockets.forEach(socketId => {
                        room.connected[socketId].disconnect(); // Disconnect Each socket
                    });
                    room.removeAllListeners(); // Remove all Listeners for the event emitter
                    
                    var nsp = '/' + midServerKey;
                    delete io.nsps[nsp];
                    delete this.midServers[midServerKey];
                } 
            }
        } catch(exception) {
            console.log("Error while disconnecting. " + exception.toString());
        }        
    }
}

exports.MIDServerManager = MIDServerManager;