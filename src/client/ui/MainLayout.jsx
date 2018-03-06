import React from 'react';

import ImagesList from './ImagesList.jsx';
import MainHeader from './MainHeader.jsx';
import PackProperties from './PackProperties.jsx';
import PackResults from './PackResults.jsx';
import MessageBox from './MessageBox.jsx';
import ProcessingShader from './ProcessingShader.jsx';
import OldBrowserBlocker from './OldBrowserBlocker.jsx';
import About from './About.jsx';
import EditCustomExporter from './EditCustomExporter.jsx';

import {Observer, GLOBAL_EVENT} from '../Observer';

class MainLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messageBox: null,
            shader: false,
            about: false,
            editCustomExporter: false
        };

        this.closeMessage = this.closeMessage.bind(this);
        
        Observer.on(GLOBAL_EVENT.SHOW_MESSAGE, this.showMessage, this);
        Observer.on(GLOBAL_EVENT.SHOW_SHADER, this.showShader, this);
        Observer.on(GLOBAL_EVENT.HIDE_SHADER, this.hideShader, this);
        Observer.on(GLOBAL_EVENT.SHOW_ABOUT, this.showAbout, this);
        Observer.on(GLOBAL_EVENT.HIDE_ABOUT, this.hideAbout, this);
        Observer.on(GLOBAL_EVENT.SHOW_EDIT_CUSTOM_EXPORTER, this.showEditCustomExporter, this);
        Observer.on(GLOBAL_EVENT.HIDE_EDIT_CUSTOM_EXPORTER, this.hideEditCustomExporter, this);
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

    showAbout() {
        this.setState({about: true});
    }

    hideAbout() {
        this.setState({about: false});
    }

    showEditCustomExporter() {
        this.setState({editCustomExporter: true});
    }

    hideEditCustomExporter() {
        this.setState({editCustomExporter: false});
    }
    
    render() {
        let shader = this.state.shader ? (<ProcessingShader/>) : null;
        let about = this.state.about ? (<About/>) : null;
        let editCustomExporter = this.state.editCustomExporter ? (<EditCustomExporter/>) : null;
        
        return (
            
            <div className="main-wrapper">
                <MainHeader/>
                
                <div className="main-layout border-color-gray">
                    <ImagesList/>
                    <PackProperties/>
                    <PackResults/>
                    {shader}
                    <OldBrowserBlocker/>
                    {about}
                    {editCustomExporter}
                    {this.state.messageBox}
                </div>
            </div>
        );
    }
}

export default MainLayout;