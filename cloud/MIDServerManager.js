/**
 * A seperate handler for MID Server
 * Because MID Server matters for everyone
 */

class MIDServer {

    constructor(data, socket) {

        this.data = data;
        this.socket = socket;
    }

    /**
     * Create event listeners on dedicated channel (room)
     * @param {Socket} io 
     */
    createRoom(io) {

        try {

            var midServerID = this.data.id;
            this.room = io.of(midServerID);

        } catch (exception) {
            // TODO: Handle exception
            console.log("Exception creating room: " + exception.toString());
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

                    console.log("Tail received : " + data);
                    context.room.emit('tailGenerated', data)
                });

            } else {
                // TODO: Room is not yet created.
                console.log("Room not created");
            }

        } catch(exception) {
            // TODO: Could not start tailing.
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

        return this.midServers();
    }

    /**
     * Lookup for a MID Server
     * @param {Socket} socket Reference for MID Server
     * 
     * @returns {MIDServer} 
     */
    getMidServer(midServerID) {

        var midServer = this.midServers[midServerID];
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
    registerMIDServer(socket, data) {

        // Create new MID Server object and add to list
        try {

            if (data && data.id) {

                var midServerID = data.id
                if (this.midServers[midServerID]) {
                    // TODO: Already exist. Do something
                    return null;
                } else {
                    this.midServers[midServerID] = new MIDServer(data, socket);
                    return this.midServers[midServerID];
                }
            
            } else {
                // TODO: Do something
            }
            
        } catch (exception) {
            console.log("Error while registering : " + exception.toString());
            return null
        }

    }
}

exports.MIDServerManager = MIDServerManager;