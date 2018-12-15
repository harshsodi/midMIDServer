/****************************************************
 * This script will run on remote Dyno as entry point
 * Accept socket connections
 * Respond to events from both ends
 * 
 * Author: Harsh Sodiwala
 ****************************************************/

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var MIDServerManager_ = require('./MIDServerManager');
var MIDServerManager = new MIDServerManager_.MIDServerManager();

const port = process.env.PORT || 3000;

/**
 * Things to do when a local agent connects
 * @param {Socket} socket 
 */
function localAgentConnected(socket) {

    console.log('New Local Agent connected.');

    // Not creating a seperate handler for local agent as nobody cares about him
    // A local agent is a nobody, just a part of a roomn

    socket.on('disconnect', () => {
        console.log("A local agent disconnected.");
    })
}

function initiateConnection() {

    io.on('connection', (socket) => {

        // Only MID servers should connect to this.
        // Seperate rooms per MID Server are created for local agents needing a particular

        console.log('A client Connected on /');
        
        // When a MID server requests registration
        socket.on('registerMIDServer', dataRaw => { // From MID Server

            console.log('MID Server register request received.');

            try {

                var data;
                try {
                    data = JSON.parse(dataRaw);
                } catch(exception) {
                    console.log("Invalid JSON for MID Server data.");
                }

                var MIDServer = MIDServerManager.registerMIDServer(socket, data, io);

                if (MIDServer) {

                    if(!MIDServer.createRoom()) {
                        console.log("Aborting as room could not be created.");
                        return;
                    }
                    console.log(data.id + ": Room created.");

                    if(!MIDServer.startListeningTail()) {
                        console.log("Failed to start Tailing listener.");
                        return;
                    }
                    console.log(data.id + ": Started Tailing listener.");

                    // On the name of her megesty , make way for Local Agent
                    MIDServer.room.on('connection', localAgentConnected);
                    console.log("Listening on local agents.");
                    
                } else {
                    console.log("Could not register MID Server.");
                    // TODO: Returned nul. Do something
                }

            } catch (exception) {
                console.log("Exception : " + exception.toString());
            }
        });

        socket.on('getMidServers', () => {

            try {
                
                const midServers = MIDServerManager.getMidServers();
                const midServerIDs = Object.keys(midServers);
                const midServerList = midServerIDs.map( midServerID => {
                    console.log("MID ID: " + midServerID);
                    const midServer = midServers[midServerID]
                    return {
                        'id': midServer.data.id,
                        'name': midServer.data.name
                    }
                });
                
                console.log(midServerList);
                socket.emit('midServerListSent', JSON.stringify(midServerList));
            
            } catch(exception) {
                console.log("Failed to send the list of MID Servers. Exception: " + exception.toString());
            }
            
        });

        // When a socket connection closes
        socket.on('disconnect', () => { // From anyone
            
            // var midServer = MIDServerManager.getMidServer(socket);
            console.log("MID Server disconnected.");
            MIDServerManager.unRegisterMIDServer(socket, io);
        });
    });
}

function handleError(socket, errorMessage) {

    socket.emit('error', errorMessage);
}

// Listen on HTTP requests
http.listen(port, () => {
    console.log('Server listening on port: ' + port);
});

initiateConnection();