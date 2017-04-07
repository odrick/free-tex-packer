import React from 'react';

import ImagesList from './ImagesList.jsx';
import PackProperties from './PackProperties.jsx';
import PackResults from './PackResults.jsx';
import MessageBox from './MessageBox.jsx';
import ProcessingShader from './ProcessingShader.jsx';
import OldBrowserBlocker from './OldBrowserBlocker.jsx';

import {Observer, GLOBAL_EVENT} from '../Observer';

class MainLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messageBox: null,
            shader: false
        };

        this.closeMessage = this.closeMessage.bind(this);
        
        Observer.on(GLOBAL_EVENT.SHOW_MESSAGE, this.showMessage, this);
        Observer.on(GLOBAL_EVENT.SHOW_SHADER, this.showShader, this);
        Observer.on(GLOBAL_EVENT.HIDE_SHADER, this.hideShader, this);
    }

    showMessage(content, buttons=null) {
        if(this.state.messageBox) return;
        
        let box = (<MessageBox content={content} buttons={buttons} closeCallback={this.closeMessage} />);
        this.setState({messageBox: box});
    }
    
    closeMessage() {
        this.setState({messageBox: null});
    }

    showShader() {
        this.setState({shader: true});
    }

    hideShader() {
        this.setState({shader: false});
    }
    
    render() {
        let shader = this.state.shader ? (<ProcessingShader/>) : null;
        
        return (
            <div className="main-layout">
                <ImagesList/>
                <PackProperties/>
                <PackResults/>
                {this.state.messageBox}
                {shader}
                <OldBrowserBlocker/>
            </div>
        );
    }
}

export default MainLayout;