import React, {Component} from 'react';

import LogTail from '../SocketClient/Services/LogTail';
import LogFrameHeader from './LogFrameHeader'

class LogFrame extends Component {
    
    constructor(props) {

        super(props);
        this.props = props;
        
        // Initialize state
        this.state = {
            "midServerId": "",
            "logContent": ""
        };

        // Bind local methods
        this.onLogContentChange = this.onLogContentChange.bind(this);
        this.onMidServerChanged = this.onMidServerChanged.bind(this);
    
        this.logTail = new LogTail.LogTail(this.onLogContentChange);
    }

    onLogContentChange(newContent) {
        
        console.log("New content : " + newContent);
        this.setState({
            "logContent": this.state.logContent + '\n' + newContent
        });

        var textarea = document.getElementById(this.props.id + '' + this.state.midServerId);
        textarea.scrollTop = textarea.scrollHeight;
    }

    onMidServerChanged(e) {

        const midServerId = e.target.value;
        this.setState({
            "midServerId": midServerId,
            "logContent": ""
        });
        
        if(midServerId != "none") {
            this.logTail.setMidServer(midServerId);
            this.logTail.start();
        }
    }

    render () {

        var uniqueFrameID = this.props.id + '' + this.state.midServerId

        return <div>
            <center>
                <LogFrameHeader 
                    onMidServerChanged={this.onMidServerChanged}
                    onLogFrameAdded={this.props.onLogFrameAdded}
                />
                <textarea value={this.state.logContent} 
                    id={uniqueFrameID} 
                    className='log-frame shell-body'
                    spellcheck="false"
                />
            </center>
        </div>
    }
}

export default LogFrame;