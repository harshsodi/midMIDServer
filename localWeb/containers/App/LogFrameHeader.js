import React, {Component} from 'react';
import { MIDServerManager } from '../../../cloud/MIDServerManager';

class LogFrameHeader extends Component{

    constructor(props) {

        super(props);

        this.props = props;
        this.state = {
            'midServerList': []
        }

        this.midSocket = require('socket.io-client')('https://say-no-to-vpn.herokuapp.com/');
        
        var context = this;
        this.midSocket.on('disconnect', () => {

            console.log("Disconnected. Retrying...");
            context.midSocket = require('socket.io-client')('https://say-no-to-vpn.herokuapp.com/');
        });

        this.midSocket.on('midServerListSent', data => {

            try {

                var midServerData = JSON.parse(data);
                
                if(midServerData.length) {   
                    
                    console.log(Object.keys(midServerData[0]) + ": " + JSON.stringify(midServerData));
                    
                    this.setState({
                        'midServerList': midServerData
                    });
                    
                } else {
                    console.log("No mid servers registered.");
                }

            } catch(exception) {
                console.log("Error while parsing getMidServers response. Data: " + data +". Exception: " + exception.toString());
                return;
            }
        });

        this._getMidServerList();
    }

    _getMidServerList() {

        this.midSocket.emit('getMidServers');
    }

    render() {

        return <div className="shell-top-bar">
            <select onChange={this.props.onMidServerChanged} className="server-selector">
                <option selected key="none" value="none">--None--</option>
                {this.state.midServerList.map( midServer => {
                    return <option value={midServer.id} key={midServer.id}>{midServer.name}</option>
                })}
            </select>
            <button onClick={this.props.onLogFrameAdded}>Add</button>
        </div>
    }
}

export default LogFrameHeader;