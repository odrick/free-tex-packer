import React from 'react';

import appInfo from '../../../package.json';

class MainHeader extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="main-header back-900 color-white">
                <div className="main-header-left">
                    <img src="static/images/logo.png" />
                    {appInfo.displayName} {appInfo.version}
                </div>
                <div className="main-header-right">
                    ?
                </div>
            </div>
        );
    }
}

export default MainHeader;