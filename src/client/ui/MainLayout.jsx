import React from 'react';

import ImagesList from './ImagesList.jsx';
import MainHeader from './MainHeader.jsx';
import PackProperties from './PackProperties.jsx';
import PackResults from './PackResults.jsx';
import MessageBox from './MessageBox.jsx';
import ProcessingShader from './ProcessingShader.jsx';
import OldBrowserBlocker from './OldBrowserBlocker.jsx';
import About from './About.jsx';
import Updater from './Updater.jsx';
import EditCustomExporter from './EditCustomExporter.jsx';
import SheetSplitter from './SheetSplitter.jsx';

import {Observer, GLOBAL_EVENT} from '../Observer';

class MainLayout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messageBox: false,
            shader: false,
            about: false,
            editCustomExporter: false,
            updater: false,
            sheetSplitter: false
        };

        this.closeMessage = this.closeMessage.bind(this);
        
        Observer.on(GLOBAL_EVENT.SHOW_MESSAGE, this.showMessage, this);
        Observer.on(GLOBAL_EVENT.SHOW_SHADER, this.showShader, this);
        Observer.on(GLOBAL_EVENT.HIDE_SHADER, this.hideShader, this);
        Observer.on(GLOBAL_EVENT.SHOW_ABOUT, this.showAbout, this);
        Observer.on(GLOBAL_EVENT.HIDE_ABOUT, this.hideAbout, this);
        Observer.on(GLOBAL_EVENT.SHOW_EDIT_CUSTOM_EXPORTER, this.showEditCustomExporter, this);
        Observer.on(GLOBAL_EVENT.HIDE_EDIT_CUSTOM_EXPORTER, this.hideEditCustomExporter, this);
        Observer.on(GLOBAL_EVENT.UPDATE_AVAILABLE, this.onUpdateAvailable, this);
        Observer.on(GLOBAL_EVENT.HIDE_UPDATER, this.hideUpdater, this);
        Observer.on(GLOBAL_EVENT.SHOW_SHEET_SPLITTER, this.showSheetSplitter, this);
        Observer.on(GLOBAL_EVENT.HIDE_SHEET_SPLITTER, this.hideSheetSplitter, this);
    }

    onUpdateAvailable(info) {
        this.setState({updater: info});
    }

    hideUpdater() {
        this.setState({updater: null});
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

    showSheetSplitter() {
        this.setState({sheetSplitter: true});    
    }

    hideSheetSplitter() {
        this.setState({sheetSplitter: false});
    }
    
    render() {
        let shader = this.state.shader ? (<ProcessingShader/>) : null;
        let about = this.state.about ? (<About/>) : null;
        let editCustomExporter = this.state.editCustomExporter ? (<EditCustomExporter/>) : null;
        let updater = this.state.updater ? (<Updater data={this.state.updater}/>) : null;
        let sheetSplitter = this.state.sheetSplitter ? (<SheetSplitter/>) : null;
        
        return (
            
            <div className="main-wrapper">
                <MainHeader/>
                
                <div className="main-layout border-color-gray">
                    <ImagesList/>
                    <PackProperties/>
                    <PackResults/>
                    <OldBrowserBlocker/>
                    {about}
                    {editCustomExporter}
                    {sheetSplitter}
                    {updater}
                    {shader}
                    {this.state.messageBox}
                </div>
            </div>
        );
    }
}

export default MainLayout;