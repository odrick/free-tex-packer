import React from 'react';

import {Observer, GLOBAL_EVENT} from '../Observer';
import appInfo from '../../../package.json';

class MainHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    
    showAbout() {
        Observer.emit(GLOBAL_EVENT.SHOW_ABOUT);
    }
    
    render() {
        return (
            <div className="main-header back-900 color-white">
                <div className="main-header-left">
                    <img src="static/images/logo.png" />
                    {appInfo.displayName} {appInfo.version}
                </div>
                <div className="main-header-right">
                    <div className="main-header-about" onClick={this.showAbout} >?</div>
                </div>
            </div>
        );
    }
}

export default MainHeader;