
import React, { Component } from 'react';

import LogFrame from './LogFrame';
import './style.css'

class App extends Component {

    constructor() {

        super();
        this.state = {
            'logFrames': [
                {
                    'id': 0,
                }
            ],
            'newframeID': 1,
        };

        this.logFrameAdded = this.logFrameAdded.bind(this);
    }

    logFrameAdded() {

        var currentFrames = this.state.logFrames;
        var newFrameID = this.state.newFrameID;
        currentFrames.push({
            'id': newFrameID
        });

        this.setState({
            'newFrameID': newFrameID + 1,
            'logFrames': currentFrames
        });
    }

    render() {

        const logFrames = this.state.logFrames;
        const logFrameComponentsList = logFrames.map(logFrame => {
            return <LogFrame 
                id={logFrame.id} 
                key={logFrame.id}
                onLogFrameAdded ={this.logFrameAdded}
                className="log-frame-container"
            />
        })

        return <ul>{logFrameComponentsList}</ul>
    }
}

export default App;